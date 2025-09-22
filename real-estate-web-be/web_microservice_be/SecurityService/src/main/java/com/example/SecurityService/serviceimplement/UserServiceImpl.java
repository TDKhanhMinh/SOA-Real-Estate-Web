package com.example.SecurityService.serviceimplement;

import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.entity.User;
import com.example.SecurityService.exception.AppException;
import com.example.SecurityService.exception.ErrorCode;
import com.example.SecurityService.mapper.UserMapper;
import com.example.SecurityService.repository.UserRepository;
import com.example.SecurityService.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }


    @Override
    public UserResponse getUserById(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteById(int id) {
        if (!userRepo.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        userRepo.deleteById(id);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UserUpdate userUpdate, int id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(existingUser, userUpdate);
        return userMapper.toUserResponse(userRepo.save(existingUser));
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest userRequest) {
        log.info("User data request: {}", userRequest);
        if (userRepo.existsByEmail(userRequest.getEmail())) {
            throw new AppException(ErrorCode.USER_EXIST);
        }
        User user = userMapper.toUser(userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        return userMapper.toUserResponse(userRepo.save(user));
    }
}
