package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_bank")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingBank {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bank_id")
    private Integer bankId;
    
    @Column(name = "bank_name", nullable = false, unique = true, length = 100)
    private String bankName;
    
    @Column(name = "bank_short_name", nullable = false, unique = true, length = 50)
    private String bankShortName;
    
    @Column(name = "bank_logo", length = 200)
    private String bankLogo;
    
    @Column(name = "contact_department", nullable = false, length = 100)
    private String contactDepartment;
    
    @Column(name = "contact_person", nullable = false, length = 50)
    private String contactPerson;
    
    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;
    
    @Column(name = "contact_email", length = 100)
    private String contactEmail;
    
    @Column(name = "bank_province", nullable = false, length = 50)
    private String bankProvince;
    
    @Column(name = "bank_city", length = 50)
    private String bankCity;
    
    @Column(name = "supported_loan_types", nullable = false, length = 200)
    private String supportedLoanTypes;
    
    @Column(name = "approval_cycle", nullable = false, length = 50)
    private String approvalCycle;
    
    @Column(name = "bank_status", nullable = false)
    private Integer bankStatus = 1; // 0=暂停合作, 1=正常合作
    
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