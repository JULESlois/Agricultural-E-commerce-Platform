package com.example.finance.service;

import com.example.finance.dto.PresalePlanCreateRequest;
import com.example.finance.dto.PresaleSubscriptionRequest;
import com.example.finance.entity.FinancingPresalePlan;
import com.example.finance.entity.FinancingPresaleSubscription;
import com.example.finance.repository.FinancingPresalePlanRepository;
import com.example.finance.repository.FinancingPresaleSubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * 预售服务测试
 */
@ExtendWith(MockitoExtension.class)
class FinancingPresaleServiceTest {

    @Mock
    private FinancingPresalePlanRepository presalePlanRepository;

    @Mock
    private FinancingPresaleSubscriptionRepository subscriptionRepository;

    @InjectMocks
    private FinancingPresaleService presaleService;

    private PresalePlanCreateRequest planRequest;
    private FinancingPresalePlan presalePlan;
    private PresaleSubscriptionRequest subscriptionRequest;
    private FinancingPresaleSubscription subscription;

    @BeforeEach
    void setUp() {
        // 准备预售计划请求
        planRequest = new PresalePlanCreateRequest();
        planRequest.setCategoryId(101);
        planRequest.setProductName("2026年春季中牟大蒜");
        planRequest.setPlantDate(LocalDate.of(2025, 10, 15));
        planRequest.setExpectedHarvestDate(LocalDate.of(2026, 5, 20));
        planRequest.setTotalYieldQuantity(new BigDecimal("50000.00"));
        planRequest.setPresaleUnitPrice(new BigDecimal("4.50"));
        planRequest.setDepositRatio(new BigDecimal("0.3"));

        // 准备预售计划
        presalePlan = new FinancingPresalePlan();
        presalePlan.setPlanId(1L);
        presalePlan.setPlanNo("PRE202510150001");
        presalePlan.setUserId(1L);
        presalePlan.setCategoryId(101);
        presalePlan.setProductName("2026年春季中牟大蒜");
        presalePlan.setTotalYieldQuantity(new BigDecimal("50000.00"));
        presalePlan.setPresaleUnitPrice(new BigDecimal("4.50"));
        presalePlan.setDepositRatio(new BigDecimal("0.3"));
        presalePlan.setPlanStatus(2); // 预售中

        // 准备认购请求
        subscriptionRequest = new PresaleSubscriptionRequest();
        subscriptionRequest.setPlanId(1L);
        subscriptionRequest.setSubscribedQuantity(new BigDecimal("1000.00"));

        // 准备认购记录
        subscription = new FinancingPresaleSubscription();
        subscription.setSubscriptionId(1L);
        subscription.setPlanId(1L);
        subscription.setUserId(1L);
        subscription.setSubscribedQuantity(new BigDecimal("1000.00"));
        subscription.setDepositAmount(new BigDecimal("1350.00"));
    }

    @Test
    void testCreatePresalePlan_Success() {
        // Given
        FinancingPresalePlan newPlan = new FinancingPresalePlan();
        newPlan.setPlanId(1L);
        newPlan.setProductName("2026年春季中牟大蒜");
        newPlan.setPlanStatus(1); // 待审核
        when(presalePlanRepository.save(any(FinancingPresalePlan.class))).thenReturn(newPlan);

        // When
        FinancingPresalePlan result = presaleService.createPresalePlan(1L, planRequest);

        // Then
        assertNotNull(result);
        assertEquals("2026年春季中牟大蒜", result.getProductName());
        assertEquals(1, result.getPlanStatus());
        verify(presalePlanRepository).save(any(FinancingPresalePlan.class));
    }

    @Test
    void testCreatePresalePlan_InvalidDate() {
        // Given
        planRequest.setExpectedHarvestDate(LocalDate.of(2025, 9, 1)); // 早于种植日期

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presaleService.createPresalePlan(1L, planRequest);
        });
        assertEquals("收获日期不能早于种植日期", exception.getMessage());
    }

    @Test
    void testGetActivePresalePlans() {
        // Given
        List<FinancingPresalePlan> plans = Arrays.asList(presalePlan);
        when(presalePlanRepository.findActivePresalePlans()).thenReturn(plans);

        // When
        List<FinancingPresalePlan> result = presaleService.getActivePresalePlans();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(presalePlanRepository).findActivePresalePlans();
    }

    @Test
    void testCreateSubscription_Success() {
        // Given
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.of(presalePlan));
        when(subscriptionRepository.calculateTotalSubscribedQuantity(anyLong()))
            .thenReturn(new BigDecimal("10000.00"));
        when(subscriptionRepository.save(any(FinancingPresaleSubscription.class))).thenReturn(subscription);

        // When
        FinancingPresaleSubscription result = presaleService.createSubscription(1L, subscriptionRequest);

        // Then
        assertNotNull(result);
        assertEquals(new BigDecimal("1000.00"), result.getSubscribedQuantity());
        verify(subscriptionRepository).save(any(FinancingPresaleSubscription.class));
    }

    @Test
    void testCreateSubscription_PlanNotFound() {
        // Given
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presaleService.createSubscription(1L, subscriptionRequest);
        });
        assertEquals("预售计划不存在", exception.getMessage());
    }

    @Test
    void testCreateSubscription_PlanNotActive() {
        // Given
        presalePlan.setPlanStatus(1); // 待审核
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.of(presalePlan));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presaleService.createSubscription(1L, subscriptionRequest);
        });
        assertEquals("该预售计划当前不可认购", exception.getMessage());
    }

    @Test
    void testCreateSubscription_ExceedRemainingQuantity() {
        // Given
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.of(presalePlan));
        when(subscriptionRepository.calculateTotalSubscribedQuantity(anyLong()))
            .thenReturn(new BigDecimal("49500.00")); // 已认购49500，剩余500

        subscriptionRequest.setSubscribedQuantity(new BigDecimal("1000.00")); // 超过剩余数量

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            presaleService.createSubscription(1L, subscriptionRequest);
        });
        assertEquals("认购数量超过剩余可认购数量", exception.getMessage());
    }

    @Test
    void testGetUserSubscriptions() {
        // Given
        List<FinancingPresaleSubscription> subscriptions = Arrays.asList(subscription);
        when(subscriptionRepository.findByUserIdOrderByCreateTimeDesc(anyLong())).thenReturn(subscriptions);

        // When
        List<FinancingPresaleSubscription> result = presaleService.getUserSubscriptions(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(subscriptionRepository).findByUserIdOrderByCreateTimeDesc(1L);
    }

    @Test
    void testGetPlanSubscriptions() {
        // Given
        List<FinancingPresaleSubscription> subscriptions = Arrays.asList(subscription);
        when(subscriptionRepository.findByPlanIdOrderByCreateTimeDesc(anyLong())).thenReturn(subscriptions);

        // When
        List<FinancingPresaleSubscription> result = presaleService.getPlanSubscriptions(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(subscriptionRepository).findByPlanIdOrderByCreateTimeDesc(1L);
    }

    @Test
    void testCalculatePresaleProgress() {
        // Given
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.of(presalePlan));
        when(subscriptionRepository.calculateTotalSubscribedQuantity(anyLong()))
            .thenReturn(new BigDecimal("20000.00")); // 已认购20000，总量50000

        // When
        String progress = presaleService.calculatePresaleProgress(1L);

        // Then
        assertEquals("40%", progress);
    }

    @Test
    void testCalculatePresaleProgress_PlanNotFound() {
        // Given
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When
        String progress = presaleService.calculatePresaleProgress(999L);

        // Then
        assertEquals("0%", progress);
    }

    @Test
    void testDepositAmountCalculation() {
        // Given
        when(presalePlanRepository.findById(anyLong())).thenReturn(Optional.of(presalePlan));
        when(subscriptionRepository.calculateTotalSubscribedQuantity(anyLong()))
            .thenReturn(new BigDecimal("0"));
        when(subscriptionRepository.save(any(FinancingPresaleSubscription.class))).thenAnswer(invocation -> {
            FinancingPresaleSubscription saved = invocation.getArgument(0);
            // 验证定金计算: 1000 * 4.5 * 0.3 = 1350
            assertEquals(0, new BigDecimal("1350.00").compareTo(saved.getDepositAmount()));
            return saved;
        });

        // When
        presaleService.createSubscription(1L, subscriptionRequest);

        // Then
        verify(subscriptionRepository).save(any(FinancingPresaleSubscription.class));
    }
}
