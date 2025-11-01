package com.example.finance.entity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * FinancingLoanType实体类单元测试
 */
public class FinancingLoanTypeTest {
    
    private FinancingLoanType loanType;
    
    @BeforeEach
    void setUp() {
        loanType = new FinancingLoanType();
    }
    
    @Test
    void testLoanTypeCreation() {
        // 测试贷款类型创建
        loanType.setLoanTypeName("种植周转贷");
        loanType.setLoanPurpose("用于小麦种植期间化肥、农药采购资金周转");
        loanType.setMinLoanAmount(new BigDecimal("10000.00"));
        loanType.setMaxLoanAmount(new BigDecimal("500000.00"));
        loanType.setLoanTermType(2); // 按月
        loanType.setMinLoanTerm(3);
        loanType.setMaxLoanTerm(12);
        loanType.setInterestRateType(1); // 固定利率
        loanType.setMinInterestRate(new BigDecimal("0.0435"));
        loanType.setMaxInterestRate(new BigDecimal("0.065"));
        loanType.setRequiredMaterials("身份证,种植证明,银行流水");
        loanType.setApplicableObjects("种植规模≥50亩的农户");
        loanType.setSupportBanks("中国农业银行,中国邮政储蓄银行");
        loanType.setStatus(1);
        loanType.setSort(1);
        
        // 验证基本属性
        assertEquals("种植周转贷", loanType.getLoanTypeName());
        assertEquals("用于小麦种植期间化肥、农药采购资金周转", loanType.getLoanPurpose());
        assertEquals(0, loanType.getMinLoanAmount().compareTo(new BigDecimal("10000.00")));
        assertEquals(0, loanType.getMaxLoanAmount().compareTo(new BigDecimal("500000.00")));
        assertEquals(2, loanType.getLoanTermType());
        assertEquals(3, loanType.getMinLoanTerm());
        assertEquals(12, loanType.getMaxLoanTerm());
        assertEquals(1, loanType.getInterestRateType());
        assertEquals(0, loanType.getMinInterestRate().compareTo(new BigDecimal("0.0435")));
        assertEquals(0, loanType.getMaxInterestRate().compareTo(new BigDecimal("0.065")));
        assertEquals("身份证,种植证明,银行流水", loanType.getRequiredMaterials());
        assertEquals("种植规模≥50亩的农户", loanType.getApplicableObjects());
        assertEquals("中国农业银行,中国邮政储蓄银行", loanType.getSupportBanks());
        assertEquals(1, loanType.getStatus());
        assertEquals(1, loanType.getSort());
    }
    
    @Test
    void testPrePersistCallback() {
        // 测试@PrePersist回调
        loanType.onCreate();
        
        assertNotNull(loanType.getCreateTime());
        assertNotNull(loanType.getUpdateTime());
        
        LocalDateTime createTime = loanType.getCreateTime();
        LocalDateTime updateTime = loanType.getUpdateTime();
        
        // 创建时间和更新时间应该相同
        assertEquals(createTime.toLocalDate(), updateTime.toLocalDate());
    }
    
    @Test
    void testPreUpdateCallback() {
        // 测试@PreUpdate回调
        loanType.onCreate();
        LocalDateTime originalUpdateTime = loanType.getUpdateTime();
        
        // 模拟时间流逝
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        loanType.onUpdate();
        
        assertNotNull(loanType.getUpdateTime());
        assertTrue(loanType.getUpdateTime().isAfter(originalUpdateTime) || 
                  loanType.getUpdateTime().equals(originalUpdateTime));
    }
    
    @Test
    void testDefaultValues() {
        // 测试默认值
        assertEquals(1, loanType.getStatus()); // 默认启用
        assertEquals(0, loanType.getSort()); // 默认排序为0
    }
    
    @Test
    void testLoanAmountValidation() {
        // 测试贷款金额范围验证逻辑
        loanType.setMinLoanAmount(new BigDecimal("10000"));
        loanType.setMaxLoanAmount(new BigDecimal("500000"));
        
        BigDecimal testAmount1 = new BigDecimal("50000");
        BigDecimal testAmount2 = new BigDecimal("5000");
        BigDecimal testAmount3 = new BigDecimal("600000");
        
        // 在范围内
        assertTrue(testAmount1.compareTo(loanType.getMinLoanAmount()) >= 0 && 
                  testAmount1.compareTo(loanType.getMaxLoanAmount()) <= 0);
        
        // 小于最小值
        assertTrue(testAmount2.compareTo(loanType.getMinLoanAmount()) < 0);
        
        // 大于最大值
        assertTrue(testAmount3.compareTo(loanType.getMaxLoanAmount()) > 0);
    }
    
    @Test
    void testLoanTermValidation() {
        // 测试贷款期限范围验证逻辑
        loanType.setMinLoanTerm(3);
        loanType.setMaxLoanTerm(12);
        
        int testTerm1 = 6;
        int testTerm2 = 1;
        int testTerm3 = 24;
        
        // 在范围内
        assertTrue(testTerm1 >= loanType.getMinLoanTerm() && 
                  testTerm1 <= loanType.getMaxLoanTerm());
        
        // 小于最小值
        assertTrue(testTerm2 < loanType.getMinLoanTerm());
        
        // 大于最大值
        assertTrue(testTerm3 > loanType.getMaxLoanTerm());
    }
    
    @Test
    void testInterestRateValidation() {
        // 测试利率范围验证逻辑
        loanType.setMinInterestRate(new BigDecimal("0.0435"));
        loanType.setMaxInterestRate(new BigDecimal("0.065"));
        
        BigDecimal testRate1 = new BigDecimal("0.05");
        BigDecimal testRate2 = new BigDecimal("0.03");
        BigDecimal testRate3 = new BigDecimal("0.08");
        
        // 在范围内
        assertTrue(testRate1.compareTo(loanType.getMinInterestRate()) >= 0 && 
                  testRate1.compareTo(loanType.getMaxInterestRate()) <= 0);
        
        // 小于最小值
        assertTrue(testRate2.compareTo(loanType.getMinInterestRate()) < 0);
        
        // 大于最大值
        assertTrue(testRate3.compareTo(loanType.getMaxInterestRate()) > 0);
    }
}