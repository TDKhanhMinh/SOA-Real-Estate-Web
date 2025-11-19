package com.example.ListingService.repository;

import com.example.ListingService.model.Property;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    /**
     * Tìm bài đăng của user theo ID, đảm bảo chưa bị xóa mềm.
     * Dùng cho các hành động update, delete, submit của user.
     */
    Optional<Property> findByIdAndRealtorIdAndIsDeletedFalse(Long id, Long realtorId);

    /**
     * Tìm bài đăng theo ID (cho Admin), đảm bảo chưa bị xóa mềm.
     */
    Optional<Property> findByIdAndIsDeletedFalse(Long id);

    /**
     * Đếm số lượng bài đang chiếm dụng "Slot" của user (Quota).
     * Thường đếm: AVAILABLE, PENDING_APPROVAL, HIDDEN.
     * Bỏ qua: DRAFT, REJECTED, SOLD, RENTED, EXPIRED.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p.id FROM Property p " +
            "WHERE p.realtorId = :userId " +
            "AND p.status IN :statuses " +
            "AND p.isDeleted = false")
    List<Long> findIdsByRealtorIdAndStatusInLocked(@Param("userId") Long userId,
                                                   @Param("statuses") List<Property.Status> statuses);

    /**
     * Tìm các bài đăng có trạng thái nằm trong list (AVAILABLE, HIDDEN)
     * VÀ đã quá hạn (expiresAt < now)
     * VÀ chưa bị xóa
     */
    List<Property> findAllByStatusInAndExpiresAtBeforeAndIsDeletedFalse(
            List<Property.Status> statuses,
            LocalDateTime now
    );
}
