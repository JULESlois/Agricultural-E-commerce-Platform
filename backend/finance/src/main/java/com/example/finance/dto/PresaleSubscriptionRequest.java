package com.example.finance.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class PresaleSubscriptionRequest {
    
    @NotNull(message = "预售计划ID不能为空")
    private Long planId;
    
    @NotNull(message = "认购数量不能为空")
    @DecimalMin(value = "0.01", message = "认购数量必须大于0")
    private BigDecimal subscribedQuantity;
}