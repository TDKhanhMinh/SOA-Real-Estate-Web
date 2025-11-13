package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.SubscriptionDTO;
import com.example.SubscriptionService.dto.UserCreatedDTO;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;
import com.example.SubscriptionService.exception.AppException;
import com.example.SubscriptionService.exception.ErrorCode;
import com.example.SubscriptionService.mapper.SubscriptionMapper;
import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.UserSubscription;
import com.example.SubscriptionService.repository.SubscriptionOrderRepository;
import com.example.SubscriptionService.repository.SubscriptionRepository;
import com.example.SubscriptionService.repository.UserSubscriptionRepository;
import com.example.SubscriptionService.request.UpdateSubscriptionRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


    // Xử lý sự kiện tạo subscription basic cho user khi nhận được thông tin user mới tạo từ User Service
    @Override
    @RabbitListener(queues = "${rabbitmq.queue.user}")
    public void handleUserCreated(UserCreatedDTO userCreatedDTO) {
        log.info("Nhận được sự kiện User Created: {}", userCreatedDTO);

        boolean check = createBasicSubscription(userCreatedDTO.userId());

        if (!check) {
            log.info("User {} đã có subscription, không tạo mới. Hoặc lỗi khi tạo subscription cho user", userCreatedDTO.userId());
            return;
        }

        log.info("Đã tạo subscription cho user: {}", userCreatedDTO.userId());
    }

    // Tạo subscription basic cho user
    @Transactional
    protected boolean createBasicSubscription(Long userId) {
        try {
            Optional<UserSubscription> existingUserSubscription = userSubscriptionRepository.findByUserId(userId);

            // Nếu chưa có subscription, tạo mới gói basic
            if (existingUserSubscription.isEmpty()) {
                UserSubscription newUserSubscription;
                newUserSubscription = UserSubscription.builder()
                        .userId(userId)
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
    public UserSubscriptionDetailsDTO getUserSubscriptionDetails(Long userId) {
        Optional<UserSubscriptionDetailsDTO> userSubscriptionDetails =
                userSubscriptionRepository.findUserSubscriptionDetails(userId, UserSubscription.Status.ACTIVE);

        if(userSubscriptionDetails.isPresent()) {
            return userSubscriptionDetails.get();
        }

        createBasicSubscription(userId);

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

        boolean check = createBasicSubscription(userId);
        if (!check) {
            log.info("User {} đã có basic subscription, không cần hủy nữa.", userId);
            return;
        }
        log.info("Đã hủy subscription hiện tại và chuyển sang basic cho user: {}", userId);
    }
}
