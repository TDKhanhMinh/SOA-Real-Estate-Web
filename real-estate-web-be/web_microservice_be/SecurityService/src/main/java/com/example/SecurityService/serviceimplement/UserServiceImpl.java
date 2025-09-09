package com.example.SecurityService.serviceimplement;

import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.entity.User;
import com.example.SecurityService.exception.AppException;
import com.example.SecurityService.exception.ErrorCode;
import com.example.SecurityService.mapper.UserMapper;
import com.example.SecurityService.repository.UserRepo;
import com.example.SecurityService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserMapper userMapper;

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserById(int id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }



    @Override
    public void deleteById(int id) {
        userRepo.deleteById(id);
    }

    @Override
    public UserResponse updateUser(UserUpdate userUpdate, int id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updateUser(existingUser, userUpdate);
        return userMapper.toUserResponse(userRepo.save(existingUser));
    }

    @Override
    public User createUser(UserRequest userRequest) {
        if (userRepo.existsByEmail(userRequest.getEmail())) {
            throw new AppException(ErrorCode.USER_EXIST);
        }
        User user = userMapper.toUser(userRequest);
        return userRepo.save(user);
    }
}
