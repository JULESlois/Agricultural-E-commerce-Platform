package com.example.finance.controller;

import com.example.finance.dto.FinancingApplicationCreateRequest;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.service.FinancingApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.context.annotation.Import;

/**
 * 农户融资控制器测试
 */
@WebMvcTest(FarmerFinancingController.class)
@Import(com.example.finance.config.TestSecurityConfig.class)
class FarmerFinancingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FinancingApplicationService applicationService;

    private FinancingApplication application;
    private FinancingApplicationCreateRequest createRequest;

    @BeforeEach
    void setUp() {
        application = new FinancingApplication();
        application.setApplicationId(100L);
        application.setApplicationNo("FIN2025102712345678");
        application.setUserId(1L);
        application.setLoanTypeId(1);
        application.setApplyAmount(new BigDecimal("100000.00"));
        application.setApplyTerm(6);
        application.setApplicationStatus(1);

        createRequest = new FinancingApplicationCreateRequest();
        createRequest.setLoanTypeId(1);
        createRequest.setApplyAmount(new BigDecimal("100000.00"));
        createRequest.setApplyTerm(6);
        createRequest.setLoanPurposeDetail("用于小麦种植");
        createRequest.setRepaymentPlan("收获后还款");
        createRequest.setBankId(101);
        createRequest.setMaterialUrls(Arrays.asList("https://example.com/id.jpg"));
    }

    @Test
    @WithMockUser(username = "farmer", roles = {"FARMER"})
    void testCreateApplication() throws Exception {
        // Given
        when(applicationService.createApplication(anyLong(), any(FinancingApplicationCreateRequest.class)))
                .thenReturn(application);

        // When & Then
        mockMvc.perform(post("/api/farmer/financing/applications")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.data.application_id").value(100))
                .andExpect(jsonPath("$.data.application_no").value("FIN2025102712345678"));
    }

    @Test
    @WithMockUser(username = "farmer", roles = {"FARMER"})
    void testGetMyApplications() throws Exception {
        // Given
        List<com.example.finance.dto.FinancingApplicationResponse> applications = Arrays.asList(
            new com.example.finance.dto.FinancingApplicationResponse(
                100L, "FIN2025102712345678", "种植周转贷", 
                new BigDecimal("100000.00"), 6, 1, java.time.LocalDateTime.now()
            )
        );
        when(applicationService.getUserApplications(anyLong())).thenReturn(applications);

        // When & Then
        mockMvc.perform(get("/api/farmer/financing/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "farmer", roles = {"FARMER"})
    void testGetApplicationDetail() throws Exception {
        // Given
        when(applicationService.getApplicationById(anyLong())).thenReturn(application);

        // When & Then
        mockMvc.perform(get("/api/farmer/financing/applications/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.application_id").value(100));
    }

    @Test
    @WithMockUser(username = "farmer", roles = {"FARMER"})
    void testCreateApplication_InvalidAmount() throws Exception {
        // Given
        createRequest.setApplyAmount(new BigDecimal("-1000")); // 无效金额

        // When & Then
        mockMvc.perform(post("/api/farmer/financing/applications")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isBadRequest());
    }
}
