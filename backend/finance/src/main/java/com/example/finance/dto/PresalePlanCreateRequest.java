package com.example.finance.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PresalePlanCreateRequest {
    
    @NotNull(message = "品类ID不能为空")
    private Integer categoryId;
    
    @NotBlank(message = "产品名称不能为空")
    @Size(max = 100, message = "产品名称不能超过100字符")
    private String productName;
    
    @NotNull(message = "种植日期不能为空")
    private LocalDate plantDate;
    
    @NotNull(message = "预计收获日期不能为空")
    private LocalDate expectedHarvestDate;
    
    @NotNull(message = "预计总产量不能为空")
    @DecimalMin(value = "0.01", message = "预计总产量必须大于0")
    private BigDecimal totalYieldQuantity;
    
    @NotNull(message = "预售单价不能为空")
    @DecimalMin(value = "0.01", message = "预售单价必须大于0")
    private BigDecimal presaleUnitPrice;
    
    @NotNull(message = "定金比例不能为空")
    @DecimalMin(value = "0.01", message = "定金比例必须大于0")
    @DecimalMax(value = "1.00", message = "定金比例不能超过100%")
    private BigDecimal depositRatio;
}