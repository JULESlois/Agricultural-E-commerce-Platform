package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "financing_repayment_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingRepaymentSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;
    
    @Column(name = "application_id", nullable = false)
    private Long applicationId;
    
    @Column(name = "term_number", nullable = false)
    private Integer termNumber;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Column(name = "principal_due", nullable = false, precision = 15, scale = 2)
    private BigDecimal principalDue;
    
    @Column(name = "interest_due", nullable = false, precision = 15, scale = 2)
    private BigDecimal interestDue;
    
    @Column(name = "principal_paid", precision = 15, scale = 2)
    private BigDecimal principalPaid = BigDecimal.ZERO;
    
    @Column(name = "interest_paid", precision = 15, scale = 2)
    private BigDecimal interestPaid = BigDecimal.ZERO;
    
    @Column(name = "payment_status")
    private Integer paymentStatus = 0; // 0=待还款, 1=已还款, 2=逾期, 3=已调整
    
    @Column(name = "adjustment_request_id")
    private Long adjustmentRequestId;
}