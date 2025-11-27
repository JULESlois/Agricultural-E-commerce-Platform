package com.example.finance.controller;

import com.example.finance.dto.BankApprovalRequest;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.entity.FinancingBankApproval;
import com.example.finance.entity.FinancingCreditEvaluation;
import com.example.finance.service.FinancingApplicationService;
import com.example.finance.service.FinancingBankApprovalService;
import com.example.finance.service.FinancingCreditEvaluationService;
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
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.context.annotation.Import;

/**
 * 银行融资控制器测试
 */
@WebMvcTest(BankFinancingController.class)
@Import(com.example.finance.config.TestSecurityConfig.class)
class BankFinancingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FinancingApplicationService applicationService;

    @MockBean
    private FinancingBankApprovalService bankApprovalService;

    @MockBean
    private FinancingCreditEvaluationService creditEvaluationService;

    private FinancingApplication application;
    private FinancingBankApproval bankApproval;
    private FinancingCreditEvaluation creditEvaluation;

    @BeforeEach
    void setUp() {
        application = new FinancingApplication();
        application.setApplicationId(100L);
        application.setApplicationNo("FIN2025102712345678");
        application.setUserId(1L);
        application.setLoanTypeId(1);
        application.setApplyAmount(new BigDecimal("100000.00"));
        application.setApplicationStatus(2);

        bankApproval = new FinancingBankApproval();
        bankApproval.setApprovalId(1L);
        bankApproval.setApplicationId(100L);
        bankApproval.setApprovalResult(1);

        creditEvaluation = new FinancingCreditEvaluation();
        creditEvaluation.setApplicationId(100L);
        creditEvaluation.setCreditScore(85);
        creditEvaluation.setCreditLevel("A级");
    }

    @Test
    @WithMockUser(username = "bank_user", roles = {"BANK"})
    void testGetPendingApplications() throws Exception {
        // Given
        List<FinancingApplication> applications = Arrays.asList(application);
        when(applicationService.getApplicationsByBankAndStatus(anyInt(), anyInt())).thenReturn(applications);

        // When & Then
        mockMvc.perform(get("/api/bank/financing/applications")
                .param("status", "2")
                .param("bankId", "101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "bank_user", roles = {"BANK"})
    void testGetApplicationDetail() throws Exception {
        // Given
        when(applicationService.getApplicationById(anyLong())).thenReturn(application);
        when(creditEvaluationService.getCreditEvaluationByApplicationId(anyLong())).thenReturn(creditEvaluation);

        // When & Then
        mockMvc.perform(get("/api/bank/financing/applications/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.application_info").exists())
                .andExpect(jsonPath("$.data.credit_evaluation").exists());
    }

    @Test
    @WithMockUser(username = "bank_user", roles = {"BANK"})
    void testSubmitApproval() throws Exception {
        // Given
        BankApprovalRequest request = new BankApprovalRequest();
        request.setApprovalResult(1);
        request.setApprovalAmount(new BigDecimal("80000.00"));
        request.setApprovalTerm(6);
        request.setInterestRate(new BigDecimal("0.052"));
        request.setRepaymentMethod("按月付息，到期还本");
        request.setApprovalRemark("同意放款");

        // When & Then
        mockMvc.perform(post("/api/bank/financing/applications/100/review")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(username = "bank_user", roles = {"BANK"})
    void testConfirmDisburse() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("loan_time", LocalDateTime.now().toString());

        // When & Then
        mockMvc.perform(post("/api/bank/financing/applications/100/disburse")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
