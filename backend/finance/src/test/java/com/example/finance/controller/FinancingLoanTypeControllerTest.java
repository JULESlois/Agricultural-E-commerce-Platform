package com.example.finance.controller;

import com.example.finance.entity.FinancingLoanType;
import com.example.finance.service.FinancingLoanTypeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * FinancingLoanTypeController API接口测试
 */
@WebMvcTest(FinancingLoanTypeController.class)
public class FinancingLoanTypeControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private FinancingLoanTypeService loanTypeService;
    
    // ObjectMapper暂时不需要，如果后续需要可以取消注释
    // @Autowired
    // private ObjectMapper objectMapper;
    
    private FinancingLoanType mockLoanType;
    
    @BeforeEach
    void setUp() {
        mockLoanType = new FinancingLoanType();
        mockLoanType.setLoanTypeId(1);
        mockLoanType.setLoanTypeName("种植周转贷");
        mockLoanType.setLoanPurpose("用于小麦种植期间化肥、农药采购资金周转");
        mockLoanType.setMinLoanAmount(new BigDecimal("10000.00"));
        mockLoanType.setMaxLoanAmount(new BigDecimal("500000.00"));
        mockLoanType.setMinLoanTerm(3);
        mockLoanType.setMaxLoanTerm(12);
        mockLoanType.setLoanTermType(2);
        mockLoanType.setInterestRateType(1);
        mockLoanType.setMinInterestRate(new BigDecimal("0.0435"));
        mockLoanType.setMaxInterestRate(new BigDecimal("0.065"));
        mockLoanType.setRequiredMaterials("身份证,种植证明,银行流水");
        mockLoanType.setApplicableObjects("种植规模≥50亩的农户");
        mockLoanType.setSupportBanks("中国农业银行,中国邮政储蓄银行");
        mockLoanType.setStatus(1);
        mockLoanType.setSort(1);
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypesSuccess() throws Exception {
        // 测试成功获取贷款产品列表
        
        List<FinancingLoanType> mockLoanTypes = Arrays.asList(mockLoanType);
        when(loanTypeService.getAllActiveLoanTypes()).thenReturn(mockLoanTypes);
        
        mockMvc.perform(get("/api/financing/loan-types")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("查询成功"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].loanTypeId").value(1))
                .andExpect(jsonPath("$.data[0].loanTypeName").value("种植周转贷"))
                .andExpect(jsonPath("$.data[0].minLoanAmount").value(10000.00))
                .andExpect(jsonPath("$.data[0].maxLoanAmount").value(500000.00))
                .andExpect(jsonPath("$.data[0].minLoanTerm").value(3))
                .andExpect(jsonPath("$.data[0].maxLoanTerm").value(12));
        
        verify(loanTypeService).getAllActiveLoanTypes();
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypesEmpty() throws Exception {
        // 测试获取空的贷款产品列表
        
        when(loanTypeService.getAllActiveLoanTypes()).thenReturn(Collections.emptyList());
        
        mockMvc.perform(get("/api/financing/loan-types")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("查询成功"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
        
        verify(loanTypeService).getAllActiveLoanTypes();
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypesServiceException() throws Exception {
        // 测试服务层异常处理
        
        when(loanTypeService.getAllActiveLoanTypes()).thenThrow(new RuntimeException("数据库连接失败"));
        
        mockMvc.perform(get("/api/financing/loan-types")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("查询失败: 数据库连接失败"));
        
        verify(loanTypeService).getAllActiveLoanTypes();
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypeDetailSuccess() throws Exception {
        // 测试成功获取贷款产品详情
        
        when(loanTypeService.getLoanTypeById(1)).thenReturn(mockLoanType);
        
        mockMvc.perform(get("/api/financing/loan-types/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("查询成功"))
                .andExpect(jsonPath("$.data.loanTypeId").value(1))
                .andExpect(jsonPath("$.data.loanTypeName").value("种植周转贷"))
                .andExpect(jsonPath("$.data.loanPurpose").value("用于小麦种植期间化肥、农药采购资金周转"))
                .andExpect(jsonPath("$.data.requiredMaterials").value("身份证,种植证明,银行流水"))
                .andExpect(jsonPath("$.data.supportBanks").value("中国农业银行,中国邮政储蓄银行"));
        
        verify(loanTypeService).getLoanTypeById(1);
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypeDetailNotFound() throws Exception {
        // 测试获取不存在的贷款产品详情
        
        when(loanTypeService.getLoanTypeById(999)).thenReturn(null);
        
        mockMvc.perform(get("/api/financing/loan-types/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("贷款产品不存在"));
        
        verify(loanTypeService).getLoanTypeById(999);
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypeDetailServiceException() throws Exception {
        // 测试获取贷款产品详情时的服务异常
        
        when(loanTypeService.getLoanTypeById(1)).thenThrow(new RuntimeException("数据库查询失败"));
        
        mockMvc.perform(get("/api/financing/loan-types/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("查询失败: 数据库查询失败"));
        
        verify(loanTypeService).getLoanTypeById(1);
    }
    
    @Test
    @WithMockUser
    void testGetLoanTypeDetailInvalidId() throws Exception {
        // 测试无效的贷款产品ID
        
        mockMvc.perform(get("/api/financing/loan-types/invalid")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError()); // 全局异常处理器返回500
    }
    
    @Test
    @WithMockUser
    void testCorsHeaders() throws Exception {
        // 测试CORS头部设置
        
        when(loanTypeService.getAllActiveLoanTypes()).thenReturn(Arrays.asList(mockLoanType));
        
        mockMvc.perform(get("/api/financing/loan-types")
                .header("Origin", "http://localhost:3000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
    
    @Test
    @WithMockUser
    void testResponseFormat() throws Exception {
        // 测试响应格式的一致性
        
        when(loanTypeService.getAllActiveLoanTypes()).thenReturn(Arrays.asList(mockLoanType));
        
        mockMvc.perform(get("/api/financing/loan-types")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.code").isNumber())
                .andExpect(jsonPath("$.message").isString());
    }
}