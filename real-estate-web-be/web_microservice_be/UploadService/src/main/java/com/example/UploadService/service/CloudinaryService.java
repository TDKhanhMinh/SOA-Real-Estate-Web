package com.example.UploadService.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Hàm upload 1 ảnh (có validation)
    public String uploadImage(MultipartFile file) throws IOException {
        // 1. Kiểm tra rỗng
        if (file.isEmpty()) {
            throw new IOException("File rỗng.");
        }

        // 2. KIỂM TRA ĐỊNH DẠNG ẢNH (VALIDATION)
        // Chỉ chấp nhận file có content-type bắt đầu bằng "image/" (vd: image/png, image/jpeg)
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IOException("File không hợp lệ. Chỉ cho phép tải lên hình ảnh.");
        }

        // 3. Upload lên Cloudinary
        // public_id: Đặt tên file ngẫu nhiên để tránh trùng lặp
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "auto",
                        "public_id", UUID.randomUUID().toString()
                ));

        return (String) uploadResult.get("secure_url");
    }

    // Hàm upload NHIỀU ảnh
    public List<String> uploadMultipleImages(MultipartFile[] files) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            // Tái sử dụng hàm upload đơn lẻ để tận dụng logic validation
            String url = uploadImage(file);
            imageUrls.add(url);
        }
        return imageUrls;
    }
}