package com.example.UserService.service;

import com.example.UserService.config.JwtUtil;
import com.example.UserService.dto.EmailNotificationDTO;
import com.example.UserService.dto.UserCreatedDTO;
import com.example.UserService.dto.UserDTO;
import com.example.UserService.model.OTP;
import com.example.UserService.repository.OtpRepository;
import com.example.UserService.request.ChangePasswordRequest;
import com.example.UserService.request.UpdateProfileRequest;
import com.example.UserService.request.UpdateRequest;
import com.example.UserService.request.VerifyOTPRequest;
import com.example.UserService.response.PageResponse;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.exception.AppException;
import com.example.UserService.exception.ErrorCode;
import com.example.UserService.mapper.UserMapper;
import com.example.UserService.repository.UserRepository;
import com.example.UserService.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import java.util.Random;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepo;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RabbitTemplate rabbitTemplate;
    private final OtpRepository otpRepository;


    // Rabbit mq config values
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing-key.register}")
    private String registerRoutingKey;

    @Value("${rabbitmq.routing-key.forgot-password}")
    private String forgotPasswordRoutingKey;

    @Value("${rabbitmq.routing-key.user-created}")
    private String userCreatedRoutingKey;

    // Register new user
    @Override
    @Transactional
    public UserDTO register(User user) {
        if(userRepo.existsByEmail(user.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXIST);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setAvatarUrl("https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=");
        User savedUser = userRepo.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());

        try{
            EmailNotificationDTO emailNotificationDTO = new EmailNotificationDTO(
                    savedUser.getEmail(),
                    "Welcome to Our Service",
                    "WELCOME_EMAIL",
                    savedUser.getId(),
                    Map.of("name", savedUser.getName())
            );

            rabbitTemplate.convertAndSend(
                    exchangeName,
                    registerRoutingKey,
                    emailNotificationDTO
            );

            UserCreatedDTO userCreatedDTO = new UserCreatedDTO(
                    savedUser.getId(),
                    savedUser.getEmail()
            );
            rabbitTemplate.convertAndSend(
                    exchangeName,
                    userCreatedRoutingKey,
                    userCreatedDTO
            );

            log.info("Sent 'registration' message to RabbitMQ for user: {}", savedUser.getEmail());
            log.info("Sent 'user created' message to RabbitMQ for user: {} to create basic subscription and wallet", savedUser.getEmail());
        } catch (Exception e) {
            log.error("Failed to send registration message for user {}: {}", savedUser.getEmail(), e.getMessage());
            log.error("Failed to send user created message for user {}: {}", savedUser.getEmail(), e.getMessage());
        }

        return userMapper.toUserDTO(savedUser);
    }


    // Forgot password - generate and send OTP
    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String otpCode = String.format("%06d", new Random().nextInt(999999));

        OTP otp = otpRepository.findByUserId(user.getId())
                .orElse(new OTP());

        otp.setUserId(user.getId());
        otp.setCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otp);

        try {
            EmailNotificationDTO emailDto = new EmailNotificationDTO(
                    user.getEmail(),
                    "Yêu cầu đặt lại mật khẩu (Mã OTP)",
                    "FORGOT_PASSWORD_OTP",
                    user.getId(),
                    Map.of("otp", otpCode, "name", user.getName())
            );

            rabbitTemplate.convertAndSend(exchangeName, forgotPasswordRoutingKey, emailDto);
            log.info("Đã gửi tác vụ 'FORGOT_PASSWORD_OTP' cho user {}", user.getEmail());

        } catch (Exception e) {
            log.error("Lỗi khi gửi tin nhắn RabbitMQ (FORGOT_PASSWORD_OTP): {}", e.getMessage());
        }
    }

    // Reset password using OTP
    @Override
    @Transactional
    public void resetPassword(String email, String otpCode, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        OTP otp = otpRepository.findByUserIdAndCode(user.getId(), otpCode)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otp);
            throw new AppException(ErrorCode.OTP_EXPIRED); // "OTP đã hết hạn"
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        otpRepository.delete(otp);

        log.info("Đổi mật khẩu thành công cho user {}", email);
    }

    // Verify OTP
    @Override
    public void verifyOTP(VerifyOTPRequest verifyOTPRequest) {
        User user = userRepo.findByEmail(verifyOTPRequest.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        OTP otp = otpRepository.findByUserIdAndCode(user.getId(), verifyOTPRequest.getCode())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.OTP_EXPIRED); // "OTP đã hết hạn"
        }

        log.info("Xác thực OTP thành công cho user {}", verifyOTPRequest.getEmail());
    }

    // Get all users with pagination
    @Override
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> userPage = userRepo.findAll(pageable);

        List<UserResponse> userResponses = userPage.stream()
                .map(userMapper::toUserResponse)
                .toList();

        return new PageResponse<>(
                userResponses,
                userPage.getNumber(),
                userPage.getTotalPages(),
                userPage.getTotalElements()
        );
    }

    // Search users by keyword (name or email)
    private Specification<User> searchByKeyword(String search) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(search)) {
                return criteriaBuilder.conjunction();
            }

            String likePattern = "%" + search.toLowerCase() + "%";

            var nameLike = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    likePattern
            );

            var emailLike = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    likePattern
            );

            return criteriaBuilder.or(nameLike, emailLike);
        };
    }

    // Search users with pagination
    @Override
    public PageResponse<UserResponse> searchUsers(String search, Pageable pageable) {
        Specification<User> spec = searchByKeyword(search);

        Page<User> userPage = userRepo.findAll(spec, pageable);

        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(userMapper::toUserResponse)
                .toList();

        return new PageResponse<>(
                userResponses,
                userPage.getNumber(),
                userPage.getTotalPages(),
                userPage.getTotalElements()
        );
    }


    // Get user by ID
    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    // Get user profile by ID
    @Override
    public UserDTO getUserProfile(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserDTO(user);
    }

    // Update user by admin
    @Override
    @Transactional
    public UserResponse updateUser(UpdateRequest updateRequest, Long id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        existingUser.setName(updateRequest.getName());
        existingUser.setPhone(updateRequest.getPhone());
        existingUser.setIsActive(updateRequest.getIsActive());

        return userMapper.toUserResponse(userRepo.save(existingUser));
    }

    // Update user profile
    @Override
    @Transactional
    public UserDTO updateProfile(UpdateProfileRequest updateProfileRequest, Long id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        existingUser.setName(updateProfileRequest.getName());
        existingUser.setPhone(updateProfileRequest.getPhone());
        existingUser.setAvatarUrl(updateProfileRequest.getAvatarUrl());

        return userMapper.toUserDTO(userRepo.save(existingUser));
    }

    // Verify user credentials and generate JWT
    @Override
    public AuthResponse verify(User user) {

        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );


            if (authentication.isAuthenticated()) {
                user = userRepo.findByEmail(user.getEmail())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                if (!user.getIsActive()) {
                    throw new AppException(ErrorCode.USER_INACTIVE);
                }

                String token = jwtUtil.generateToken(user.getId(), String.valueOf(user.getRole()));

                return new AuthResponse(token, userMapper.toUserDTO(user));

            }
        } catch (BadCredentialsException | InternalAuthenticationServiceException e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        return null;
    }

    // Change user password
    @Override
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest changePasswordRequest) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), existingUser.getPassword())) {
            throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
        }
        existingUser.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepo.save(existingUser);
    }
}
