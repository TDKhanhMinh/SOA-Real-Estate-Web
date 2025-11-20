package com.example.ListingService.service;

import com.example.ListingService.dto.EmailNotificationDTO;
import com.example.ListingService.dto.UserSubscriptionDetailsDTO;
import com.example.ListingService.exception.AppException;
import com.example.ListingService.exception.ErrorCode;
import com.example.ListingService.mapper.PropertyMapper;
import com.example.ListingService.model.Property;
import com.example.ListingService.repository.PropertyImageRepository;
import com.example.ListingService.repository.PropertyRepository;
import com.example.ListingService.request.CreatePropertyRequest;
import com.example.ListingService.request.PropertyActionRequest;
import com.example.ListingService.request.UpdatePropertyRequest;
import com.example.ListingService.response.ApiResponse;
import com.example.ListingService.response.PropertyResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.example.ListingService.model.PropertyImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ListingServiceImpl implements ListingService{
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final WebClient subscriptionWebClient;
    private final ObjectMapper jacksonObjectMapper;
    private final RabbitTemplate rabbitTemplate;
    private final PropertyMapper propertyMapper;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing-key.property-validated}")
    private String propertyValidatedRoutingKey;

    @Override
    @Transactional
    public PropertyResponse createProperty(Long userId, CreatePropertyRequest request) {
        // Tạo Property Entity từ Request
        Property property = Property.builder()
                .realtorId(userId)
                .realtorEmail(request.getEmail())
                .realtorName(request.getName())
                .realtorPhone(request.getPhone())
                .title(request.getTitle())
                .price(request.getPrice())
                .address(request.getAddress())
                .longitude(request.getLongitude())
                .latitude(request.getLatitude())
                .amenities(request.getAmenities())
                .propertyTransactionType(request.getPropertyTransactionType())
                .propertyType(request.getPropertyType())
                .legalPapers(request.getLegalPapers())
                .description(request.getDescription())
                .floorNumber(request.getFloorNumber())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .area(request.getArea())
                .status(Property.Status.DRAFT) // Mặc định là DRAFT
                .isDeleted(false)
                .updatedAt(LocalDateTime.now())
                .build();

        Property savedProperty = propertyRepository.save(property);

        // Lưu danh sách ảnh (nếu có)
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<PropertyImage> images = request.getImageUrls().stream()
                    .map(url -> PropertyImage.builder()
                            .propertyId(savedProperty.getId())
                            .imageUrl(url)
                            .build())
                    .collect(Collectors.toList());
            propertyImageRepository.saveAll(images);
        }

        return PropertyResponse.builder()
                .id(savedProperty.getId())
                .title(savedProperty.getTitle())
                .price(savedProperty.getPrice())
                .address(savedProperty.getAddress())
                .longitude(savedProperty.getLongitude())
                .latitude(savedProperty.getLatitude())
                .amenities(savedProperty.getAmenities())
                .propertyTransactionType(savedProperty.getPropertyTransactionType())
                .propertyType(savedProperty.getPropertyType())
                .legalPapers(savedProperty.getLegalPapers())
                .description(savedProperty.getDescription())
                .floorNumber(savedProperty.getFloorNumber())
                .bedrooms(savedProperty.getBedrooms())
                .bathrooms(savedProperty.getBathrooms())
                .area(savedProperty.getArea())
                .status(savedProperty.getStatus() != null ? savedProperty.getStatus().name() : null)
                .priority(savedProperty.getPriority())
                .expiresAt(savedProperty.getExpiresAt())
                .updatedAt(savedProperty.getUpdatedAt())
                .rejectReason(savedProperty.getRejectReason())
                .realtorId(savedProperty.getRealtorId())
                .realtorEmail(savedProperty.getRealtorEmail())
                .realtorName(savedProperty.getRealtorName())
                .realtorPhone(savedProperty.getRealtorPhone())
                .imageUrls(request.getImageUrls())
                .build();
    }

    @Override
    @Transactional
    public void submitProperty(Long userId, Long propertyId) {
        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND));

        if (property.getStatus() != Property.Status.DRAFT) {
            throw new AppException(ErrorCode.INVALID_ACTION, "Chỉ bài ở trạng thái DRAFT mới có thể gửi duyệt.");
        }

        // --- GỌI SUBSCRIPTION SERVICE ---
        UserSubscriptionDetailsDTO subDetails = callSubscriptionService(userId);

        // Kiểm tra trạng thái gói
        if (!"ACTIVE".equals(subDetails.getStatus().name())) {
            throw new AppException(ErrorCode.SUBSCRIPTION_INACTIVE, "Gói cước không hoạt động. Vui lòng gia hạn hoặc nâng cấp gói.");
        }

        // Đếm số lượng bài đang chiếm dụng "Slot" (AVAILABLE + PENDING + HIDDEN)
        List<Property.Status> activeStatuses = List.of(
                Property.Status.AVAILABLE,
                Property.Status.PENDING_APPROVAL,
                Property.Status.HIDDEN
        );
        List<Long> currentActivePostIds = propertyRepository.findIdsByRealtorIdAndStatusInLocked(userId, activeStatuses);
        long currentCount = currentActivePostIds.size();

        // Nếu bài này là bài mới (chưa nằm trong list active) thì check limit
        boolean isNewSubmission = !activeStatuses.contains(property.getStatus());

        if (isNewSubmission && currentCount >= subDetails.getMaxPost()) {
            throw new AppException(ErrorCode.POST_LIMIT_EXCEEDED,
                    "Đạt giới hạn đăng bài (" + subDetails.getMaxPost() + "). Vui lòng nâng cấp gói.");
        }

        // Áp dụng quyền lợi
        property.setPriority(subDetails.getPriority());
        property.setStatus(Property.Status.PENDING_APPROVAL);
        property.setUpdatedAt(LocalDateTime.now());

        propertyRepository.save(property);
        log.info("User {} gửi duyệt bài {}. Priority: {}", userId, propertyId, subDetails.getPriority());
    }

    @Override
    @Transactional
    public PropertyResponse updateProperty(Long userId, Long propertyId, UpdatePropertyRequest request) {
        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        // Map dữ liệu update (Check null để support partial update)
        if (request.getTitle() != null) property.setTitle(request.getTitle());
        if (request.getPrice() != null) property.setPrice(request.getPrice());
        if (request.getAddress() != null) property.setAddress(request.getAddress());
        if (request.getLongitude() != null) property.setLongitude(request.getLongitude());
        if (request.getLatitude() != null) property.setLatitude(request.getLatitude());
        if (request.getAmenities() != null) property.setAmenities(request.getAmenities());
        if (request.getPropertyTransactionType() != null) property.setPropertyTransactionType(request.getPropertyTransactionType());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());
        if (request.getLegalPapers() != null) property.setLegalPapers(request.getLegalPapers());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getFloorNumber() != null) property.setFloorNumber(request.getFloorNumber());
        if (request.getBedrooms() != null) property.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) property.setBathrooms(request.getBathrooms());
        if (request.getArea() != null) property.setArea(request.getArea());
        if (request.getEmail() != null) property.setRealtorEmail(request.getEmail());
        if (request.getPhone() != null) property.setRealtorPhone(request.getPhone());
        if (request.getName() != null) property.setRealtorName(request.getName());

        // Update ảnh (Xóa cũ thêm mới)
        if (request.getImageUrls() != null) {
            propertyImageRepository.deleteByPropertyId(propertyId); // Xóa ảnh cũ
            if (!request.getImageUrls().isEmpty()) {
                List<PropertyImage> newImages = request.getImageUrls().stream()
                        .map(url -> PropertyImage.builder()
                                .propertyId(propertyId)
                                .imageUrl(url)
                                .build())
                        .collect(Collectors.toList());
                propertyImageRepository.saveAll(newImages);
            }
        }

        // Nếu đang chạy/chờ duyệt/đã bán mà sửa -> Về DRAFT (Bắt duyệt lại)
        if (property.getStatus() == Property.Status.AVAILABLE ||
                property.getStatus() == Property.Status.PENDING_APPROVAL ||
                property.getStatus() == Property.Status.HIDDEN ||
                property.getStatus() == Property.Status.SOLD ||
                property.getStatus() == Property.Status.RENTED) {

            property.setStatus(Property.Status.DRAFT);
            log.info("Bài đăng {} đã cập nhật nội dung -> Chuyển về DRAFT.", propertyId);
        }

        property.setUpdatedAt(LocalDateTime.now());

        Property savedProperty = propertyRepository.save(property);
        return propertyMapper.toPropertyResponse(savedProperty);
    }

    @Override
    @Transactional
    public void toggleVisibility(Long userId, Long propertyId) {
        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        if (property.getStatus() == Property.Status.AVAILABLE) {
            property.setStatus(Property.Status.HIDDEN);
        } else if (property.getStatus() == Property.Status.HIDDEN) {
            // Check hạn sử dụng khi bật lại
            if (property.getExpiresAt() != null && property.getExpiresAt().isBefore(LocalDateTime.now())) {
                property.setStatus(Property.Status.EXPIRED);
                throw new AppException(ErrorCode.INVALID_ACTION, "Bài đăng đã hết hạn sử dụng và không thể hiển thị lại.");
            }
            property.setStatus(Property.Status.AVAILABLE);
        } else {
            throw new AppException(ErrorCode.INVALID_ACTION, "Chỉ bài đang hiển thị hoặc ẩn mới có thể thay đổi trạng thái.");
        }
        property.setUpdatedAt(LocalDateTime.now());
        propertyRepository.save(property);
    }

    @Override
    @Transactional
    public void markAsSold(Long userId, Long propertyId) {
        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        if (property.getStatus() != Property.Status.AVAILABLE && property.getStatus() != Property.Status.HIDDEN) {
            throw new AppException(ErrorCode.INVALID_ACTION, "Chỉ bài đang hoạt động mới có thể đánh dấu đã bán.");
        }

        property.setStatus(Property.Status.SOLD);
        property.setUpdatedAt(LocalDateTime.now());
        propertyRepository.save(property);
    }

    @Override
    @Transactional
    public void markAsRented(Long userId, Long propertyId) {
        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        if (property.getStatus() != Property.Status.AVAILABLE && property.getStatus() != Property.Status.HIDDEN) {
            throw new AppException(ErrorCode.INVALID_ACTION, "Chỉ bài đang hoạt động mới có thể đánh dấu đã thuê.");
        }

        property.setStatus(Property.Status.RENTED);
        property.setUpdatedAt(LocalDateTime.now());
        propertyRepository.save(property);
    }

    @Override
    @Transactional
    public void deleteProperty(Long userId, Long propertyId) {
        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        property.setIsDeleted(true);
        property.setUpdatedAt(LocalDateTime.now());
        propertyRepository.save(property);
    }

    @Override
    public Page<PropertyResponse> getMyListings(Long userId, String search, Property.Status status, Pageable pageable) {
        Specification<Property> spec = Specification.where(isNotDeleted())
                .and(hasRealtorId(userId));

        // Loại bỏ SOLD và RENTED
//        spec = spec.and((root, query, cb) ->
//                cb.not(root.get("status").in(Property.Status.SOLD, Property.Status.RENTED))
//        );

        // Filter theo Status (nếu có gửi lên)
        if (status != null) {
            spec = spec.and(hasStatus(status));
        }

        // Search theo Title
        if (StringUtils.hasText(search)) {
            spec = spec.and(titleContains(search));
        }

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return propertyPage.map(propertyMapper::toPropertyResponse);
    }

    @Override
    public Page<PropertyResponse> getMySoldRentListings(Long userId, String search, Property.Status status, Pageable pageable) {
        Specification<Property> spec = Specification.where(isNotDeleted())
                .and(hasRealtorId(userId));

        // Chỉ lấy SOLD hoặc RENTED
        if (status != null) {
            // Nếu user chọn lọc cụ thể (vd: chỉ xem SOLD)
            if (status == Property.Status.SOLD || status == Property.Status.RENTED) {
                spec = spec.and(hasStatus(status));
            } else {
                return Page.empty();
            }
        } else {
            // Mặc định lấy cả SOLD và RENTED
            spec = spec.and((root, query, cb) ->
                    root.get("status").in(Property.Status.SOLD, Property.Status.RENTED)
            );
        }

        if (StringUtils.hasText(search)) {
            spec = spec.and(titleContains(search));
        }

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return propertyPage.map(propertyMapper::toPropertyResponse);
    }

    @Override
    public PropertyResponse getMyListingDetail(Long userId, Long propertyId) {

        Property property = propertyRepository.findByIdAndRealtorIdAndIsDeletedFalse(propertyId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        return propertyMapper.toPropertyResponse(property);
    }

    @Override
    @Transactional
    public void approveProperty(Long propertyId, PropertyActionRequest request) {
        Property property = propertyRepository.findByIdAndIsDeletedFalse(propertyId) // Admin tìm bằng ID gốc
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng hoặc đã bị xóa."));

        if (property.getStatus() != Property.Status.PENDING_APPROVAL) {
            throw new AppException(ErrorCode.INVALID_ACTION, "Bài đăng không ở trạng thái chờ duyệt.");
        }

        String template = "";
        String subject = "";
        Map<String, Object> emailProps = new HashMap<>();

        if (request.isApproved()) {
            property.setStatus(Property.Status.AVAILABLE);
            // Gọi lại Subscription để lấy postExpiryDays
            UserSubscriptionDetailsDTO subDetails = callSubscriptionService(property.getRealtorId());

            int expiryDays = (subDetails.getPostExpiryDays() != null) ? subDetails.getPostExpiryDays() : 30;
            property.setExpiresAt(LocalDateTime.now().plusDays(expiryDays));

            property.setRejectReason(null); // Xóa lý do từ chối nếu có

            log.info("Admin duyệt bài {}. Hết hạn: {}", propertyId, property.getExpiresAt());

            template = "PROPERTY_APPROVED_EMAIL";
            subject = "Your property listing has been approved!";
            emailProps.put("status", "Đang hiển thị");
            emailProps.put("expiresAt", property.getExpiresAt().toString());
            emailProps.put("expiryDays", expiryDays);
            emailProps.put("priority", property.getPriority());

        } else {
            property.setStatus(Property.Status.REJECTED);
            property.setRejectReason(request.getRejectReason());
            log.info("Admin từ chối bài {}. Lý do: {}", propertyId, request.getRejectReason());

            template = "PROPERTY_REJECTED_EMAIL";
            subject = "Your property listing has been rejected";
            emailProps.put("status", "Đã từ chối");
            emailProps.put("rejectReason", request.getRejectReason());
        }

        property.setUpdatedAt(LocalDateTime.now());
        Property savedProperty = propertyRepository.save(property);

        // Gửi message qua RabbitMQ để gửi email
        try{
            emailProps.put("propertyId", savedProperty.getId());
            emailProps.put("propertyTitle", savedProperty.getTitle());
            emailProps.put("updatedAt", savedProperty.getUpdatedAt().toString());
            emailProps.put("realtorName", savedProperty.getRealtorName());
            emailProps.put("realtorEmail", savedProperty.getRealtorEmail());
            emailProps.put("realtorPhone", savedProperty.getRealtorPhone());

            String imageUrl = propertyImageRepository.findFirstByPropertyId(savedProperty.getId())
                    .map(PropertyImage::getImageUrl)
                    .orElse("https://w7.pngwing.com/pngs/848/762/png-transparent-computer-icons-home-house-home-angle-building-rectangle-thumbnail.png");

            emailProps.put("propertyImageURL", imageUrl);

            EmailNotificationDTO emailNotificationDTO = new EmailNotificationDTO(
                    savedProperty.getRealtorEmail(),
                    subject,
                    template,
                    savedProperty.getRealtorId(),
                    emailProps
            );

            rabbitTemplate.convertAndSend(
                    exchangeName,
                    propertyValidatedRoutingKey,
                    emailNotificationDTO
            );

            log.info("Sent 'approved or rejected' message to RabbitMQ for user: {}", savedProperty.getRealtorEmail());
        } catch (Exception e) {
            log.error("Failed to send 'approved or rejected' message for user {}: {}", savedProperty.getRealtorEmail(), e.getMessage());
        }
    }

    @Override
    public Page<PropertyResponse> getPendingListings(String search, Pageable pageable) {
        Specification<Property> spec = Specification.where(isNotDeleted())
                .and(hasStatus(Property.Status.PENDING_APPROVAL));

        if (StringUtils.hasText(search)) {
            spec = spec.and(titleContains(search));
        }

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return propertyPage.map(propertyMapper::toPropertyResponse);
    }

    @Override
    public Page<PropertyResponse> getUserListingsByAdmin(Long userId, String search, Property.Status status, boolean includeDeleted, Pageable pageable) {
        // Khởi tạo Spec rỗng (chọn tất cả)
        Specification<Property> spec = Specification.where(null);

        // Lọc bài không xóa nếu không includeDeleted
        if (!includeDeleted) {
            spec = spec.and(isNotDeleted());
        }

        if (userId != null) {
            spec = spec.and(hasRealtorId(userId));
        }

        if (status != null) {
            spec = spec.and(hasStatus(status));
        }

        if (StringUtils.hasText(search)) {
            spec = spec.and(titleContains(search));
        }

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);

        return propertyPage.map(propertyMapper::toPropertyResponse);
    }

    @Override
    public PropertyResponse getListingDetailByAdmin(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Không tìm thấy bài đăng."));

        return propertyMapper.toPropertyResponse(property);
    }

    @Override
    public Page<PropertyResponse> getPublicListings(String search,
                                            String transactionType,
                                            String propertyType,
                                            Double minPrice, Double maxPrice,
                                            Pageable pageable) {

        Specification<Property> spec = Specification.where(isNotDeleted())
                .and(hasStatus(Property.Status.AVAILABLE)); // Chỉ lấy bài đang hiện

        // Lọc theo loại giao dịch (Bán/Thuê)
        if (transactionType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("propertyTransactionType"), transactionType.toUpperCase()));
        }

        // Lọc theo loại BĐS (Nhà/Đất...)
        if (propertyType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("propertyType"), propertyType));
        }

        // Lọc theo khoảng giá (Optional nhưng rất cần thiết)
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        // Tìm kiếm theo tiêu đề hoặc địa chỉ
        if (StringUtils.hasText(search)) {
            String pattern = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("address")), pattern)
            ));
        }

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);

        return propertyPage.map(propertyMapper::toPropertyResponse);
    }

    @Override
    public PropertyResponse getPublicListingDetail(Long propertyId) {
        // Chỉ cho xem nếu chưa xóa VÀ đang AVAILABLE
        // (Không cho xem bài Draft/Pending/Hidden qua API public)
        Property property = propertyRepository.findByIdAndIsDeletedFalse(propertyId)
                .filter(p -> p.getStatus() == Property.Status.AVAILABLE)
                .orElseThrow(() -> new AppException(ErrorCode.PROPERTY_NOT_FOUND, "Bài đăng không tồn tại hoặc không khả dụng."));

        return propertyMapper.toPropertyResponse(property);
    }

    // ======================================================
    // SPECIFICATION HELPERS (Hàm hỗ trợ query)
    // ======================================================

    private Specification<Property> isNotDeleted() {
        return (root, query, cb) -> cb.equal(root.get("isDeleted"), false);
    }

    private Specification<Property> hasRealtorId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("realtorId"), userId);
    }

    private Specification<Property> hasStatus(Property.Status status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private Specification<Property> titleContains(String search) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%");
    }

    private UserSubscriptionDetailsDTO callSubscriptionService(Long userId) {
        try {
            // URL endpoint bên Subscription: /subscription/user/{userId} (Admin view) hoặc /subscription/user/ (Current user)
            // Ở đây ta dùng endpoint của Admin để lấy chi tiết đầy đủ: /subscription/admin/user/{userId}
            // Hoặc endpoint /subscription/user/{userId} mà Admin Controller đang expose.

            String uri = "/subscription/user/" + userId;

            ApiResponse<UserSubscriptionDetailsDTO> response = subscriptionWebClient.get()
                    .uri(uri)
                    .header("X-User-Id", String.valueOf(userId))
                    .header("X-Role", "ADMIN") // Gọi với quyền ADMIN để bypass check owner nếu cần thiết
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
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<UserSubscriptionDetailsDTO>>() {})
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .filter(throwable -> throwable instanceof WebClientResponseException &&
                                    ((WebClientResponseException) throwable).getStatusCode().is5xxServerError()))
                    .block();

            if (response != null && response.getData() != null) {
                return response.getData();
            }
            throw new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND, "Không tìm thấy thông tin gói cước người dùng.");

        } catch (WebClientResponseException e) {
            log.warn("Lỗi từ SubscriptionService ({}): {}", e.getRawStatusCode(), e.getResponseBodyAsString());
            String cleanErrorMessage = "Lỗi lấy thông tin gói cước.";

            try {
                ApiResponse<?> errorResponse = jacksonObjectMapper.readValue(e.getResponseBodyAsString(), ApiResponse.class);
                if (errorResponse != null && errorResponse.getMessage() != null) {
                    cleanErrorMessage = errorResponse.getMessage();
                }
            } catch (JsonProcessingException jsonEx) {
                log.error("Parse JSON lỗi thất bại", jsonEx);
                cleanErrorMessage = e.getMessage();
            }

            throw new AppException(ErrorCode.SUBSCRIPTION_FAILED, cleanErrorMessage); // Ném lỗi kèm message từ service kia

        } catch (Exception e) {
            log.error("Lỗi hệ thống khi gọi SubscriptionService", e);
            throw new RuntimeException("Lỗi hệ thống kết nối đến dịch vụ gói cước.");
        }
    }

    /**
     * Quét bài đăng hết hạn mỗi ngày
     * Cron: "0 0 0 * * *" (Nửa đêm hàng ngày)
     */
    @Scheduled(cron = "0 0 0 * * *") // Chạy mỗi giờ
    @Transactional
    public void scanAndExpireListings() {
        log.info("Bắt đầu tác vụ quét các bài đăng hết hạn...");

        LocalDateTime now = LocalDateTime.now();

        // 1. Tìm các bài đang AVAILABLE hoặc HIDDEN mà đã quá hạn
        List<Property.Status> activeStatuses = List.of(
                Property.Status.AVAILABLE,
                Property.Status.HIDDEN
        );

        // Chạy 1 lệnh Update trực tiếp xuống DB
        int updatedCount = propertyRepository.bulkExpireProperties(
                Property.Status.EXPIRED,
                activeStatuses,
                now
        );

        if (updatedCount > 0) {
            log.info("Đã chuyển {} bài sang EXPIRED.", updatedCount);
        }
    }
}
