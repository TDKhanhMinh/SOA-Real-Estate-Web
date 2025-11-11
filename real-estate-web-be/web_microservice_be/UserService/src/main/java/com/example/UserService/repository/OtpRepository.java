package com.example.UserService.repository;

import com.example.UserService.model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OTP, Long> {

    Optional<OTP> findByUserIdAndCode(Long userId, String code);

    Optional<OTP> findByUserId(Long userId);
}