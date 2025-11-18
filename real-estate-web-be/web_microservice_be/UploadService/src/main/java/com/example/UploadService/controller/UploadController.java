package com.example.UploadService.controller;

import com.example.UploadService.response.ApiResponse;
import com.example.UploadService.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    // Upload 1 ảnh
    @PostMapping("/image")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Upload thành công", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // Trả về 400 nếu file lỗi
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        }
    }

    // Upload NHIỀU ảnh (Mới thêm)
    @PostMapping("/images")
    public ResponseEntity<ApiResponse<List<String>>> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> imageUrls = cloudinaryService.uploadMultipleImages(files);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Upload tất cả ảnh thành công", imageUrls));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Lỗi upload: " + e.getMessage(), null));
        }
    }
}