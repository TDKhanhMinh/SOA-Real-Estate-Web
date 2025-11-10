package com.example.UserService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "OTP")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "userId", nullable = false)
    private Long userId;

    @Column(name = "expiresAt", nullable = false)
    private LocalDateTime expiresAt;
}
