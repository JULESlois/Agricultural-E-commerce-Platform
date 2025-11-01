package com.example.finance.service;

import com.example.finance.dto.FinancingApplicationCreateRequest;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.entity.FinancingLoanType;
import com.example.finance.repository.FinancingApplicationRepository;
import com.example.finance.repository.FinancingLoanTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * FinancingApplicationService业务逻辑单元测试
 */
@ExtendWith(MockitoExtension.class)
public class FinancingApplicationServiceTest {
    
    @Mock
    private FinancingApplicationRepository applicationRepository;
    
    @Mock
    private FinancingLoanTypeRepository loanTypeRepository;
    
    @InjectMocks
    private FinancingApplicationService applicationService;
    
    private FinancingLoanType mockLoanType;
    private FinancingApplicationCreateRequest mockRequest;
    private FinancingApplication mockApplication;
    
    @BeforeEach
    void setUp() {
        // 准备测试数据
        mockLoanType = new FinancingLoanType();
        mockLoanType.setLoanTypeId(1);
        mockLoanType.setLoanTypeName("种植周转贷");
        mockLoanType.setMinLoanAmount(new BigDecimal("10000"));
        mockLoanType.setMaxLoanAmount(new BigDecimal("500000"));
        mockLoanType.setMinLoanTerm(3);
        mockLoanType.setMaxLoanTerm(12);
        mockLoanType.setLoanTermType(2);
        
        mockRequest = new FinancingApplicationCreateRequest();
        mockRequest.setLoanTypeId(1);
        mockRequest.setApplyAmount(new BigDecimal("100000"));
        mockRequest.setApplyTerm(6);
        mockRequest.setLoanPurposeDetail("用于2025年冬小麦种植");
        mockRequest.setRepaymentPlan("预计2026年5月收获后还款");
        mockRequest.setBankId(101);
        mockRequest.setMaterialUrls(Arrays.asList("https://example.com/id_card.jpg"));
        
        mockApplication = new FinancingApplication();
        mockApplication.setApplicationId(1L);
        mockApplication.setApplicationNo("FIN2025102712345678");
        mockApplication.setUserId(1001L);
        mockApplication.setLoanTypeId(1);
        mockApplication.setApplyAmount(new BigDecimal("100000"));
        mockApplication.setApplicationStatus(1);
    }
    
    @Test
    void testCreateApplicationSuccess() {
        // 测试成功创建融资申请
        
        // Mock依赖调用
        when(loanTypeRepository.findByLoanTypeIdAndStatus(1, 1)).thenReturn(mockLoanType);
        when(applicationRepository.save(any(FinancingApplication.class))).thenReturn(mockApplication);
        
        // 执行测试
        FinancingApplication result = applicationService.createApplication(1001L, mockRequest);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1L, result.getApplicationId());
        assertEquals("FIN2025102712345678", result.getApplicationNo());
        assertEquals(1001L, result.getUserId());
        assertEquals(1, result.getApplicationStatus());
        
        // 验证方法调用
        verify(loanTypeRepository).findByLoanTypeIdAndStatus(1, 1);
        verify(applicationRepository).save(any(FinancingApplication.class));
    }
    
    @Test
    void testCreateApplicationWithInvalidLoanType() {
        // 测试无效贷款类型的处理
        
        // Mock返回null，表示贷款类型不存在
        when(loanTypeRepository.findByLoanTypeIdAndStatus(1, 1)).thenReturn(null);
        
        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            applicationService.createApplication(1001L, mockRequest);
        });
        
        assertEquals("贷款类型不存在或已停用", exception.getMessage());
        
        // 验证repository方法被调用
        verify(loanTypeRepository).findByLoanTypeIdAndStatus(1, 1);
        // 验证save方法没有被调用
        verify(applicationRepository, never()).save(any(FinancingApplication.class));
    }
    
    @Test
    void testCreateApplicationWithAmountOutOfRange() {
        // 测试申请金额超出范围的处理
        
        // 设置超出范围的金额
        mockRequest.setApplyAmount(new BigDecimal("600000")); // 超过最大值500000
        
        when(loanTypeRepository.findByLoanTypeIdAndStatus(1, 1)).thenReturn(mockLoanType);
        
        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            applicationService.createApplication(1001L, mockRequest);
        });
        
        assertEquals("申请金额超出允许范围", exception.getMessage());
        
        // 验证save方法没有被调用
        verify(applicationRepository, never()).save(any(FinancingApplication.class));
    }
    
    @Test
    void testCreateApplicationWithTermOutOfRange() {
        // 测试申请期限超出范围的处理
        
        // 设置超出范围的期限
        mockRequest.setApplyTerm(24); // 超过最大值12
        
        when(loanTypeRepository.findByLoanTypeIdAndStatus(1, 1)).thenReturn(mockLoanType);
        
        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            applicationService.createApplication(1001L, mockRequest);
        });
        
        assertEquals("申请期限超出允许范围", exception.getMessage());
        
        // 验证save方法没有被调用
        verify(applicationRepository, never()).save(any(FinancingApplication.class));
    }
    
    @Test
    void testGetUserApplications() {
        // 测试获取用户申请列表
        
        List<FinancingApplication> mockApplications = Arrays.asList(mockApplication);
        
        when(applicationRepository.findByUserIdOrderByCreateTimeDesc(1001L)).thenReturn(mockApplications);
        when(loanTypeRepository.findById(1)).thenReturn(Optional.of(mockLoanType));
        
        // 执行测试
        var result = applicationService.getUserApplications(1001L);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("FIN2025102712345678", result.get(0).getApplicationNo());
        assertEquals("种植周转贷", result.get(0).getLoanTypeName());
        
        // 验证方法调用
        verify(applicationRepository).findByUserIdOrderByCreateTimeDesc(1001L);
        verify(loanTypeRepository).findById(1);
    }
    
    @Test
    void testGetApplicationsByBankAndStatus() {
        // 测试根据银行和状态获取申请列表
        
        List<FinancingApplication> mockApplications = Arrays.asList(mockApplication);
        
        when(applicationRepository.findByBankIdAndStatus(101, 2)).thenReturn(mockApplications);
        
        // 执行测试
        List<FinancingApplication> result = applicationService.getApplicationsByBankAndStatus(101, 2);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockApplication, result.get(0));
        
        // 验证方法调用
        verify(applicationRepository).findByBankIdAndStatus(101, 2);
    }
    
    @Test
    void testGetApplicationById() {
        // 测试根据ID获取申请详情
        
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(mockApplication));
        
        // 执行测试
        FinancingApplication result = applicationService.getApplicationById(1L);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(mockApplication, result);
        
        // 验证方法调用
        verify(applicationRepository).findById(1L);
    }
    
    @Test
    void testGetApplicationByIdNotFound() {
        // 测试获取不存在的申请
        
        when(applicationRepository.findById(999L)).thenReturn(Optional.empty());
        
        // 执行测试
        FinancingApplication result = applicationService.getApplicationById(999L);
        
        // 验证结果
        assertNull(result);
        
        // 验证方法调用
        verify(applicationRepository).findById(999L);
    }
    
    @Test
    void testUpdateApplicationStatus() {
        // 测试更新申请状态
        
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(mockApplication));
        when(applicationRepository.save(any(FinancingApplication.class))).thenReturn(mockApplication);
        
        // 执行测试
        applicationService.updateApplicationStatus(1L, 3);
        
        // 验证状态更新
        assertEquals(3, mockApplication.getApplicationStatus());
        
        // 验证方法调用
        verify(applicationRepository).findById(1L);
        verify(applicationRepository).save(mockApplication);
    }
    
    @Test
    void testUpdateApplicationStatusNotFound() {
        // 测试更新不存在申请的状态
        
        when(applicationRepository.findById(999L)).thenReturn(Optional.empty());
        
        // 执行测试（不应该抛出异常）
        applicationService.updateApplicationStatus(999L, 3);
        
        // 验证方法调用
        verify(applicationRepository).findById(999L);
        verify(applicationRepository, never()).save(any(FinancingApplication.class));
    }
    
    @Test
    void testGenerateApplicationNo() {
        // 测试申请编号生成（通过创建申请间接测试）
        
        when(loanTypeRepository.findByLoanTypeIdAndStatus(1, 1)).thenReturn(mockLoanType);
        when(applicationRepository.save(any(FinancingApplication.class))).thenAnswer(invocation -> {
            FinancingApplication app = invocation.getArgument(0);
            app.setApplicationId(1L);
            return app;
        });
        
        // 执行测试
        FinancingApplication result = applicationService.createApplication(1001L, mockRequest);
        
        // 验证申请编号格式
        assertNotNull(result.getApplicationNo());
        assertTrue(result.getApplicationNo().startsWith("FIN"));
        assertEquals(19, result.getApplicationNo().length()); // FIN + 8位日期 + 8位随机数
    }
}