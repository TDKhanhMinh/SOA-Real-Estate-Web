package com.example.UserService.service;

import com.example.UserService.config.JwtUtil;
import com.example.UserService.dto.UserDTO;
import com.example.UserService.request.UserUpdate;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.exception.AppException;
import com.example.UserService.exception.ErrorCode;
import com.example.UserService.mapper.UserMapper;
import com.example.UserService.repository.UserRepository;
import com.example.UserService.response.AuthResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public List<UserResponse> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }


    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
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
    public UserResponse updateUser(UserUpdate userUpdate, Long id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(existingUser, userUpdate);
        return userMapper.toUserResponse(userRepo.save(existingUser));
    }

    @Override
    public AuthResponse verify(User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            user = userRepo.findByEmail(user.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

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
}
