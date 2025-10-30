package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_application")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;
    
    @Column(name = "application_no", nullable = false, unique = true, length = 32)
    private String applicationNo;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "loan_type_id", nullable = false)
    private Integer loanTypeId;
    
    @Column(name = "apply_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal applyAmount;
    
    @Column(name = "apply_term", nullable = false)
    private Integer applyTerm;
    
    @Column(name = "apply_term_type", nullable = false)
    private Integer applyTermType;
    
    @Column(name = "loan_purpose_detail", nullable = false, length = 500)
    private String loanPurposeDetail;
    
    @Column(name = "repayment_plan", nullable = false, length = 500)
    private String repaymentPlan;
    
    @Column(name = "source_id")
    private Long sourceId;
    
    @Column(name = "bank_id", nullable = false)
    private Integer bankId;
    
    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;
    
    @Column(name = "contact_address", nullable = false, length = 200)
    private String contactAddress;
    
    @Column(name = "material_urls", nullable = false, length = 1000)
    private String materialUrls;
    
    @Column(name = "application_status", nullable = false)
    private Integer applicationStatus = 0; // 0=待提交, 1=待信用评估, 2=待银行审批, 3=审批通过, 4=审批驳回, 5=已放款, 6=已取消
    
    @Column(name = "cancel_time")
    private LocalDateTime cancelTime;
    
    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}