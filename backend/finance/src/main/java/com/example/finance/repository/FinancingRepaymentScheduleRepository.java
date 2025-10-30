package com.example.finance.repository;

import com.example.finance.entity.FinancingRepaymentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinancingRepaymentScheduleRepository extends JpaRepository<FinancingRepaymentSchedule, Long> {
    
    /**
     * 根据申请ID查询还款计划
     */
    List<FinancingRepaymentSchedule> findByApplicationIdOrderByTermNumber(Long applicationId);
    
    /**
     * 根据还款状态查询
     */
    List<FinancingRepaymentSchedule> findByPaymentStatusOrderByDueDate(Integer paymentStatus);
    
    /**
     * 查询指定日期范围内到期的还款计划
     */
    @Query("SELECT frs FROM FinancingRepaymentSchedule frs WHERE frs.dueDate BETWEEN :startDate AND :endDate AND frs.paymentStatus = 0 ORDER BY frs.dueDate")
    List<FinancingRepaymentSchedule> findDueSchedules(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * 查询逾期的还款计划
     */
    @Query("SELECT frs FROM FinancingRepaymentSchedule frs WHERE frs.dueDate < :currentDate AND frs.paymentStatus = 0")
    List<FinancingRepaymentSchedule> findOverdueSchedules(@Param("currentDate") LocalDate currentDate);
}