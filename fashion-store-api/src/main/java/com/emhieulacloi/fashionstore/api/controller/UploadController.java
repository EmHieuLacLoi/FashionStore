package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.domains.dto.response.UploadResponseDTO;
import com.emhieulacloi.fashionstore.api.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@Slf4j
public class UploadController {
    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<UploadResponseDTO> uploadSingleImage(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return new ResponseEntity("File không được rỗng.", HttpStatus.BAD_REQUEST);
        }

        try {
            String folder = "user_content";

            String secureUrl = cloudinaryService.uploadFile(file, folder);

            UploadResponseDTO responseDTO = UploadResponseDTO.builder()
                    .url(secureUrl)
                    .fileName(file.getOriginalFilename())
                    .build();

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);

        } catch (IOException e) {
            log.error("Upload failed: {}", e.getMessage());
            return new ResponseEntity("Lỗi khi tải file lên dịch vụ lưu trữ.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
