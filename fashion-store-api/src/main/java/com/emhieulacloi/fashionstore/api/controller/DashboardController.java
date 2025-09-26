package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import com.emhieulacloi.fashionstore.api.domains.dto.response.DashboardResponseDTO;
import com.emhieulacloi.fashionstore.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping()
    public ResponseEntity<DashboardResponseDTO> getDashboardData() {
        ResponseEntity<DashboardResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(dashboardService.getDashboardData());
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        return response;
    }
}
