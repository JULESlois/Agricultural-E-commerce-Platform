package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_presale_plan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingPresalePlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;
    
    @Column(name = "plan_no", nullable = false, unique = true, length = 32)
    private String planNo;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "category_id", nullable = false)
    private Integer categoryId;
    
    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;
    
    @Column(name = "plant_date", nullable = false)
    private LocalDate plantDate;
    
    @Column(name = "expected_harvest_date", nullable = false)
    private LocalDate expectedHarvestDate;
    
    @Column(name = "total_yield_quantity", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalYieldQuantity;
    
    @Column(name = "presale_unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal presaleUnitPrice;
    
    @Column(name = "deposit_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal depositRatio;
    
    @Column(name = "subscribed_quantity", precision = 15, scale = 2)
    private BigDecimal subscribedQuantity = BigDecimal.ZERO;
    
    @Column(name = "plan_status")
    private Integer planStatus = 0; // 0=草稿, 1=待审核, 2=预售中, 3=预售满额, 4=生产中, 5=已收获, 6=已完成, 7=已取消
    
    @Column(name = "audit_status")
    private Integer auditStatus = 0; // 0=待审核, 1=通过, 2=驳回
    
    @Column(name = "audit_remark", length = 500)
    private String auditRemark;
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}