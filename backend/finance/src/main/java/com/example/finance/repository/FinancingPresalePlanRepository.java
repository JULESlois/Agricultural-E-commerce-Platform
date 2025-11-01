package com.example.finance.repository;

import com.example.finance.entity.FinancingPresalePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingPresalePlanRepository extends JpaRepository<FinancingPresalePlan, Long> {
    
    /**
     * 根据用户ID查询预售计划
     */
    List<FinancingPresalePlan> findByUserIdOrderByCreateTimeDesc(Long userId);
    
    /**
     * 根据计划状态查询
     */
    List<FinancingPresalePlan> findByPlanStatusOrderByCreateTimeDesc(Integer planStatus);
    
    /**
     * 查询正在预售中的计划
     */
    @Query("SELECT fp FROM FinancingPresalePlan fp WHERE fp.planStatus = 2 AND fp.auditStatus = 1 ORDER BY fp.createTime DESC")
    List<FinancingPresalePlan> findActivePresalePlans();
    
    /**
     * 根据品类ID查询预售计划
     */
    List<FinancingPresalePlan> findByCategoryIdAndPlanStatus(Integer categoryId, Integer planStatus);
    
    /**
     * 根据计划编号查询
     */
    FinancingPresalePlan findByPlanNo(String planNo);
}