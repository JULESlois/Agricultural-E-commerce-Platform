package com.example.finance.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class BankApprovalRequest {
    
    @NotNull(message = "审批结果不能为空")
    @Min(value = 1, message = "审批结果必须为1(通过)或2(驳回)")
    @Max(value = 2, message = "审批结果必须为1(通过)或2(驳回)")
    private Integer approvalResult;
    
    private BigDecimal approvalAmount; // 审批通过时必填
    
    private Integer approvalTerm; // 审批通过时必填
    
    private BigDecimal interestRate; // 审批通过时必填
    
    @Size(max = 100, message = "还款方式不能超过100字符")
    private String repaymentMethod; // 审批通过时必填
    
    @NotBlank(message = "审批意见不能为空")
    @Size(max = 500, message = "审批意见不能超过500字符")
    private String approvalRemark;
    
    @Size(max = 200, message = "贷款合同URL不能超过200字符")
    private String loanContractUrl; // 审批通过时可选
}