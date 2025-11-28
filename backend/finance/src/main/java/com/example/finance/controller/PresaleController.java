package com.example.finance.controller;

import com.example.finance.dto.ApiResponse;
import com.example.finance.dto.PresalePlanCreateRequest;
import com.example.finance.dto.PresaleSubscriptionRequest;
import com.example.finance.entity.FinancingPresalePlan;
import com.example.finance.entity.FinancingPresaleSubscription;
import com.example.finance.service.FinancingPresaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PresaleController {
    
    @Autowired
    private FinancingPresaleService presaleService;
    
    /**
     * 创建农产品预售计划
     */
    @PostMapping("/farmer/presale-plans")
    public ApiResponse<Map<String, Object>> createPresalePlan(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PresalePlanCreateRequest request) {
        try {
            // TODO: 从token中解析用户ID，这里暂时使用模拟值
            Long userId = 1001L;
            
            FinancingPresalePlan plan = presaleService.createPresalePlan(userId, request);
            
            Map<String, Object> result = new HashMap<>();
            result.put("plan_id", plan.getPlanId());
            
            return ApiResponse.created("预售计划已提交，等待平台审核", result);
        } catch (Exception e) {
            return ApiResponse.error("预售计划创建失败: " + e.getMessage());
        }
    }
    
    /**
     * 查看预售农产品
     */
    @GetMapping("/presale-plans")
    public ApiResponse<List<Map<String, Object>>> getPresalePlans() {
        try {
            List<FinancingPresalePlan> plans = presaleService.getActivePresalePlans();
            
            List<Map<String, Object>> result = plans.stream().map(plan -> {
                Map<String, Object> planData = new HashMap<>();
                planData.put("plan_id", plan.getPlanId());
                planData.put("product_name", plan.getProductName());
                planData.put("presale_unit_price", plan.getPresaleUnitPrice());
                planData.put("deposit_ratio", plan.getDepositRatio());
                planData.put("progress", presaleService.calculatePresaleProgress(plan.getPlanId()));
                return planData;
            }).toList();
            
            return ApiResponse.success("查询成功", result);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
    
    /**
     * 预售农产品下单
     */
    @PostMapping("/buyer/presale-subscriptions")
    public ApiResponse<Map<String, Object>> createSubscription(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PresaleSubscriptionRequest request) {
        try {
            // TODO: 从token中解析用户ID，这里暂时使用模拟值
            Long userId = 2001L;
            
            FinancingPresaleSubscription subscription = presaleService.createSubscription(userId, request);
            
            Map<String, Object> result = new HashMap<>();
            result.put("subscription_id", subscription.getSubscriptionId());
            result.put("deposit_amount", subscription.getDepositAmount());
            // TODO: 添加支付信息
            Map<String, String> paymentInfo = new HashMap<>();
            paymentInfo.put("payment_method", "online");
            paymentInfo.put("payment_url", "https://pay.example.com/pay/" + subscription.getSubscriptionNo());
            result.put("payment_info", paymentInfo);
            
            return ApiResponse.created("认购成功，请支付定金", result);
        } catch (Exception e) {
            return ApiResponse.error("认购失败: " + e.getMessage());
        }
    }
}
