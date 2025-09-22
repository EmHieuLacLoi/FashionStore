package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.EmailRequestDTO;
import com.emhieulacloi.fashionstore.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    
    @Override
    public String sendEmail(EmailRequestDTO emailRequestDTO) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("vohieu972003@gmail.com");
            message.setTo(emailRequestDTO.getEmail());
            message.setSubject("Welcome to FashionStore");
            message.setText("Thank you for registering with FashionStore!");
            
            javaMailSender.send(message);
            return "Email sent successfully to " + emailRequestDTO.getEmail();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send email: " + e.getMessage();
        }
    }
}
