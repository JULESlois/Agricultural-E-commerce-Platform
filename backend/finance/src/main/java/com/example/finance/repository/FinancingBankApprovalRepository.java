package com.example.finance.repository;

import com.example.finance.entity.FinancingBankApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingBankApprovalRepository extends JpaRepository<FinancingBankApproval, Long> {
    
    /**
     * 根据申请ID查询审批记录
     */
    FinancingBankApproval findByApplicationId(Long applicationId);
    
    /**
     * 根据银行ID查询审批记录
     */
    List<FinancingBankApproval> findByBankIdOrderByApprovalTimeDesc(Integer bankId);
    
    /**
     * 根据审批人ID查询审批记录
     */
    List<FinancingBankApproval> findByApproverIdOrderByApprovalTimeDesc(Long approverId);
    
    /**
     * 根据审批结果查询
     */
    List<FinancingBankApproval> findByApprovalResult(Integer approvalResult);
}