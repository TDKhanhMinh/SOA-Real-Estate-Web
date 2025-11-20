package com.example.ListingService.repository;

import com.example.ListingService.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    /**
     * Tìm tất cả ảnh của một bài đăng cụ thể
     */
    List<PropertyImage> findByPropertyId(Long propertyId);

    /**
     * Xóa tất cả ảnh của một bài đăng (Dùng khi cập nhật ảnh mới đè lên ảnh cũ)
     */
    void deleteByPropertyId(Long propertyId);

    /**
     * Lây ảnh đại diện của bài đăng
     */
    Optional<PropertyImage> findFirstByPropertyId(Long propertyId);
}
