package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_presale_subscription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingPresaleSubscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long subscriptionId;
    
    @Column(name = "subscription_no", nullable = false, unique = true, length = 32)
    private String subscriptionNo;
    
    @Column(name = "plan_id", nullable = false)
    private Long planId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "subscribed_quantity", nullable = false, precision = 15, scale = 2)
    private BigDecimal subscribedQuantity;
    
    @Column(name = "deposit_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal depositAmount;
    
    @Column(name = "payment_status")
    private Integer paymentStatus = 0; // 0=待支付, 1=已支付, 2=已退款
    
    @Column(name = "payment_no", length = 50)
    private String paymentNo;
    
    @Column(name = "subscription_status")
    private Integer subscriptionStatus = 1; // 1=有效, 0=已取消
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}