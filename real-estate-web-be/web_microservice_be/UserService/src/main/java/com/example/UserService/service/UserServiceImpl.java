package com.example.UserService.service;

import com.example.UserService.config.JwtUtil;
import com.example.UserService.dto.UserDTO;
import com.example.UserService.request.UpdateProfileRequest;
import com.example.UserService.request.UpdateRequest;
import com.example.UserService.response.PageResponse;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.exception.AppException;
import com.example.UserService.exception.ErrorCode;
import com.example.UserService.mapper.UserMapper;
import com.example.UserService.repository.UserRepository;
import com.example.UserService.response.AuthResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepo;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

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


    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserDTO getUserProfile(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserDTO(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!userRepo.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        userRepo.deleteById(id);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UpdateRequest updateRequest, Long id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        existingUser.setName(updateRequest.getName());
        existingUser.setPhone(updateRequest.getPhone());
        existingUser.setIsActive(updateRequest.getIsActive());
        existingUser.setEmail(updateRequest.getEmail());

        return userMapper.toUserResponse(userRepo.save(existingUser));
    }

    @Override
    @Transactional
    public UserDTO updateProfile(UpdateProfileRequest updateProfileRequest, Long id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        existingUser.setName(updateProfileRequest.getName());
        existingUser.setPhone(updateProfileRequest.getPhone());
        existingUser.setAvatarUrl(updateProfileRequest.getAvatarUrl());
        existingUser.setEmail(updateProfileRequest.getEmail());

        return userMapper.toUserDTO(userRepo.save(existingUser));
    }

    @Override
    public AuthResponse verify(User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            user = userRepo.findByEmail(user.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            if(!user.getIsActive()) {
                throw new AppException(ErrorCode.USER_INACTIVE);
            }

            String token = jwtUtil.generateToken(user.getEmail(), String.valueOf(user.getRole()));

            return new AuthResponse(token, userMapper.toUserDTO(user));

        }
        return null;
    }

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
        return userMapper.toUserDTO(savedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long id, com.example.UserService.request.ChangePasswordRequest changePasswordRequest) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), existingUser.getPassword())) {
            throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
        }
        existingUser.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepo.save(existingUser);
    }
}
