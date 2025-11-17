package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.SubscriptionDTO;
import com.example.SubscriptionService.dto.UserCreatedDTO;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Value("${internal.api.key}")
    private String internalApiKey;

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
        userSubscriptionRepository.save(userSub);
        log.info("Đã kích hoạt gói {} cho User {}", purchasedSub.getName(), userSub.getUserId());

        return subscriptionOrderRepository.save(order);
    }

    // Helper: Quyết định lỗi nào thì retry (lỗi 5xx, lỗi timeout)
    private boolean isRetryable(Throwable throwable) {
        return throwable instanceof WebClientResponseException &&
                ((WebClientResponseException) throwable).getStatusCode().is5xxServerError();
    }
}
