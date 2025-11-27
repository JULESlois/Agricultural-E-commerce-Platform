package com.example.finance.controller;

import com.example.finance.dto.PresalePlanCreateRequest;
import com.example.finance.dto.PresaleSubscriptionRequest;
import com.example.finance.entity.FinancingPresalePlan;
import com.example.finance.entity.FinancingPresaleSubscription;
import com.example.finance.service.FinancingPresaleService;
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
import java.time.LocalDate;
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
 * 预售控制器测试
 */
@WebMvcTest(PresaleController.class)
@Import(com.example.finance.config.TestSecurityConfig.class)
class PresaleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FinancingPresaleService presaleService;

    private PresalePlanCreateRequest planRequest;
    private FinancingPresalePlan presalePlan;
    private PresaleSubscriptionRequest subscriptionRequest;
    private FinancingPresaleSubscription subscription;

    @BeforeEach
    void setUp() {
        planRequest = new PresalePlanCreateRequest();
        planRequest.setCategoryId(101);
        planRequest.setProductName("2026年春季中牟大蒜");
        planRequest.setPlantDate(LocalDate.of(2025, 10, 15));
        planRequest.setExpectedHarvestDate(LocalDate.of(2026, 5, 20));
        planRequest.setTotalYieldQuantity(new BigDecimal("50000.00"));
        planRequest.setPresaleUnitPrice(new BigDecimal("4.50"));
        planRequest.setDepositRatio(new BigDecimal("0.3"));

        presalePlan = new FinancingPresalePlan();
        presalePlan.setPlanId(1L);
        presalePlan.setPlanNo("PRE202510150001");
        presalePlan.setProductName("2026年春季中牟大蒜");
        presalePlan.setPlanStatus(2);

        subscriptionRequest = new PresaleSubscriptionRequest();
        subscriptionRequest.setPlanId(1L);
        subscriptionRequest.setSubscribedQuantity(new BigDecimal("1000.00"));

        subscription = new FinancingPresaleSubscription();
        subscription.setSubscriptionId(1L);
        subscription.setSubscriptionNo("SUB202510150001");
        subscription.setDepositAmount(new BigDecimal("1350.00"));
    }

    @Test
    @WithMockUser(username = "farmer", roles = {"FARMER"})
    void testCreatePresalePlan() throws Exception {
        // Given
        when(presaleService.createPresalePlan(anyLong(), any(PresalePlanCreateRequest.class)))
                .thenReturn(presalePlan);

        // When & Then
        mockMvc.perform(post("/api/farmer/presale-plans")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(planRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.data.plan_id").value(1));
    }

    @Test
    @WithMockUser(username = "buyer", roles = {"BUYER"})
    void testGetPresalePlans() throws Exception {
        // Given
        List<FinancingPresalePlan> plans = Arrays.asList(presalePlan);
        when(presaleService.getActivePresalePlans()).thenReturn(plans);
        when(presaleService.calculatePresaleProgress(anyLong())).thenReturn("40%");

        // When & Then
        mockMvc.perform(get("/api/presale-plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "buyer", roles = {"BUYER"})
    void testCreateSubscription() throws Exception {
        // Given
        when(presaleService.createSubscription(anyLong(), any(PresaleSubscriptionRequest.class)))
                .thenReturn(subscription);

        // When & Then
        mockMvc.perform(post("/api/buyer/presale-subscriptions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subscriptionRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.data.subscription_id").value(1))
                .andExpect(jsonPath("$.data.deposit_amount").value("1350.00"));
    }

    @Test
    @WithMockUser(username = "farmer", roles = {"FARMER"})
    void testGetMySubscriptions() throws Exception {
        // Given
        List<FinancingPresaleSubscription> subscriptions = Arrays.asList(subscription);
        when(presaleService.getUserSubscriptions(anyLong())).thenReturn(subscriptions);

        // When & Then
        mockMvc.perform(get("/api/buyer/presale-subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray());
    }
}
