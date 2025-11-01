package com.example.finance.controller;

import com.example.finance.dto.ApiResponse;
import com.example.finance.entity.FinancingLoanType;
import com.example.finance.service.FinancingLoanTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financing")
@CrossOrigin(origins = "*")
public class FinancingLoanTypeController {
    
    @Autowired
    private FinancingLoanTypeService loanTypeService;
    
    /**
     * 获取贷款产品列表
     */
    @GetMapping("/loan-types")
    public ApiResponse<List<FinancingLoanType>> getLoanTypes() {
        try {
            List<FinancingLoanType> loanTypes = loanTypeService.getAllActiveLoanTypes();
            return ApiResponse.success("查询成功", loanTypes);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取贷款产品详情
     */
    @GetMapping("/loan-types/{loanTypeId}")
    public ApiResponse<FinancingLoanType> getLoanTypeDetail(@PathVariable Integer loanTypeId) {
        try {
            FinancingLoanType loanType = loanTypeService.getLoanTypeById(loanTypeId);
            if (loanType == null) {
                return ApiResponse.error(404, "贷款产品不存在");
            }
            return ApiResponse.success("查询成功", loanType);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
}