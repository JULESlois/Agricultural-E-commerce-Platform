package com.example.finance.service;

import com.example.finance.dto.PresalePlanCreateRequest;
import com.example.finance.dto.PresaleSubscriptionRequest;
import com.example.finance.entity.FinancingPresalePlan;
import com.example.finance.entity.FinancingPresaleSubscription;
import com.example.finance.repository.FinancingPresalePlanRepository;
import com.example.finance.repository.FinancingPresaleSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class FinancingPresaleService {
    
    @Autowired
    private FinancingPresalePlanRepository presalePlanRepository;
    
    @Autowired
    private FinancingPresaleSubscriptionRepository subscriptionRepository;
    
    /**
     * 创建预售计划
     */
    @Transactional
    public FinancingPresalePlan createPresalePlan(Long userId, PresalePlanCreateRequest request) {
        // 验证日期逻辑
        if (request.getExpectedHarvestDate().isBefore(request.getPlantDate())) {
            throw new RuntimeException("收获日期不能早于种植日期");
        }
        
        FinancingPresalePlan plan = new FinancingPresalePlan();
        plan.setPlanNo(generatePlanNo());
        plan.setUserId(userId);
        plan.setCategoryId(request.getCategoryId());
        plan.setProductName(request.getProductName());
        plan.setPlantDate(request.getPlantDate());
        plan.setExpectedHarvestDate(request.getExpectedHarvestDate());
        plan.setTotalYieldQuantity(request.getTotalYieldQuantity());
        plan.setPresaleUnitPrice(request.getPresaleUnitPrice());
        plan.setDepositRatio(request.getDepositRatio());
        plan.setPlanStatus(1); // 待审核
        
        return presalePlanRepository.save(plan);
    }
    
    /**
     * 获取正在预售中的计划列表
     */
    public List<FinancingPresalePlan> getActivePresalePlans() {
        return presalePlanRepository.findActivePresalePlans();
    }
    
    /**
     * 预售农产品下单
     */
    @Transactional
    public FinancingPresaleSubscription createSubscription(Long userId, PresaleSubscriptionRequest request) {
        // 验证预售计划
        FinancingPresalePlan plan = presalePlanRepository.findById(request.getPlanId()).orElse(null);
        if (plan == null) {
            throw new RuntimeException("预售计划不存在");
        }
        
        if (plan.getPlanStatus() != 2) {
            throw new RuntimeException("该预售计划当前不可认购");
        }
        
        // 检查剩余数量
        BigDecimal subscribedQuantity = subscriptionRepository.calculateTotalSubscribedQuantity(request.getPlanId());
        BigDecimal remainingQuantity = plan.getTotalYieldQuantity().subtract(subscribedQuantity);
        
        if (request.getSubscribedQuantity().compareTo(remainingQuantity) > 0) {
            throw new RuntimeException("认购数量超过剩余可认购数量");
        }
        
        // 计算定金金额
        BigDecimal depositAmount = request.getSubscribedQuantity()
            .multiply(plan.getPresaleUnitPrice())
            .multiply(plan.getDepositRatio());
        
        // 创建认购记录
        FinancingPresaleSubscription subscription = new FinancingPresaleSubscription();
        subscription.setSubscriptionNo(generateSubscriptionNo());
        subscription.setPlanId(request.getPlanId());
        subscription.setUserId(userId);
        subscription.setSubscribedQuantity(request.getSubscribedQuantity());
        subscription.setDepositAmount(depositAmount);
        subscription.setPaymentStatus(0); // 待支付
        subscription.setSubscriptionStatus(1); // 有效
        
        return subscriptionRepository.save(subscription);
    }
    
    /**
     * 获取用户的认购记录
     */
    public List<FinancingPresaleSubscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserIdOrderByCreateTimeDesc(userId);
    }
    
    /**
     * 获取预售计划的认购记录
     */
    public List<FinancingPresaleSubscription> getPlanSubscriptions(Long planId) {
        return subscriptionRepository.findByPlanIdOrderByCreateTimeDesc(planId);
    }
    
    /**
     * 计算预售进度
     */
    public String calculatePresaleProgress(Long planId) {
        FinancingPresalePlan plan = presalePlanRepository.findById(planId).orElse(null);
        if (plan == null) {
            return "0%";
        }
        
        BigDecimal subscribedQuantity = subscriptionRepository.calculateTotalSubscribedQuantity(planId);
        BigDecimal progress = subscribedQuantity.divide(plan.getTotalYieldQuantity(), 4, BigDecimal.ROUND_HALF_UP)
            .multiply(new BigDecimal("100"));
        
        return progress.intValue() + "%";
    }
    
    /**
     * 生成预售计划编号
     */
    private String generatePlanNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = String.format("%08d", new Random().nextInt(100000000));
        return "PRE" + dateStr + randomStr;
    }
    
    /**
     * 生成认购编号
     */
    private String generateSubscriptionNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = String.format("%08d", new Random().nextInt(100000000));
        return "SUB" + dateStr + randomStr;
    }
}