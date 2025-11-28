package com.example.finance.controller;

import com.example.finance.dto.ApiResponse;
import com.example.finance.dto.FinancingApplicationCreateRequest;
import com.example.finance.dto.FinancingApplicationResponse;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.service.FinancingApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer/financing")
public class FarmerFinancingController {
    
    @Autowired
    private FinancingApplicationService applicationService;
    
    /**
     * 创建融资申请
     */
    @PostMapping("/applications")
    public ApiResponse<Map<String, Object>> createApplication(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody FinancingApplicationCreateRequest request) {
        try {
            // TODO: 从token中解析用户ID，这里暂时使用模拟值
            Long userId = 1001L;
            
            FinancingApplication application = applicationService.createApplication(userId, request);
            
            Map<String, Object> result = new HashMap<>();
            result.put("application_id", application.getApplicationId());
            result.put("application_no", application.getApplicationNo());
            result.put("application_status", application.getApplicationStatus());
            
            return ApiResponse.created("申请已提交，等待平台信用评估", result);
        } catch (Exception e) {
            return ApiResponse.error("申请提交失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取我的融资申请列表
     */
    @GetMapping("/applications")
    public ApiResponse<List<FinancingApplicationResponse>> getMyApplications(
            @RequestHeader("Authorization") String token) {
        try {
            // TODO: 从token中解析用户ID，这里暂时使用模拟值
            Long userId = 1001L;
            
            List<FinancingApplicationResponse> applications = applicationService.getUserApplications(userId);
            return ApiResponse.success("查询成功", applications);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取融资申请详情
     */
    @GetMapping("/applications/{applicationId}")
    public ApiResponse<FinancingApplication> getApplicationDetail(
            @RequestHeader("Authorization") String token,
            @PathVariable Long applicationId) {
        try {
            // TODO: 验证用户权限
            FinancingApplication application = applicationService.getApplicationById(applicationId);
            if (application == null) {
                return ApiResponse.error(404, "申请不存在");
            }
            return ApiResponse.success("查询成功", application);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
}
