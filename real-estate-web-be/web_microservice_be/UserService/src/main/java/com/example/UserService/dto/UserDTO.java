package com.example.UserService.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO{
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private String avatarUrl;
}