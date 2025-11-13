    package com.example.UserService;

import com.example.UserService.repository.UserRepository;
import com.example.UserService.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.UserService.model.User;

import java.time.LocalDateTime;


@Configuration
public class DataInitializer {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final String adminEmail;
    private final String adminPassword;

    public DataInitializer(BCryptPasswordEncoder passwordEncoder,
                           UserRepository userRepository,
                           @Value("${app.admin.email}") String adminEmail,
                           @Value("${app.admin.password}") String adminPassword) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Bean
    CommandLineRunner loadData() {
        return args -> {
            loadAdmin();
        };
    }

    private void loadAdmin() {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setName("Admin");
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
        }
    }
}