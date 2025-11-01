package com.example.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FinancingApplicationResponse {
    private Long applicationId;
    private String applicationNo;
    private String loanTypeName;
    private BigDecimal applyAmount;
    private Integer applyTerm;
    private Integer applicationStatus;
    private String applicationStatusName;
    private LocalDateTime createTime;
    
    // 构造方法
    public FinancingApplicationResponse(Long applicationId, String applicationNo, 
                                     String loanTypeName, BigDecimal applyAmount, 
                                     Integer applyTerm, Integer applicationStatus, 
                                     LocalDateTime createTime) {
        this.applicationId = applicationId;
        this.applicationNo = applicationNo;
        this.loanTypeName = loanTypeName;
        this.applyAmount = applyAmount;
        this.applyTerm = applyTerm;
        this.applicationStatus = applicationStatus;
        this.createTime = createTime;
        this.applicationStatusName = getStatusName(applicationStatus);
    }
    
    private String getStatusName(Integer status) {
        switch (status) {
            case 0: return "待提交";
            case 1: return "待信用评估";
            case 2: return "待银行审批";
            case 3: return "审批通过";
            case 4: return "审批驳回";
            case 5: return "已放款";
            case 6: return "已取消";
            default: return "未知状态";
        }
    }
}