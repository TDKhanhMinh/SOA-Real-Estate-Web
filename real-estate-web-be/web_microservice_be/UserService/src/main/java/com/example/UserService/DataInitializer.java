package com.example.UserService;

import com.example.UserService.repository.UserRepository;
import com.example.UserService.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.UserService.model.User;

import java.time.LocalDateTime;


@Configuration
@AllArgsConstructor
public class DataInitializer {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Bean
    CommandLineRunner loadData() {
        return args -> {
            loadAdmin();
        };
    }

    private void loadAdmin() {
        String adminEmail = "admin@gmail.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setName("Admin");
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
        }
    }
}