package com.example.finance.repository;

import com.example.finance.entity.FinancingPresaleSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FinancingPresaleSubscriptionRepository extends JpaRepository<FinancingPresaleSubscription, Long> {
    
    /**
     * 根据用户ID查询认购记录
     */
    List<FinancingPresaleSubscription> findByUserIdOrderByCreateTimeDesc(Long userId);
    
    /**
     * 根据预售计划ID查询认购记录
     */
    List<FinancingPresaleSubscription> findByPlanIdOrderByCreateTimeDesc(Long planId);
    
    /**
     * 根据认购编号查询
     */
    FinancingPresaleSubscription findBySubscriptionNo(String subscriptionNo);
    
    /**
     * 计算指定预售计划的总认购数量
     */
    @Query("SELECT COALESCE(SUM(fps.subscribedQuantity), 0) FROM FinancingPresaleSubscription fps WHERE fps.planId = :planId AND fps.subscriptionStatus = 1 AND fps.paymentStatus = 1")
    BigDecimal calculateTotalSubscribedQuantity(@Param("planId") Long planId);
    
    /**
     * 计算指定预售计划的总定金金额
     */
    @Query("SELECT COALESCE(SUM(fps.depositAmount), 0) FROM FinancingPresaleSubscription fps WHERE fps.planId = :planId AND fps.subscriptionStatus = 1 AND fps.paymentStatus = 1")
    BigDecimal calculateTotalDepositAmount(@Param("planId") Long planId);
}