package com.example.finance.controller;

import com.example.finance.dto.ApiResponse;
import com.example.finance.service.FinancingCreditEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/internal/financing")
public class InternalFinancingController {

    @Autowired
    private FinancingCreditEvaluationService creditEvaluationService;

    /**
     * 触发信用评估
     */
    @PostMapping("/applications/{applicationId}/evaluate")
    public ApiResponse<Void> triggerCreditEvaluation(@PathVariable Long applicationId) {
        try {
            creditEvaluationService.triggerCreditEvaluation(applicationId);
            return ApiResponse.success("信用评估任务已启动", null);
        } catch (Exception e) {
            return ApiResponse.error("信用评估启动失败: " + e.getMessage());
        }
    }

    /**
     * 接收评估结果
     */
    @PostMapping("/credit-evaluations")
    public ApiResponse<Void> receiveCreditEvaluationResult(@RequestBody Map<String, Object> evaluationData) {
        try {
            // TODO: 解析评估数据并保存
            // 这里应该解析外部信用评估系统返回的结果
            return ApiResponse.success("评估结果已记录，申请状态已更新为待银行审批", null);
        } catch (Exception e) {
            return ApiResponse.error("评估结果处理失败: " + e.getMessage());
        }
    }
}
