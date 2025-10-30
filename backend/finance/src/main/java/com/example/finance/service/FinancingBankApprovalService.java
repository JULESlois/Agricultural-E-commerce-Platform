package com.example.finance.service;

import com.example.finance.dto.BankApprovalRequest;
import com.example.finance.entity.FinancingBankApproval;
import com.example.finance.repository.FinancingBankApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinancingBankApprovalService {
    
    @Autowired
    private FinancingBankApprovalRepository bankApprovalRepository;
    
    @Autowired
    private FinancingApplicationService applicationService;
    
    /**
     * 提交银行审批结论
     */
    @Transactional
    public void submitBankApproval(Long applicationId, Integer bankId, Long approverId, 
                                 String approverName, BankApprovalRequest request) {
        // 验证审批通过时的必填字段
        if (request.getApprovalResult() == 1) {
            if (request.getApprovalAmount() == null || request.getApprovalTerm() == null || 
                request.getInterestRate() == null || request.getRepaymentMethod() == null) {
                throw new RuntimeException("审批通过时，审批金额、期限、利率和还款方式不能为空");
            }
        }
        
        // 检查是否已经审批过
        FinancingBankApproval existing = bankApprovalRepository.findByApplicationId(applicationId);
        if (existing != null) {
            throw new RuntimeException("该申请已经审批过");
        }
        
        // 创建审批记录
        FinancingBankApproval approval = new FinancingBankApproval();
        approval.setApplicationId(applicationId);
        approval.setBankId(bankId);
        approval.setApproverId(approverId);
        approval.setApproverName(approverName);
        approval.setApprovalResult(request.getApprovalResult());
        approval.setApprovalAmount(request.getApprovalAmount());
        approval.setApprovalTerm(request.getApprovalTerm());
        approval.setInterestRate(request.getInterestRate());
        approval.setRepaymentMethod(request.getRepaymentMethod());
        approval.setApprovalRemark(request.getApprovalRemark());
        approval.setLoanContractUrl(request.getLoanContractUrl());
        
        bankApprovalRepository.save(approval);
        
        // 更新申请状态
        if (request.getApprovalResult() == 1) {
            applicationService.updateApplicationStatus(applicationId, 3); // 审批通过
        } else {
            applicationService.updateApplicationStatus(applicationId, 4); // 审批驳回
        }
    }
    
    /**
     * 确认放款
     */
    @Transactional
    public void confirmLoanDisburse(Long applicationId, LocalDateTime loanTime) {
        FinancingBankApproval approval = bankApprovalRepository.findByApplicationId(applicationId);
        if (approval == null) {
            throw new RuntimeException("未找到审批记录");
        }
        
        if (approval.getApprovalResult() != 1) {
            throw new RuntimeException("只有审批通过的申请才能放款");
        }
        
        approval.setLoanTime(loanTime);
        bankApprovalRepository.save(approval);
        
        // 更新申请状态为已放款
        applicationService.updateApplicationStatus(applicationId, 5);
    }
    
    /**
     * 根据申请ID获取审批记录
     */
    public FinancingBankApproval getApprovalByApplicationId(Long applicationId) {
        return bankApprovalRepository.findByApplicationId(applicationId);
    }
    
    /**
     * 根据银行ID获取审批记录列表
     */
    public List<FinancingBankApproval> getApprovalsByBankId(Integer bankId) {
        return bankApprovalRepository.findByBankIdOrderByApprovalTimeDesc(bankId);
    }
}