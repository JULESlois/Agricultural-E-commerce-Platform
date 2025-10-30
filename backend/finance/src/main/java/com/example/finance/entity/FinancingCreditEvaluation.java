package com.example.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "financing_credit_evaluation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingCreditEvaluation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id")
    private Long evaluationId;
    
    @Column(name = "application_id", nullable = false, unique = true)
    private Long applicationId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "evaluation_time", nullable = false)
    private LocalDateTime evaluationTime;
    
    @Column(name = "evaluation_type", nullable = false)
    private Integer evaluationType = 1; // 1=系统自动评估, 2=人工辅助评估
    
    @Column(name = "evaluator_id")
    private Long evaluatorId;
    
    @Column(name = "credit_score", nullable = false)
    private Integer creditScore;
    
    @Column(name = "credit_level", nullable = false, length = 20)
    private String creditLevel;
    
    @Column(name = "score_detail", nullable = false, columnDefinition = "TEXT")
    private String scoreDetail; // JSON格式存储
    
    @Column(name = "data_sources", nullable = false, length = 500)
    private String dataSources;
    
    @Column(name = "evaluation_result", nullable = false)
    private Integer evaluationResult; // 1=通过, 2=不通过
    
    @Column(name = "evaluation_remark", length = 500)
    private String evaluationRemark;
    
    @Column(name = "credit_report_url", length = 200)
    private String creditReportUrl;
    
    @Column(name = "report_generate_time")
    private LocalDateTime reportGenerateTime;
    
    @PrePersist
    protected void onCreate() {
        if (evaluationTime == null) {
            evaluationTime = LocalDateTime.now();
        }
    }
}