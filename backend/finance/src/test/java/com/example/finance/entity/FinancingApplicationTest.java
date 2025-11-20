package com.example.finance.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 融资申请实体测试
 */
class FinancingApplicationTest {

    private FinancingApplication application;

    @BeforeEach
    void setUp() {
        application = new FinancingApplication();
    }

    @Test
    void testSetAndGetApplicationId() {
        application.setApplicationId(100L);
        assertEquals(100L, application.getApplicationId());
    }

    @Test
    void testSetAndGetApplicationNo() {
        application.setApplicationNo("FIN2025102712345678");
        assertEquals("FIN2025102712345678", application.getApplicationNo());
    }

    @Test
    void testSetAndGetUserId() {
        application.setUserId(1L);
        assertEquals(1L, application.getUserId());
    }

    @Test
    void testSetAndGetLoanTypeId() {
        application.setLoanTypeId(1);
        assertEquals(1, application.getLoanTypeId());
    }

    @Test
    void testSetAndGetApplyAmount() {
        BigDecimal amount = new BigDecimal("100000.00");
        application.setApplyAmount(amount);
        assertEquals(amount, application.getApplyAmount());
    }

    @Test
    void testSetAndGetApplyTerm() {
        application.setApplyTerm(6);
        assertEquals(6, application.getApplyTerm());
    }

    @Test
    void testSetAndGetApplicationStatus() {
        application.setApplicationStatus(1);
        assertEquals(1, application.getApplicationStatus());
    }

    @Test
    void testSetAndGetBankId() {
        application.setBankId(101);
        assertEquals(101, application.getBankId());
    }

    @Test
    void testSetAndGetLoanPurposeDetail() {
        application.setLoanPurposeDetail("用于小麦种植");
        assertEquals("用于小麦种植", application.getLoanPurposeDetail());
    }

    @Test
    void testSetAndGetRepaymentPlan() {
        application.setRepaymentPlan("收获后还款");
        assertEquals("收获后还款", application.getRepaymentPlan());
    }

    @Test
    void testSetAndGetMaterialUrls() {
        application.setMaterialUrls("https://example.com/id.jpg,https://example.com/proof.pdf");
        assertEquals("https://example.com/id.jpg,https://example.com/proof.pdf", application.getMaterialUrls());
    }

    @Test
    void testSetAndGetCreateTime() {
        LocalDateTime now = LocalDateTime.now();
        application.setCreateTime(now);
        assertEquals(now, application.getCreateTime());
    }

    @Test
    void testSetAndGetUpdateTime() {
        LocalDateTime now = LocalDateTime.now();
        application.setUpdateTime(now);
        assertEquals(now, application.getUpdateTime());
    }

    @Test
    void testApplicationStatusTransition() {
        // 待信用评估 -> 待银行审批
        application.setApplicationStatus(1);
        assertEquals(1, application.getApplicationStatus());
        
        application.setApplicationStatus(2);
        assertEquals(2, application.getApplicationStatus());
        
        // 待银行审批 -> 审批通过
        application.setApplicationStatus(3);
        assertEquals(3, application.getApplicationStatus());
        
        // 审批通过 -> 已放款
        application.setApplicationStatus(5);
        assertEquals(5, application.getApplicationStatus());
    }

    @Test
    void testApplicationWithAllFields() {
        application.setApplicationId(100L);
        application.setApplicationNo("FIN2025102712345678");
        application.setUserId(1L);
        application.setLoanTypeId(1);
        application.setApplyAmount(new BigDecimal("100000.00"));
        application.setApplyTerm(6);
        application.setLoanPurposeDetail("用于小麦种植");
        application.setRepaymentPlan("收获后还款");
        application.setBankId(101);
        application.setApplicationStatus(1);
        application.setMaterialUrls("https://example.com/id.jpg");

        assertNotNull(application.getApplicationId());
        assertNotNull(application.getApplicationNo());
        assertNotNull(application.getUserId());
        assertNotNull(application.getLoanTypeId());
        assertNotNull(application.getApplyAmount());
        assertNotNull(application.getApplyTerm());
        assertNotNull(application.getApplicationStatus());
    }
}
