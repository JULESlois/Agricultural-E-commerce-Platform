package com.example.finance.repository;

import com.example.finance.entity.FinancingCreditEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingCreditEvaluationRepository extends JpaRepository<FinancingCreditEvaluation, Long> {
    
    /**
     * 根据申请ID查询信用评估
     */
    FinancingCreditEvaluation findByApplicationId(Long applicationId);
    
    /**
     * 根据用户ID查询信用评估历史
     */
    List<FinancingCreditEvaluation> findByUserIdOrderByEvaluationTimeDesc(Long userId);
    
    /**
     * 根据评估结果查询
     */
    List<FinancingCreditEvaluation> findByEvaluationResult(Integer evaluationResult);
}