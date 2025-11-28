package com.example.finance.controller;

import com.example.finance.dto.ApiResponse;
import com.example.finance.dto.BankApprovalRequest;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.entity.FinancingCreditEvaluation;
import com.example.finance.service.FinancingApplicationService;
import com.example.finance.service.FinancingBankApprovalService;
import com.example.finance.service.FinancingCreditEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank/financing")
public class BankFinancingController {
    
    @Autowired
    private FinancingApplicationService applicationService;
    
    @Autowired
    private FinancingBankApprovalService bankApprovalService;
    
    @Autowired
    private FinancingCreditEvaluationService creditEvaluationService;
    
    /**
     * 获取待审批的申请列表
     */
    @GetMapping("/applications")
    public ApiResponse<List<FinancingApplication>> getPendingApplications(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "2") Integer status) {
        try {
            // TODO: 从token中解析银行ID，这里暂时使用模拟值
            Integer bankId = 101;
            
            List<FinancingApplication> applications = applicationService.getApplicationsByBankAndStatus(bankId, status);
            return ApiResponse.success("查询成功", applications);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取申请详情以供审批
     */
    @GetMapping("/applications/{applicationId}")
    public ApiResponse<Map<String, Object>> getApplicationForReview(
            @RequestHeader("Authorization") String token,
            @PathVariable Long applicationId) {
        try {
            FinancingApplication application = applicationService.getApplicationById(applicationId);
            if (application == null) {
                return ApiResponse.error(404, "申请不存在");
            }
            
            // 获取信用评估结果
            FinancingCreditEvaluation creditEvaluation = creditEvaluationService.getCreditEvaluationByApplicationId(applicationId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("application_info", application);
            result.put("credit_evaluation", creditEvaluation);
            // TODO: 添加用户基础信息
            
            return ApiResponse.success("查询成功", result);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
    
    /**
     * 提交审批结论
     */
    @PostMapping("/applications/{applicationId}/review")
    public ApiResponse<Void> submitApprovalResult(
            @RequestHeader("Authorization") String token,
            @PathVariable Long applicationId,
            @Valid @RequestBody BankApprovalRequest request) {
        try {
            // TODO: 从token中解析银行用户信息，这里暂时使用模拟值
            Integer bankId = 101;
            Long approverId = 3001L;
            String approverName = "张审批员";
            
            bankApprovalService.submitBankApproval(applicationId, bankId, approverId, approverName, request);
            
            String message = request.getApprovalResult() == 1 ? 
                "审批结论已提交，申请状态已更新为审批通过" : 
                "审批结论已提交，申请状态已更新为审批驳回";
            
            return ApiResponse.success(message, null);
        } catch (Exception e) {
            return ApiResponse.error("审批提交失败: " + e.getMessage());
        }
    }
    
    /**
     * 确认放款
     */
    @PostMapping("/applications/{applicationId}/disburse")
    public ApiResponse<Void> confirmLoanDisburse(
            @RequestHeader("Authorization") String token,
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request) {
        try {
            LocalDateTime loanTime = LocalDateTime.parse(request.get("loan_time"));
            bankApprovalService.confirmLoanDisburse(applicationId, loanTime);
            return ApiResponse.success("放款状态更新成功", null);
        } catch (Exception e) {
            return ApiResponse.error("放款确认失败: " + e.getMessage());
        }
    }
}
