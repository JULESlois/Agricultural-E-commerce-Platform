package com.example.finance.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 融资申请创建请求DTO测试
 */
class FinancingApplicationCreateRequestTest {

    private Validator validator;
    private FinancingApplicationCreateRequest request;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(1);
        request.setApplyAmount(new BigDecimal("100000.00"));
        request.setApplyTerm(6);
        request.setLoanPurposeDetail("用于小麦种植");
        request.setRepaymentPlan("收获后还款");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/id.jpg"));
    }

    @Test
    void testValidRequest() {
        Set<ConstraintViolation<FinancingApplicationCreateRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "有效的请求不应该有验证错误");
    }

    @Test
    void testSetAndGetLoanTypeId() {
        request.setLoanTypeId(2);
        assertEquals(2, request.getLoanTypeId());
    }

    @Test
    void testSetAndGetApplyAmount() {
        BigDecimal amount = new BigDecimal("200000.00");
        request.setApplyAmount(amount);
        assertEquals(amount, request.getApplyAmount());
    }

    @Test
    void testSetAndGetApplyTerm() {
        request.setApplyTerm(12);
        assertEquals(12, request.getApplyTerm());
    }

    @Test
    void testSetAndGetLoanPurposeDetail() {
        request.setLoanPurposeDetail("用于玉米种植");
        assertEquals("用于玉米种植", request.getLoanPurposeDetail());
    }

    @Test
    void testSetAndGetRepaymentPlan() {
        request.setRepaymentPlan("分期还款");
        assertEquals("分期还款", request.getRepaymentPlan());
    }

    @Test
    void testSetAndGetBankId() {
        request.setBankId(102);
        assertEquals(102, request.getBankId());
    }

    @Test
    void testSetAndGetMaterialUrls() {
        request.setMaterialUrls(Arrays.asList("url1", "url2"));
        assertEquals(2, request.getMaterialUrls().size());
    }

    @Test
    void testNegativeAmount() {
        request.setApplyAmount(new BigDecimal("-1000"));
        Set<ConstraintViolation<FinancingApplicationCreateRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "负数金额应该有验证错误");
    }

    @Test
    void testZeroAmount() {
        request.setApplyAmount(BigDecimal.ZERO);
        Set<ConstraintViolation<FinancingApplicationCreateRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "零金额应该有验证错误");
    }
}
