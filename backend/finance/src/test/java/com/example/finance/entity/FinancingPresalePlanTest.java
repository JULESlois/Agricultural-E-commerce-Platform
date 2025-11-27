package com.example.finance.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 预售计划实体测试
 */
class FinancingPresalePlanTest {

    private FinancingPresalePlan presalePlan;

    @BeforeEach
    void setUp() {
        presalePlan = new FinancingPresalePlan();
    }

    @Test
    void testSetAndGetPlanId() {
        presalePlan.setPlanId(1L);
        assertEquals(1L, presalePlan.getPlanId());
    }

    @Test
    void testSetAndGetPlanNo() {
        presalePlan.setPlanNo("PRE202510150001");
        assertEquals("PRE202510150001", presalePlan.getPlanNo());
    }

    @Test
    void testSetAndGetUserId() {
        presalePlan.setUserId(1L);
        assertEquals(1L, presalePlan.getUserId());
    }

    @Test
    void testSetAndGetCategoryId() {
        presalePlan.setCategoryId(101);
        assertEquals(101, presalePlan.getCategoryId());
    }

    @Test
    void testSetAndGetProductName() {
        presalePlan.setProductName("2026年春季中牟大蒜");
        assertEquals("2026年春季中牟大蒜", presalePlan.getProductName());
    }

    @Test
    void testSetAndGetPlantDate() {
        LocalDate plantDate = LocalDate.of(2025, 10, 15);
        presalePlan.setPlantDate(plantDate);
        assertEquals(plantDate, presalePlan.getPlantDate());
    }

    @Test
    void testSetAndGetExpectedHarvestDate() {
        LocalDate harvestDate = LocalDate.of(2026, 5, 20);
        presalePlan.setExpectedHarvestDate(harvestDate);
        assertEquals(harvestDate, presalePlan.getExpectedHarvestDate());
    }

    @Test
    void testSetAndGetTotalYieldQuantity() {
        BigDecimal quantity = new BigDecimal("50000.00");
        presalePlan.setTotalYieldQuantity(quantity);
        assertEquals(quantity, presalePlan.getTotalYieldQuantity());
    }

    @Test
    void testSetAndGetPresaleUnitPrice() {
        BigDecimal price = new BigDecimal("4.50");
        presalePlan.setPresaleUnitPrice(price);
        assertEquals(price, presalePlan.getPresaleUnitPrice());
    }

    @Test
    void testSetAndGetDepositRatio() {
        BigDecimal ratio = new BigDecimal("0.3");
        presalePlan.setDepositRatio(ratio);
        assertEquals(ratio, presalePlan.getDepositRatio());
    }

    @Test
    void testSetAndGetPlanStatus() {
        presalePlan.setPlanStatus(2);
        assertEquals(2, presalePlan.getPlanStatus());
    }

    @Test
    void testPlanStatusTransition() {
        // 待审核
        presalePlan.setPlanStatus(1);
        assertEquals(1, presalePlan.getPlanStatus());
        
        // 预售中
        presalePlan.setPlanStatus(2);
        assertEquals(2, presalePlan.getPlanStatus());
        
        // 预售满额
        presalePlan.setPlanStatus(3);
        assertEquals(3, presalePlan.getPlanStatus());
        
        // 已完成
        presalePlan.setPlanStatus(4);
        assertEquals(4, presalePlan.getPlanStatus());
    }

    @Test
    void testDateValidation() {
        LocalDate plantDate = LocalDate.of(2025, 10, 15);
        LocalDate harvestDate = LocalDate.of(2026, 5, 20);
        
        presalePlan.setPlantDate(plantDate);
        presalePlan.setExpectedHarvestDate(harvestDate);
        
        assertTrue(presalePlan.getExpectedHarvestDate().isAfter(presalePlan.getPlantDate()),
            "收获日期应该晚于种植日期");
    }

    @Test
    void testCalculateTotalPresaleValue() {
        presalePlan.setTotalYieldQuantity(new BigDecimal("50000.00"));
        presalePlan.setPresaleUnitPrice(new BigDecimal("4.50"));
        
        BigDecimal totalValue = presalePlan.getTotalYieldQuantity()
            .multiply(presalePlan.getPresaleUnitPrice());
        
        assertEquals(0, new BigDecimal("225000.00").compareTo(totalValue));
    }

    @Test
    void testCalculateTotalDepositAmount() {
        presalePlan.setTotalYieldQuantity(new BigDecimal("50000.00"));
        presalePlan.setPresaleUnitPrice(new BigDecimal("4.50"));
        presalePlan.setDepositRatio(new BigDecimal("0.3"));
        
        BigDecimal totalDeposit = presalePlan.getTotalYieldQuantity()
            .multiply(presalePlan.getPresaleUnitPrice())
            .multiply(presalePlan.getDepositRatio());
        
        assertEquals(0, new BigDecimal("67500.00").compareTo(totalDeposit));
    }
}
