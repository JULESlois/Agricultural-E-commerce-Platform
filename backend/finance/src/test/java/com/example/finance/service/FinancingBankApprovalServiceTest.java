package com.example.finance.service;

import com.example.finance.dto.BankApprovalRequest;
import com.example.finance.entity.FinancingBankApproval;
import com.example.finance.repository.FinancingBankApprovalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * 银行审批服务测试
 */
@ExtendWith(MockitoExtension.class)
class FinancingBankApprovalServiceTest {

    @Mock
    private FinancingBankApprovalRepository bankApprovalRepository;

    @Mock
    private FinancingApplicationService applicationService;

    @InjectMocks
    private FinancingBankApprovalService bankApprovalService;

    private BankApprovalRequest approvalRequest;
    private FinancingBankApproval bankApproval;

    @BeforeEach
    void setUp() {
        // 准备审批通过的请求
        approvalRequest = new BankApprovalRequest();
        approvalRequest.setApprovalResult(1);
        approvalRequest.setApprovalAmount(new BigDecimal("80000.00"));
        approvalRequest.setApprovalTerm(6);
        approvalRequest.setInterestRate(new BigDecimal("0.052"));
        approvalRequest.setRepaymentMethod("按月付息，到期还本");
        approvalRequest.setApprovalRemark("信用良好，同意放款");
        approvalRequest.setLoanContractUrl("https://example.com/contract.pdf");

        // 准备审批记录
        bankApproval = new FinancingBankApproval();
        bankApproval.setApprovalId(1L);
        bankApproval.setApplicationId(100L);
        bankApproval.setBankId(101);
        bankApproval.setApprovalResult(1);
        bankApproval.setApprovalAmount(new BigDecimal("80000.00"));
    }

    @Test
    void testSubmitBankApproval_Success() {
        // Given
        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(null);
        when(bankApprovalRepository.save(any(FinancingBankApproval.class))).thenReturn(bankApproval);

        // When
        bankApprovalService.submitBankApproval(100L, 101, 1L, "张审批", approvalRequest);

        // Then
        verify(bankApprovalRepository).save(any(FinancingBankApproval.class));
        verify(applicationService).updateApplicationStatus(100L, 3);
    }

    @Test
    void testSubmitBankApproval_Reject() {
        // Given
        BankApprovalRequest rejectRequest = new BankApprovalRequest();
        rejectRequest.setApprovalResult(2);
        rejectRequest.setApprovalRemark("资料不全，驳回申请");

        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(null);

        // When
        bankApprovalService.submitBankApproval(100L, 101, 1L, "张审批", rejectRequest);

        // Then
        verify(bankApprovalRepository).save(any(FinancingBankApproval.class));
        verify(applicationService).updateApplicationStatus(100L, 4);
    }

    @Test
    void testSubmitBankApproval_MissingRequiredFields() {
        // Given
        BankApprovalRequest invalidRequest = new BankApprovalRequest();
        invalidRequest.setApprovalResult(1);
        // 缺少必填字段

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            bankApprovalService.submitBankApproval(100L, 101, 1L, "张审批", invalidRequest);
        });
    }

    @Test
    void testSubmitBankApproval_AlreadyApproved() {
        // Given
        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(bankApproval);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bankApprovalService.submitBankApproval(100L, 101, 1L, "张审批", approvalRequest);
        });
        assertEquals("该申请已经审批过", exception.getMessage());
    }

    @Test
    void testConfirmLoanDisburse_Success() {
        // Given
        LocalDateTime loanTime = LocalDateTime.now();
        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(bankApproval);
        when(bankApprovalRepository.save(any(FinancingBankApproval.class))).thenReturn(bankApproval);

        // When
        bankApprovalService.confirmLoanDisburse(100L, loanTime);

        // Then
        verify(bankApprovalRepository).save(any(FinancingBankApproval.class));
        verify(applicationService).updateApplicationStatus(100L, 5);
    }

    @Test
    void testConfirmLoanDisburse_NoApprovalRecord() {
        // Given
        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(null);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bankApprovalService.confirmLoanDisburse(100L, LocalDateTime.now());
        });
        assertEquals("未找到审批记录", exception.getMessage());
    }

    @Test
    void testConfirmLoanDisburse_NotApproved() {
        // Given
        bankApproval.setApprovalResult(2); // 驳回
        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(bankApproval);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bankApprovalService.confirmLoanDisburse(100L, LocalDateTime.now());
        });
        assertEquals("只有审批通过的申请才能放款", exception.getMessage());
    }

    @Test
    void testGetApprovalByApplicationId() {
        // Given
        when(bankApprovalRepository.findByApplicationId(anyLong())).thenReturn(bankApproval);

        // When
        FinancingBankApproval result = bankApprovalService.getApprovalByApplicationId(100L);

        // Then
        assertNotNull(result);
        assertEquals(100L, result.getApplicationId());
        verify(bankApprovalRepository).findByApplicationId(100L);
    }

    @Test
    void testGetApprovalsByBankId() {
        // Given
        List<FinancingBankApproval> approvals = Arrays.asList(bankApproval);
        when(bankApprovalRepository.findByBankIdOrderByApprovalTimeDesc(anyInt())).thenReturn(approvals);

        // When
        List<FinancingBankApproval> result = bankApprovalService.getApprovalsByBankId(101);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(bankApprovalRepository).findByBankIdOrderByApprovalTimeDesc(101);
    }
}
