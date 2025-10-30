package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_bank_approval")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingBankApproval {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_id")
    private Long approvalId;
    
    @Column(name = "application_id", nullable = false, unique = true)
    private Long applicationId;
    
    @Column(name = "bank_id", nullable = false)
    private Integer bankId;
    
    @Column(name = "approver_id", nullable = false)
    private Long approverId;
    
    @Column(name = "approver_name", nullable = false, length = 50)
    private String approverName;
    
    @Column(name = "approval_time", nullable = false)
    private LocalDateTime approvalTime;
    
    @Column(name = "approval_result", nullable = false)
    private Integer approvalResult; // 1=通过, 2=驳回
    
    @Column(name = "approval_amount", precision = 15, scale = 2)
    private BigDecimal approvalAmount;
    
    @Column(name = "approval_term")
    private Integer approvalTerm;
    
    @Column(name = "interest_rate", precision = 5, scale = 4)
    private BigDecimal interestRate;
    
    @Column(name = "repayment_method", length = 100)
    private String repaymentMethod;
    
    @Column(name = "approval_remark", nullable = false, length = 500)
    private String approvalRemark;
    
    @Column(name = "loan_contract_url", length = 200)
    private String loanContractUrl;
    
    @Column(name = "sign_time")
    private LocalDateTime signTime;
    
    @Column(name = "loan_time")
    private LocalDateTime loanTime;
    
    @Column(name = "loan_account", length = 50)
    private String loanAccount;
    
    @PrePersist
    protected void onCreate() {
        if (approvalTime == null) {
            approvalTime = LocalDateTime.now();
        }
    }
}