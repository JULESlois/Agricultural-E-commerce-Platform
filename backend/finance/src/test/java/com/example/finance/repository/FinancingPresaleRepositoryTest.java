package com.example.finance.repository;

import com.example.finance.entity.FinancingPresalePlan;
import com.example.finance.entity.FinancingPresaleSubscription;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 预售Repository测试
 */
@DataJpaTest
@ActiveProfiles("test")
class FinancingPresaleRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FinancingPresalePlanRepository planRepository;

    @Autowired
    private FinancingPresaleSubscriptionRepository subscriptionRepository;

    private FinancingPresalePlan presalePlan;
    private FinancingPresaleSubscription subscription;

    @BeforeEach
    void setUp() {
        presalePlan = new FinancingPresalePlan();
        presalePlan.setPlanNo("PRE202510150001");
        presalePlan.setUserId(1L);
        presalePlan.setCategoryId(101);
        presalePlan.setProductName("2026年春季中牟大蒜");
        presalePlan.setPlantDate(LocalDate.of(2025, 10, 15));
        presalePlan.setExpectedHarvestDate(LocalDate.of(2026, 5, 20));
        presalePlan.setTotalYieldQuantity(new BigDecimal("50000.00"));
        presalePlan.setPresaleUnitPrice(new BigDecimal("4.50"));
        presalePlan.setDepositRatio(new BigDecimal("0.3"));
        presalePlan.setPlanStatus(2);
        presalePlan.setAuditStatus(1); // 添加审核状态：已审核

        subscription = new FinancingPresaleSubscription();
        subscription.setSubscriptionNo("SUB202510150001");
        subscription.setUserId(1L);
        subscription.setSubscribedQuantity(new BigDecimal("1000.00"));
        subscription.setDepositAmount(new BigDecimal("1350.00"));
        subscription.setPaymentStatus(1); // 已支付
        subscription.setSubscriptionStatus(1);
    }

    @Test
    void testSavePresalePlan() {
        // When
        FinancingPresalePlan saved = planRepository.save(presalePlan);

        // Then
        assertNotNull(saved.getPlanId());
        assertEquals("PRE202510150001", saved.getPlanNo());
        assertEquals("2026年春季中牟大蒜", saved.getProductName());
    }

    @Test
    void testFindActivePresalePlans() {
        // Given
        entityManager.persist(presalePlan);
        entityManager.flush();

        // When
        List<FinancingPresalePlan> found = planRepository.findActivePresalePlans();

        // Then
        assertFalse(found.isEmpty(), "应该找到预售中的计划");
        assertEquals(2, found.get(0).getPlanStatus());
        assertEquals(1, found.get(0).getAuditStatus());
    }

    @Test
    void testSaveSubscription() {
        // Given
        FinancingPresalePlan savedPlan = entityManager.persist(presalePlan);
        entityManager.flush();
        subscription.setPlanId(savedPlan.getPlanId());

        // When
        FinancingPresaleSubscription saved = subscriptionRepository.save(subscription);

        // Then
        assertNotNull(saved.getSubscriptionId());
        assertEquals("SUB202510150001", saved.getSubscriptionNo());
        assertEquals(new BigDecimal("1000.00"), saved.getSubscribedQuantity());
    }

    @Test
    void testFindSubscriptionsByUserId() {
        // Given
        FinancingPresalePlan savedPlan = entityManager.persist(presalePlan);
        subscription.setPlanId(savedPlan.getPlanId());
        entityManager.persist(subscription);
        entityManager.flush();

        // When
        List<FinancingPresaleSubscription> found = subscriptionRepository.findByUserIdOrderByCreateTimeDesc(1L);

        // Then
        assertFalse(found.isEmpty());
        assertEquals(1L, found.get(0).getUserId());
    }

    @Test
    void testFindSubscriptionsByPlanId() {
        // Given
        FinancingPresalePlan savedPlan = entityManager.persist(presalePlan);
        subscription.setPlanId(savedPlan.getPlanId());
        entityManager.persist(subscription);
        entityManager.flush();

        // When
        List<FinancingPresaleSubscription> found = subscriptionRepository.findByPlanIdOrderByCreateTimeDesc(savedPlan.getPlanId());

        // Then
        assertFalse(found.isEmpty());
        assertEquals(savedPlan.getPlanId(), found.get(0).getPlanId());
    }

    @Test
    void testCalculateTotalSubscribedQuantity() {
        // Given
        FinancingPresalePlan savedPlan = entityManager.persist(presalePlan);
        subscription.setPlanId(savedPlan.getPlanId());
        entityManager.persist(subscription);

        FinancingPresaleSubscription subscription2 = new FinancingPresaleSubscription();
        subscription2.setSubscriptionNo("SUB202510150002");
        subscription2.setPlanId(savedPlan.getPlanId());
        subscription2.setUserId(2L);
        subscription2.setSubscribedQuantity(new BigDecimal("2000.00"));
        subscription2.setDepositAmount(new BigDecimal("2700.00"));
        subscription2.setPaymentStatus(1); // 已支付
        subscription2.setSubscriptionStatus(1);
        entityManager.persist(subscription2);
        entityManager.flush();

        // When
        BigDecimal total = subscriptionRepository.calculateTotalSubscribedQuantity(savedPlan.getPlanId());

        // Then
        assertEquals(new BigDecimal("3000.00"), total);
    }
}
