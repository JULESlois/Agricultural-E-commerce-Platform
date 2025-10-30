package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_repayment_adjustment_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingRepaymentAdjustmentRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;
    
    @Column(name = "application_id", nullable = false)
    private Long applicationId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "request_reason", nullable = false, length = 500)
    private String requestReason;
    
    @Column(name = "proposed_plan_details", nullable = false, columnDefinition = "TEXT")
    private String proposedPlanDetails;
    
    @Column(name = "request_status")
    private Integer requestStatus = 0; // 0=待银行审批, 1=已批准, 2=已驳回
    
    @Column(name = "approver_id")
    private Long approverId;
    
    @Column(name = "approval_remark", length = 500)
    private String approvalRemark;
    
    @Column(name = "approval_time")
    private LocalDateTime approvalTime;
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}