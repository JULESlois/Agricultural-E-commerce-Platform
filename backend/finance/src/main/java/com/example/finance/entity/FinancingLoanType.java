package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_loan_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingLoanType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_type_id")
    private Integer loanTypeId;
    
    @Column(name = "loan_type_name", nullable = false, unique = true, length = 100)
    private String loanTypeName;
    
    @Column(name = "loan_purpose", nullable = false, length = 200)
    private String loanPurpose;
    
    @Column(name = "min_loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal minLoanAmount;
    
    @Column(name = "max_loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal maxLoanAmount;
    
    @Column(name = "loan_term_type", nullable = false)
    private Integer loanTermType; // 1=按天, 2=按月, 3=按季
    
    @Column(name = "min_loan_term", nullable = false)
    private Integer minLoanTerm;
    
    @Column(name = "max_loan_term", nullable = false)
    private Integer maxLoanTerm;
    
    @Column(name = "interest_rate_type", nullable = false)
    private Integer interestRateType; // 1=固定利率, 2=浮动利率
    
    @Column(name = "min_interest_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal minInterestRate;
    
    @Column(name = "max_interest_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal maxInterestRate;
    
    @Column(name = "required_materials", nullable = false, length = 500)
    private String requiredMaterials;
    
    @Column(name = "applicable_objects", nullable = false, length = 200)
    private String applicableObjects;
    
    @Column(name = "support_banks", nullable = false, length = 500)
    private String supportBanks;
    
    @Column(name = "status", nullable = false)
    private Integer status = 1; // 0=停用, 1=启用
    
    @Column(name = "sort")
    private Integer sort = 0;
    
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