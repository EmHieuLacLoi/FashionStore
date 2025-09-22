package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import com.emhieulacloi.fashionstore.api.domains.dto.request.EmailRequestDTO;
import com.emhieulacloi.fashionstore.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequestDTO emailRequestDTO) {
        ResponseEntity<String> response;
        try {
            response = ResponseDataConfiguration.success(emailService.sendEmail(emailRequestDTO));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        return response;

    }
}
