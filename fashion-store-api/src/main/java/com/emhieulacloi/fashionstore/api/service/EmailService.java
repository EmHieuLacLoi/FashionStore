package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.domains.dto.request.EmailRequestDTO;

public interface EmailService {
    Integer sendEmail(EmailRequestDTO emailRequestDTO);
}
