package com.example.finance.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

@Data
public class FinancingApplicationCreateRequest {
    
    @NotNull(message = "贷款类型ID不能为空")
    private Integer loanTypeId;
    
    @NotNull(message = "申请金额不能为空")
    @DecimalMin(value = "0.01", message = "申请金额必须大于0")
    private BigDecimal applyAmount;
    
    @NotNull(message = "申请期限不能为空")
    @Min(value = 1, message = "申请期限必须大于0")
    private Integer applyTerm;
    
    @NotBlank(message = "贷款用途详情不能为空")
    @Size(max = 500, message = "贷款用途详情不能超过500字符")
    private String loanPurposeDetail;
    
    @NotBlank(message = "还款计划不能为空")
    @Size(max = 500, message = "还款计划不能超过500字符")
    private String repaymentPlan;
    
    @NotNull(message = "银行ID不能为空")
    private Integer bankId;
    
    private Long sourceId; // 可选，关联货源
    
    @NotEmpty(message = "材料URL不能为空")
    private List<String> materialUrls;
}