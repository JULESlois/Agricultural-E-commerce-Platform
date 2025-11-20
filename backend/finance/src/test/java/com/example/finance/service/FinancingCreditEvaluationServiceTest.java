package com.example.finance.service;

import com.example.finance.entity.FinancingCreditEvaluation;
import com.example.finance.repository.FinancingCreditEvaluationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * 信用评估服务测试
 */
@ExtendWith(MockitoExtension.class)
class FinancingCreditEvaluationServiceTest {

    @Mock
    private FinancingCreditEvaluationRepository creditEvaluationRepository;

    @Mock
    private FinancingApplicationService applicationService;

    @InjectMocks
    private FinancingCreditEvaluationService creditEvaluationService;

    private FinancingCreditEvaluation creditEvaluation;

    @BeforeEach
    void setUp() {
        creditEvaluation = new FinancingCreditEvaluation();
        creditEvaluation.setEvaluationId(1L);
        creditEvaluation.setApplicationId(100L);
        creditEvaluation.setUserId(1L);
        creditEvaluation.setCreditScore(85);
        creditEvaluation.setCreditLevel("A级");
        creditEvaluation.setEvaluationResult(1);
    }

    @Test
    void testTriggerCreditEvaluation_Success() {
        // Given
        when(creditEvaluationRepository.findByApplicationId(anyLong())).thenReturn(null);
        when(creditEvaluationRepository.save(any(FinancingCreditEvaluation.class))).thenReturn(creditEvaluation);

        // When
        creditEvaluationService.triggerCreditEvaluation(100L);

        // Then
        verify(creditEvaluationRepository).save(any(FinancingCreditEvaluation.class));
        verify(applicationService).updateApplicationStatus(eq(100L), anyInt());
    }

    @Test
    void testTriggerCreditEvaluation_AlreadyEvaluated() {
        // Given
        when(creditEvaluationRepository.findByApplicationId(anyLong())).thenReturn(creditEvaluation);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            creditEvaluationService.triggerCreditEvaluation(100L);
        });
        assertEquals("该申请已经进行过信用评估", exception.getMessage());
    }

    @Test
    void testGetCreditEvaluationByApplicationId() {
        // Given
        when(creditEvaluationRepository.findByApplicationId(anyLong())).thenReturn(creditEvaluation);

        // When
        FinancingCreditEvaluation result = creditEvaluationService.getCreditEvaluationByApplicationId(100L);

        // Then
        assertNotNull(result);
        assertEquals(100L, result.getApplicationId());
        assertEquals(85, result.getCreditScore());
        assertEquals("A级", result.getCreditLevel());
        verify(creditEvaluationRepository).findByApplicationId(100L);
    }

    @Test
    void testGetCreditEvaluationByApplicationId_NotFound() {
        // Given
        when(creditEvaluationRepository.findByApplicationId(anyLong())).thenReturn(null);

        // When
        FinancingCreditEvaluation result = creditEvaluationService.getCreditEvaluationByApplicationId(999L);

        // Then
        assertNull(result);
    }

    @Test
    void testCreditEvaluationScoreRange() {
        // Given
        when(creditEvaluationRepository.findByApplicationId(anyLong())).thenReturn(null);
        when(creditEvaluationRepository.save(any(FinancingCreditEvaluation.class))).thenAnswer(invocation -> {
            FinancingCreditEvaluation saved = invocation.getArgument(0);
            // 验证评分在合理范围内
            assertTrue(saved.getCreditScore() >= 45 && saved.getCreditScore() <= 100,
                "信用评分应该在45-100之间");
            return saved;
        });

        // When
        creditEvaluationService.triggerCreditEvaluation(100L);

        // Then
        verify(creditEvaluationRepository).save(any(FinancingCreditEvaluation.class));
    }
}
