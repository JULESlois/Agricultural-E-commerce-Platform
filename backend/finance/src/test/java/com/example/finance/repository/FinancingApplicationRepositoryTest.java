package com.example.finance.repository;

import com.example.finance.entity.FinancingApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 融资申请Repository测试
 */
@DataJpaTest
@ActiveProfiles("test")
class FinancingApplicationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FinancingApplicationRepository applicationRepository;

    private FinancingApplication application;

    @BeforeEach
    void setUp() {
        application = new FinancingApplication();
        application.setApplicationNo("FIN2025102712345678");
        application.setUserId(1L);
        application.setLoanTypeId(1);
        application.setApplyAmount(new BigDecimal("100000.00"));
        application.setApplyTerm(6);
        application.setApplyTermType(2); // 添加必填字段：按月
        application.setLoanPurposeDetail("用于小麦种植");
        application.setRepaymentPlan("收获后还款");
        application.setBankId(101);
        application.setContactPhone("13800138000");
        application.setContactAddress("河南省郑州市");
        application.setMaterialUrls("https://example.com/id.jpg"); // 添加必填字段
        application.setApplicationStatus(1);
    }

    @Test
    void testSaveApplication() {
        // When
        FinancingApplication saved = applicationRepository.save(application);

        // Then
        assertNotNull(saved.getApplicationId());
        assertEquals("FIN2025102712345678", saved.getApplicationNo());
        assertEquals(1L, saved.getUserId());
    }

    @Test
    void testFindByUserId() {
        // Given
        entityManager.persist(application);
        entityManager.flush();

        // When
        List<FinancingApplication> found = applicationRepository.findByUserIdOrderByCreateTimeDesc(1L);

        // Then
        assertFalse(found.isEmpty());
        assertEquals(1L, found.get(0).getUserId());
    }

    @Test
    void testFindByApplicationStatus() {
        // Given
        entityManager.persist(application);
        entityManager.flush();

        // When
        List<FinancingApplication> found = applicationRepository.findByApplicationStatusOrderByCreateTimeDesc(1);

        // Then
        assertFalse(found.isEmpty());
        assertEquals(1, found.get(0).getApplicationStatus());
    }

    @Test
    void testFindByBankIdAndStatus() {
        // Given
        entityManager.persist(application);
        entityManager.flush();

        // When
        List<FinancingApplication> found = applicationRepository.findByBankIdAndStatus(101, 1);

        // Then
        assertFalse(found.isEmpty());
        assertEquals(101, found.get(0).getBankId());
        assertEquals(1, found.get(0).getApplicationStatus());
    }

    @Test
    void testUpdateApplicationStatus() {
        // Given
        FinancingApplication saved = entityManager.persist(application);
        entityManager.flush();

        // When
        saved.setApplicationStatus(2);
        applicationRepository.save(saved);
        entityManager.flush();

        // Then
        FinancingApplication updated = applicationRepository.findById(saved.getApplicationId()).orElse(null);
        assertNotNull(updated);
        assertEquals(2, updated.getApplicationStatus());
    }
}
