package com.example.finance.repository;

import com.example.finance.entity.FinancingRepaymentAdjustmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingRepaymentAdjustmentRequestRepository extends JpaRepository<FinancingRepaymentAdjustmentRequest, Long> {
    
    /**
     * 根据申请ID查询调整申请
     */
    List<FinancingRepaymentAdjustmentRequest> findByApplicationIdOrderByCreateTimeDesc(Long applicationId);
    
    /**
     * 根据用户ID查询调整申请
     */
    List<FinancingRepaymentAdjustmentRequest> findByUserIdOrderByCreateTimeDesc(Long userId);
    
    /**
     * 根据申请状态查询
     */
    List<FinancingRepaymentAdjustmentRequest> findByRequestStatusOrderByCreateTimeDesc(Integer requestStatus);
    
    /**
     * 根据审批人ID查询
     */
    List<FinancingRepaymentAdjustmentRequest> findByApproverIdOrderByApprovalTimeDesc(Long approverId);
}