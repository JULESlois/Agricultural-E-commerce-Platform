package com.example.finance.service;

import com.example.finance.entity.FinancingCreditEvaluation;
import com.example.finance.repository.FinancingCreditEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class FinancingCreditEvaluationService {
    
    @Autowired
    private FinancingCreditEvaluationRepository creditEvaluationRepository;
    
    @Autowired
    private FinancingApplicationService applicationService;
    
    /**
     * 触发信用评估
     */
    @Transactional
    public void triggerCreditEvaluation(Long applicationId) {
        // 检查是否已经评估过
        FinancingCreditEvaluation existing = creditEvaluationRepository.findByApplicationId(applicationId);
        if (existing != null) {
            throw new RuntimeException("该申请已经进行过信用评估");
        }
        
        // 模拟信用评估过程
        CreditEvaluationResult result = performCreditEvaluation(applicationId);
        
        // 保存评估结果
        saveCreditEvaluationResult(applicationId, result);
        
        // 更新申请状态
        if (result.getEvaluationResult() == 1) {
            applicationService.updateApplicationStatus(applicationId, 2); // 待银行审批
        } else {
            applicationService.updateApplicationStatus(applicationId, 4); // 审批驳回
        }
    }
    
    /**
     * 保存信用评估结果
     */
    @Transactional
    public void saveCreditEvaluationResult(Long applicationId, CreditEvaluationResult result) {
        FinancingCreditEvaluation evaluation = new FinancingCreditEvaluation();
        evaluation.setApplicationId(applicationId);
        evaluation.setUserId(result.getUserId());
        evaluation.setEvaluationType(1); // 系统自动评估
        evaluation.setCreditScore(result.getCreditScore());
        evaluation.setCreditLevel(result.getCreditLevel());
        evaluation.setScoreDetail(result.getScoreDetailJson());
        evaluation.setDataSources(result.getDataSources());
        evaluation.setEvaluationResult(result.getEvaluationResult());
        evaluation.setEvaluationRemark(result.getEvaluationRemark());
        evaluation.setCreditReportUrl(result.getCreditReportUrl());
        evaluation.setReportGenerateTime(LocalDateTime.now());
        
        creditEvaluationRepository.save(evaluation);
    }
    
    /**
     * 根据申请ID获取信用评估结果
     */
    public FinancingCreditEvaluation getCreditEvaluationByApplicationId(Long applicationId) {
        return creditEvaluationRepository.findByApplicationId(applicationId);
    }
    
    /**
     * 模拟信用评估过程
     */
    private CreditEvaluationResult performCreditEvaluation(Long applicationId) {
        // 这里是模拟的信用评估逻辑，实际应该调用真实的信用评估系统
        Random random = new Random();
        
        // 模拟各维度评分
        int businessYears = random.nextInt(21) + 10; // 10-30分
        int platformTrade = random.nextInt(31) + 20; // 20-50分
        int creditHistory = random.nextInt(21) + 10; // 10-30分
        int assetStatus = random.nextInt(16) + 5;    // 5-20分
        
        int totalScore = businessYears + platformTrade + creditHistory + assetStatus;
        
        // 构建评分详情
        Map<String, Integer> scoreDetail = new HashMap<>();
        scoreDetail.put("经营年限", businessYears);
        scoreDetail.put("平台交易", platformTrade);
        scoreDetail.put("征信记录", creditHistory);
        scoreDetail.put("资产状况", assetStatus);
        
        // 确定信用等级和评估结果
        String creditLevel;
        int evaluationResult;
        String evaluationRemark;
        
        if (totalScore >= 80) {
            creditLevel = "A级";
            evaluationResult = 1;
            evaluationRemark = "信用优秀，建议通过";
        } else if (totalScore >= 60) {
            creditLevel = "B级";
            evaluationResult = 1;
            evaluationRemark = "信用良好，建议通过";
        } else {
            creditLevel = "C级";
            evaluationResult = 2;
            evaluationRemark = "信用不达标，建议驳回";
        }
        
        return new CreditEvaluationResult(
            1L, // 模拟用户ID
            totalScore,
            creditLevel,
            scoreDetail.toString(),
            "平台交易记录，农户经营信息，第三方征信数据",
            evaluationResult,
            evaluationRemark,
            "https://example.com/credit-report/" + applicationId + ".pdf"
        );
    }
    
    /**
     * 信用评估结果内部类
     */
    private static class CreditEvaluationResult {
        private Long userId;
        private Integer creditScore;
        private String creditLevel;
        private String scoreDetailJson;
        private String dataSources;
        private Integer evaluationResult;
        private String evaluationRemark;
        private String creditReportUrl;
        
        public CreditEvaluationResult(Long userId, Integer creditScore, String creditLevel,
                                    String scoreDetailJson, String dataSources, Integer evaluationResult,
                                    String evaluationRemark, String creditReportUrl) {
            this.userId = userId;
            this.creditScore = creditScore;
            this.creditLevel = creditLevel;
            this.scoreDetailJson = scoreDetailJson;
            this.dataSources = dataSources;
            this.evaluationResult = evaluationResult;
            this.evaluationRemark = evaluationRemark;
            this.creditReportUrl = creditReportUrl;
        }
        
        // Getters
        public Long getUserId() { return userId; }
        public Integer getCreditScore() { return creditScore; }
        public String getCreditLevel() { return creditLevel; }
        public String getScoreDetailJson() { return scoreDetailJson; }
        public String getDataSources() { return dataSources; }
        public Integer getEvaluationResult() { return evaluationResult; }
        public String getEvaluationRemark() { return evaluationRemark; }
        public String getCreditReportUrl() { return creditReportUrl; }
    }
}