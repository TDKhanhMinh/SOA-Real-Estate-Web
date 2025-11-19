package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.*;
import com.example.SubscriptionService.exception.AppException;
import com.example.SubscriptionService.exception.ErrorCode;
import com.example.SubscriptionService.mapper.SubscriptionMapper;
import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.SubscriptionOrder;
import com.example.SubscriptionService.model.UserSubscription;
import com.example.SubscriptionService.repository.SubscriptionOrderRepository;
import com.example.SubscriptionService.repository.SubscriptionRepository;
import com.example.SubscriptionService.repository.UserSubscriptionRepository;
import com.example.SubscriptionService.request.PurchaseRequest;
import com.example.SubscriptionService.response.ApiResponse;
import com.example.SubscriptionService.request.UpdateSubscriptionRequest;
import com.example.SubscriptionService.response.PurchaseResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionOrderRepository subscriptionOrderRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final WebClient transactionWebClient;
    private final ObjectMapper jacksonObjectMapper;
    private final RabbitTemplate rabbitTemplate;

    @Value("${internal.api.key}")
    private String internalApiKey;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing-key.user-purchased}")
    private String userPurchasedRoutingKey;

    // Xử lý sự kiện tạo subscription basic cho user khi nhận được thông tin user mới tạo từ User Service
    @RabbitListener(queues = "${rabbitmq.queue.user}")
    @Transactional
    public void handleUserCreated(UserCreatedDTO userCreatedDTO) {
        log.info("Nhận được sự kiện User Created: {}", userCreatedDTO);

        boolean check = createBasicSubscription(userCreatedDTO.userId(), userCreatedDTO.email());

        if (!check) {
            log.info("User {} đã có subscription, không tạo mới. Hoặc lỗi khi tạo subscription cho user", userCreatedDTO.userId());
            return;
        }

        log.info("Đã tạo subscription cho user: id: {}, email: {}", userCreatedDTO.userId(), userCreatedDTO.email());
    }

    // Tạo subscription basic cho user
    @Transactional
    protected boolean createBasicSubscription(Long userId, String email) {
        try {
            Optional<UserSubscription> existingUserSubscription = userSubscriptionRepository.findByUserId(userId);

            // Nếu chưa có subscription, tạo mới gói basic
            if (existingUserSubscription.isEmpty()) {
                UserSubscription newUserSubscription;
                newUserSubscription = UserSubscription.builder()
                        .userId(userId)
                        .email(email)
                        .subscriptionId(1L) // Gói basic có ID là 1
                        .startDate(LocalDateTime.now())
                        .endDate(LocalDateTime.now().plusYears(1000)) // Giả sử gói basic không hết hạn
                        .status(UserSubscription.Status.ACTIVE)
                        .build();
                userSubscriptionRepository.save(newUserSubscription);
                log.info("Đã tạo mới basic subscription cho user {}", userId);
                return true;
            }

            if(existingUserSubscription.get().getEmail().isEmpty()){
                existingUserSubscription.get().setEmail(email);
                userSubscriptionRepository.save(existingUserSubscription.get());
                log.info("Cập nhật email cho user subscription của user {}", userId);
            }

            if (existingUserSubscription.get().getSubscriptionId() == 1L) {
                log.info("User {} đã có basic subscription, không tạo mới.", userId);
                return false;
            }

            // Cập nhật subscription hiện tại sang gói basic
            existingUserSubscription.get().setSubscriptionId(1L);
            existingUserSubscription.get().setStartDate(LocalDateTime.now());
            existingUserSubscription.get().setEndDate(LocalDateTime.now().plusYears(1000));
            existingUserSubscription.get().setStatus(UserSubscription.Status.ACTIVE);
            userSubscriptionRepository.save(existingUserSubscription.get());
            log.info("Đã cập nhật sang basic subscription cho user {}", userId);
            return true;
        } catch (Exception e) {
            log.error("Lỗi khi tạo subscription cơ bản cho user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    // Lấy thông tin/benefit của một gói subscription CỤ THỂ
    @Override
    public SubscriptionDTO getSubscriptionDetails(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findByIdAndIsActive(subscriptionId, true)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));

        return subscriptionMapper.toSubscriptionDTO(subscription);
    }

    // Lấy thông tin subscription cụ thể cho admin
    @Override
    public Subscription getSubscriptionById(Long subscriptionId) {
        return subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
    }

    // Lấy thông tin subscription của một USER CỤ THỂ
    @Override
    @Transactional
    public UserSubscriptionDetailsDTO getUserSubscriptionDetails(Long userId) {
        Optional<UserSubscriptionDetailsDTO> userSubscriptionDetails =
                userSubscriptionRepository.findUserSubscriptionDetails(userId, UserSubscription.Status.ACTIVE);

        if(userSubscriptionDetails.isPresent()) {
            return userSubscriptionDetails.get();
        }

        createBasicSubscription(userId, "");

        return userSubscriptionRepository.findUserSubscriptionDetails(userId, UserSubscription.Status.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
    }

    // Lấy TẤT CẢ các gói subscription
    @Override
    public List<Subscription> getAllActiveSubscriptions() {
        return subscriptionRepository.findByIsActive(true);
    }

    // Lay TẤT CẢ các gói subscription (Admin)
    @Override
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    // TẠO một gói subscription mới (Admin)
    @Override
    public Subscription createSubscriptionPackage(SubscriptionDTO subscriptionDTO) {
        Subscription subscription = subscriptionMapper.toSubscription(subscriptionDTO);
        return subscriptionRepository.save(subscription);
    }

    // CẬP NHẬT thông tin một gói subscription (Admin)
    @Override
    @Transactional
    public Subscription updateSubscriptionPackage(Long subscriptionId, UpdateSubscriptionRequest updateSubscriptionRequest) {
        if(subscriptionId == 1L && !updateSubscriptionRequest.isActive()) {
            throw new AppException(ErrorCode.CANNOT_INACTIVE_BASIC_SUBSCRIPTION);
        }

        return subscriptionRepository.findById(subscriptionId)
                .map(existingSubscription -> {
                    existingSubscription.setName(updateSubscriptionRequest.name());
                    existingSubscription.setPrice(updateSubscriptionRequest.price());
                    existingSubscription.setDuration(updateSubscriptionRequest.duration());
                    existingSubscription.setDescription(updateSubscriptionRequest.description());
                    existingSubscription.setMaxPost(updateSubscriptionRequest.maxPost());
                    existingSubscription.setPriority(updateSubscriptionRequest.priority());
                    existingSubscription.setPostExpiryDays(updateSubscriptionRequest.postExpiryDays());
                    existingSubscription.setIsActive(updateSubscriptionRequest.isActive());
                    return subscriptionRepository.save(existingSubscription);
                })
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
    }

    // Hủy subscription hiện tại của user
    @Override
    @Transactional
    public void cancelUserSubscription(Long userId) {

        boolean check = createBasicSubscription(userId, "");
        if (!check) {
            log.info("User {} đã có basic subscription, không cần hủy nữa.", userId);
            return;
        }
        log.info("Đã hủy subscription hiện tại và chuyển sang basic cho user: {}", userId);
    }

    // Mua gói subscription
    @Override
    @Transactional
    public SubscriptionOrder purchaseSubscription(Long userId, Long subscriptionId) {

        // 1. LẤY SUBSCRIPTION HIỆN TẠI (VỚI PESSIMISTIC LOCK)
        UserSubscription currentUserSub = userSubscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. LẤY GÓI MUỐN MUA
        Subscription subToPurchase = subscriptionRepository.findByIdAndIsActive(subscriptionId, true)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));

        // 3. LOGIC KIỂM TRA MUA HÀNG MỚI
        boolean isCurrentBasic = currentUserSub.getSubscriptionId().equals(1L);
        boolean isStacking = currentUserSub.getSubscriptionId().equals(subscriptionId);

        // Chỉ cho phép nếu:
        // 1. Gói hiện tại là Basic (ID=1)
        // 2. Hoặc đang mua chính gói hiện tại (để stack/gia hạn)
        if (!isCurrentBasic && !isStacking) {
            log.warn("User {} cố gắng mua gói {} trong khi đang ở gói {}. Từ chối.",
                    userId, subscriptionId, currentUserSub.getSubscriptionId());

            // Bạn cần tự định nghĩa ErrorCode này
            throw new AppException(ErrorCode.CANNOT_PURCHASE_DIFFERENT_PLAN);
        }

        // 4. Tạo Order PENDING
        SubscriptionOrder order = SubscriptionOrder.builder()
                .userId(userId)
                .email(currentUserSub.getEmail())
                .subscriptionId(subscriptionId)
                .subscriptionName(subToPurchase.getName())
                .amount(subToPurchase.getPrice())
                .status(SubscriptionOrder.Status.PENDING)
                .updatedAt(LocalDateTime.now())
                .build();
        SubscriptionOrder savedOrder = subscriptionOrderRepository.save(order);
        log.info("Đã tạo SubscriptionOrder PENDING với ID: {}", savedOrder.getId());

        // 5. Chuẩn bị DTO gọi API (Logic này giữ nguyên)
        PurchaseRequest purchaseRequest = PurchaseRequest.builder()
                .subscriptionOrderId(savedOrder.getId())
                .email(currentUserSub.getEmail())
                .userName(currentUserSub.getEmail()) // Tạm dùng email
                .subscriptionId(subscriptionId)
                .subscriptionName(subToPurchase.getName())
                .amount(subToPurchase.getPrice())
                .build();

        try {
            // 6. GỌI API ĐỒNG BỘ VÀ RETRY (Logic này giữ nguyên)
            ApiResponse<PurchaseResponse> apiResponse = transactionWebClient.post()
                    .uri("/transaction/purchase")
                    .header("X-Internal-API-Key", internalApiKey)
                    .header("X-User-Id", String.valueOf(userId))
                    .header("X-Role", "SERVICE")
                    .bodyValue(purchaseRequest)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> Mono.error(
                                            new WebClientResponseException(
                                                    clientResponse.statusCode().value(),
                                                    "Lỗi nghiệp vụ: " + errorBody,
                                                    clientResponse.headers().asHttpHeaders(),
                                                    errorBody.getBytes(), null)
                                    )))
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<PurchaseResponse>>() {})
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .filter(this::isRetryable)
                            .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) ->
                                    new RuntimeException("RETRY_EXHAUSTED", retrySignal.failure())
                            ))
                    .block();

            PurchaseResponse purchaseResponse = (apiResponse != null) ? apiResponse.getData() : null;

            log.info("Nhận được phản hồi từ TransactionService cho OrderID {}: {}", savedOrder.getId(), purchaseResponse);

            // 7. Xử lý KẾT QUẢ THÀNH CÔNG
            if (purchaseResponse != null && PurchaseResponse.Status.COMPLETED.equals(purchaseResponse.getStatus())) {
                log.info("Giao dịch thành công cho OrderID: {}", savedOrder.getId());

                // Logic "stack" nằm trong hàm updateOrderOnSuccess
                return updateOrderOnSuccess(savedOrder, subToPurchase, currentUserSub);
            } else {
                log.error("Lỗi logic: Giao dịch trả về không COMPLETED.");
                savedOrder.setStatus(SubscriptionOrder.Status.FAILED);
                return subscriptionOrderRepository.save(savedOrder);
            }

        } catch (WebClientResponseException e) {
            // 8. Xử lý LỖI NGHIỆP VỤ (4xx)
            log.warn("Lỗi nghiệp vụ từ TransactionService ({}): {}", e.getRawStatusCode(), e.getResponseBodyAsString());
            savedOrder.setStatus(SubscriptionOrder.Status.FAILED);
            subscriptionOrderRepository.save(savedOrder);
            String cleanErrorMessage = "Giao dịch thất bại. Vui lòng thử lại."; // Tin nhắn mặc định

            try {
                // 1. Dùng ObjectMapper để đọc chuỗi JSON lỗi
                // (ApiResponse.class là file bạn tạo ở bước trước)
                ApiResponse<?> errorResponse = jacksonObjectMapper.readValue(e.getResponseBodyAsString(), ApiResponse.class);

                // 2. Lấy ra message sạch từ trong JSON
                if (errorResponse != null && errorResponse.getMessage() != null) {
                    cleanErrorMessage = errorResponse.getMessage();
                }
            } catch (JsonProcessingException jsonEx) {
                // Nếu không parse được JSON, dùng message gốc của lỗi
                log.error("Không thể parse JSON lỗi từ TransactionService: {}", jsonEx.getMessage());
                cleanErrorMessage = e.getMessage(); // Fallback
            }

            throw new AppException(ErrorCode.TRANSACTION_FAILED, cleanErrorMessage);

        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("RETRY_EXHAUSTED")) {
                log.error("Hết số lần thử lại cho OrderID: {}. Chuyển sang REVIEW_NEEDED.", savedOrder.getId());
                savedOrder.setStatus(SubscriptionOrder.Status.REVIEW_NEEDED);
                return subscriptionOrderRepository.save(savedOrder);
            }
            // Lỗi không xác định khác
            log.error("Lỗi không xác định khi mua hàng: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi hệ thống", e);
        }
    }

    @Override
    public Page<SubscriptionOrder> getUserSubscriptionHistory(Long userId, Pageable pageable) {
        return subscriptionOrderRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<SubscriptionOrder> getAllSubscriptionHistory(String search,
                                                             SubscriptionOrder.Status status,
                                                             Long subscriptionId,
                                                             LocalDate startDate,
                                                             LocalDate endDate,
                                                             Pageable pageable) {
        // Xây dựng Specification
        Specification<SubscriptionOrder> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (subscriptionId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("subscriptionId"), subscriptionId));
        }

        if (startDate != null) {
            spec = spec.and((root, query, cb) -> {
                LocalDateTime start = startDate.atStartOfDay();
                LocalDateTime end = (endDate != null) ? endDate.plusDays(1).atStartOfDay() : startDate.plusDays(1).atStartOfDay();
                return cb.between(root.get("updatedAt"), start, end); // Dùng updatedAt làm mốc
            });
        }

        if (StringUtils.hasText(search)) {
            spec = spec.and((root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();
                String likePattern = "%" + search.toLowerCase() + "%";

                // Search theo email
                predicates.add(cb.like(cb.lower(root.get("email")), likePattern));

                // Thử search theo User ID (nếu là số)
                try {
                    Long idVal = Long.parseLong(search);
                    predicates.add(cb.equal(root.get("userId"), idVal));
                } catch (NumberFormatException ignored) {}

                return cb.or(predicates.toArray(new Predicate[0]));
            });
        }

        return subscriptionOrderRepository.findAll(spec, pageable);
    }

    @Override
    public List<RevenueStatDTO> getRevenueStatistics(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().minusDays(30); // Mặc định 30 ngày
        if (endDate == null) endDate = LocalDate.now();

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // Hết ngày cuối cùng

        return subscriptionOrderRepository.getRevenueStats(startDateTime, endDateTime);
    }

    @Override
    public List<SubscriptionStatDTO> getUserSubscriptionStats() {
        return userSubscriptionRepository.getUserStatsBySubscription();
    }

    @Override
    public Page<UserSubscriptionDetailsDTO> getUsersBySubscriptionPackage(Long subscriptionId, Pageable pageable) {
        // Lấy thông tin gói để hiển thị
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND, ErrorCode.SUBSCRIPTION_NOT_FOUND.getMessage() + ": " + subscriptionId));

        // Tìm user
        Page<UserSubscription> users = userSubscriptionRepository.findBySubscriptionIdAndStatus(
                subscriptionId, UserSubscription.Status.ACTIVE, pageable);

        // Convert sang DTO
        return users.map(userSub -> UserSubscriptionDetailsDTO.builder()
                .userId(userSub.getUserId())
                .email(userSub.getEmail())
                .startDate(userSub.getStartDate())
                .endDate(userSub.getEndDate())
                .status(UserSubscription.Status.valueOf(userSub.getStatus().name()))
                .subscriptionId(subscription.getId())
                .subscriptionName(subscription.getName())
                .price(subscription.getPrice())
                .build());
    }

    @Override
    @Transactional
    public void assignSubscriptionToUser(Long userId, Long subscriptionId) {
        log.info("Admin đang gán gói {} cho user {}", subscriptionId, userId);

        // Tìm user subscription hiện tại
        UserSubscription userSub = userSubscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Tìm gói subscription mục tiêu
        Subscription targetSubscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));

        // Case stacking (gia hạn)
        if (userSub.getSubscriptionId().equals(subscriptionId)) {
            log.info("User {} đang ở gói {}, thực hiện stacking (gia hạn).", userId, subscriptionId);
            LocalDateTime currentEndDate = userSub.getEndDate();
            LocalDateTime baseDate = (currentEndDate != null && currentEndDate.isAfter(LocalDateTime.now()))
                    ? currentEndDate
                    : LocalDateTime.now();
            userSub.setEndDate(baseDate.plusDays(targetSubscription.getDuration()));
            userSub.setStatus(UserSubscription.Status.ACTIVE);
            userSubscriptionRepository.save(userSub);
            log.info("Đã gia hạn gói {} cho user {}.", targetSubscription.getName(), userId);
            return;
        }

        // Case nâng cấp từ Basic hoặc chuyển đổi gói khác
        log.info("Gán gói {} cho user {}.", subscriptionId, userId);

        // Cập nhật thông tin gói cho user
        userSub.setSubscriptionId(targetSubscription.getId());
        userSub.setStatus(UserSubscription.Status.ACTIVE);

        LocalDateTime now = LocalDateTime.now();
        userSub.setStartDate(now);
        userSub.setEndDate(now.plusDays(targetSubscription.getDuration()));

        userSubscriptionRepository.save(userSub);
        log.info("Đã gán thành công gói {} cho user {}. Hết hạn vào: {}",
                targetSubscription.getName(), userId, userSub.getEndDate());
    }

    @Override
    @Transactional
    public SubscriptionOrder reviewSubscriptionOrder(Long orderId, boolean isApproved) {
        SubscriptionOrder order = subscriptionOrderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_ORDER_NOT_FOUND));

        // 2. Chỉ xử lý đơn đang cần Review
        if (order.getStatus() != SubscriptionOrder.Status.REVIEW_NEEDED) {
            throw new AppException(ErrorCode.ORDER_STATUS_INVALID);
        }

        log.info("Admin đang xử lý đơn hàng {}. Duyệt: {}", orderId, isApproved);

        if (isApproved) {
            // --- APPROVE: DÙNG LẠI HÀM ASSIGN ---
            // Gọi hàm assign để kích hoạt gói cho user
            assignSubscriptionToUser(order.getUserId(), order.getSubscriptionId());

            // Cập nhật trạng thái đơn hàng
            order.setStatus(SubscriptionOrder.Status.COMPLETED);
            log.info("Đơn hàng {} đã được duyệt và hoàn tất.", orderId);
        } else {
            // --- REJECT: TỪ CHỐI ---
            order.setStatus(SubscriptionOrder.Status.FAILED);
            log.info("Đơn hàng {} đã bị từ chối.", orderId);
        }

        // Cập nhật thời gian sửa đổi
        order.setUpdatedAt(LocalDateTime.now());

        return subscriptionOrderRepository.save(order);
    }

    // Helper: Cập nhật order và user subscription khi thành công
    @Transactional
    protected SubscriptionOrder updateOrderOnSuccess(SubscriptionOrder order, Subscription purchasedSub, UserSubscription userSub) {
        order.setStatus(SubscriptionOrder.Status.COMPLETED);

        // Xác định xem đây là nâng cấp từ Basic hay là Stacking
        // (Chúng ta giả định hàm purchaseSubscription đã chặn các trường hợp khác)
        boolean isUpgradingFromBasic = userSub.getSubscriptionId().equals(1L);

        // 1. Cập nhật thông tin gói (ID, Status)
        userSub.setSubscriptionId(purchasedSub.getId());
        userSub.setStatus(UserSubscription.Status.ACTIVE);

        // 2. Xử lý logic ngày tháng theo yêu cầu của bạn
        if (isUpgradingFromBasic) {
            // NÂNG CẤP TỪ BASIC
            // Đặt lại cả StartDate và EndDate về hiện tại
            log.info("Nâng cấp từ Basic cho User {}. Đặt lại ngày.", userSub.getUserId());
            userSub.setStartDate(LocalDateTime.now());
            userSub.setEndDate(LocalDateTime.now().plusDays(purchasedSub.getDuration()));

        } else {
            // STACKING (GIA HẠN)
            // Giữ nguyên StartDate, chỉ cộng dồn EndDate
            log.info("Gia hạn gói cho User {}. Cộng dồn EndDate.", userSub.getUserId());

            // Lấy ngày hết hạn hiện tại (có thể là quá khứ hoặc tương lai)
            LocalDateTime currentEndDate = userSub.getEndDate();

            // Xác định "mốc" để bắt đầu cộng dồn:
            // - Nếu gói cũ vẫn còn hạn: mốc là ngày hết hạn cũ.
            // - Nếu gói cũ đã hết hạn: mốc là thời điểm hiện tại.
            LocalDateTime baseDate = (currentEndDate != null && currentEndDate.isAfter(LocalDateTime.now()))
                    ? currentEndDate
                    : LocalDateTime.now();

            // Đặt EndDate mới = mốc + thời hạn gói
            userSub.setEndDate(baseDate.plusDays(purchasedSub.getDuration()));
        }

        // 3. Lưu thay đổi
        UserSubscription savedUserSubscription = userSubscriptionRepository.save(userSub);
        log.info("Đã kích hoạt gói {} cho User {}", purchasedSub.getName(), userSub.getUserId());

        SubscriptionOrder savedTransaction = subscriptionOrderRepository.save(order);
        log.info("Cập nhật trạng thái đơn hàng {} thành COMPLETED.", savedTransaction.getId());

        try{
            Map<String, Object> emailProps = new HashMap<>();
            emailProps.put("subscriptionOrderId", savedTransaction.getId());
            emailProps.put("amount", savedTransaction.getAmount());
            emailProps.put("updatedAt", savedTransaction.getUpdatedAt().toString());
            emailProps.put("subscriptionId", savedTransaction.getSubscriptionId());
            emailProps.put("subscriptionName", savedTransaction.getSubscriptionName());
            emailProps.put("price", purchasedSub.getPrice());
            emailProps.put("duration", purchasedSub.getDuration());
            emailProps.put("maxPost", purchasedSub.getMaxPost());
            emailProps.put("priority", purchasedSub.getPriority());
            emailProps.put("postExpiryDays", purchasedSub.getPostExpiryDays());
            emailProps.put("startDate", savedUserSubscription.getStartDate().toString());
            emailProps.put("endDate", savedUserSubscription.getEndDate().toString());

            EmailNotificationDTO emailNotificationDTO = new EmailNotificationDTO(
                    savedTransaction.getEmail(),
                    "Purchase Subscription Successful: " + savedTransaction.getSubscriptionName(),
                    "PURCHASE_SUBSCRIPTION_EMAIL",
                    savedTransaction.getUserId(),
                    emailProps
            );

            rabbitTemplate.convertAndSend(
                    exchangeName,
                    userPurchasedRoutingKey,
                    emailNotificationDTO
            );

            log.info("Sent 'purchased subscription' message to RabbitMQ for user: {}", savedTransaction.getEmail());
        } catch (Exception e) {
            log.error("Failed to send 'purchased subscription' message for user {}: {}", savedTransaction.getEmail(), e.getMessage());
        }

        return savedTransaction;
    }

    // Helper: Quyết định lỗi nào thì retry (lỗi 5xx, lỗi timeout)
    private boolean isRetryable(Throwable throwable) {
        return throwable instanceof WebClientResponseException &&
                ((WebClientResponseException) throwable).getStatusCode().is5xxServerError();
    }

    // Tác vụ định kỳ quét các gói thuê bao đã hết hạn và hạ cấp về Basic
    @Scheduled(cron = "0 0 0 * * ?")
    public void scanAndDowngradeExpiredSubscriptions() {
        log.info("Bắt đầu tác vụ quét các gói thuê bao đã hết hạn...");

        LocalDateTime now = LocalDateTime.now();

        // 1. Lấy danh sách ứng viên hết hạn
        List<UserSubscription> expiredCandidates = userSubscriptionRepository.findExpiredSubscriptions(now);

        if (expiredCandidates.isEmpty()) {
            return;
        }

        log.info("Tìm thấy {} ứng viên hết hạn. Bắt đầu xử lý từng user...", expiredCandidates.size());

        int successCount = 0;

        // 2. Xử lý từng user
        for (UserSubscription candidate : expiredCandidates) {
            try {
                // Gọi hàm riêng biệt có Transactional cho từng user
                // Để lock chỉ giữ trong tích tắc khi xử lý 1 người, xong là nhả ra ngay
                downgradeSingleUser(candidate.getUserId(), now);
                successCount++;
            } catch (Exception e) {
                log.error("Lỗi khi hạ cấp gói cho User {}: {}", candidate.getUserId(), e.getMessage());
            }
        }
        log.info("Hoàn tất. Đã hạ cấp {}/{} gói.", successCount, expiredCandidates.size());
    }

    // Tách ra hàm riêng để Transaction và Lock chỉ phạm vi nhỏ này
    @Transactional
    public void downgradeSingleUser(Long userId, LocalDateTime now) {
        // 1. Tìm lại và KHÓA dòng dữ liệu này (Pessimistic Write)
        UserSubscription sub = userSubscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. DOUBLE-CHECK (Kiểm tra lại điều kiện quan trọng nhất)
        // Phòng trường hợp user vừa mới gia hạn trong tíc tắc
        if (sub.getEndDate().isAfter(now) || sub.getSubscriptionId() == 1L) {
            log.info("User {} đã gia hạn hoặc không còn hết hạn nữa. Bỏ qua.", userId);
            return;
        }

        // 3. Thực hiện hạ cấp
        Long oldSubId = sub.getSubscriptionId();
        sub.setSubscriptionId(1L);
        sub.setStartDate(now);
        sub.setEndDate(now.plusYears(100));

        userSubscriptionRepository.save(sub);
        log.info("Đã chuyển User {} từ gói {} về Basic.", sub.getUserId(), oldSubId);
    }
}
