package com.example.finance.integration;

import com.example.finance.dto.FinancingApplicationCreateRequest;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.entity.FinancingLoanType;
import com.example.finance.repository.FinancingApplicationRepository;
import com.example.finance.repository.FinancingLoanTypeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Map;

/**
 * 融资申请业务流程集成测试
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class FinancingApplicationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FinancingApplicationRepository applicationRepository;

    @Autowired
    private FinancingLoanTypeRepository loanTypeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private FinancingLoanType testLoanType;

    @BeforeEach
    void setUp() {
        // 清理测试数据
        applicationRepository.deleteAll();
        loanTypeRepository.deleteAll();

        // 创建测试贷款类型
        testLoanType = new FinancingLoanType();
        testLoanType.setLoanTypeName("测试种植周转贷");
        testLoanType.setLoanPurpose("用于测试的贷款类型");
        testLoanType.setMinLoanAmount(new BigDecimal("10000"));
        testLoanType.setMaxLoanAmount(new BigDecimal("500000"));
        testLoanType.setMinLoanTerm(3);
        testLoanType.setMaxLoanTerm(12);
        testLoanType.setLoanTermType(2);
        testLoanType.setInterestRateType(1);
        testLoanType.setMinInterestRate(new BigDecimal("0.0435"));
        testLoanType.setMaxInterestRate(new BigDecimal("0.065"));
        testLoanType.setRequiredMaterials("身份证,种植证明,银行流水");
        testLoanType.setApplicableObjects("测试农户");
        testLoanType.setSupportBanks("测试银行");
        testLoanType.setStatus(1);
        testLoanType.setSort(1);

        testLoanType = loanTypeRepository.save(testLoanType);
    }

    @Test
    @WithMockUser(roles = "FARMER")
    void testCompleteApplicationFlow() throws Exception {
        // 测试完整的申请流程：创建申请 -> 查询申请 -> 更新状态

        // 1. 创建融资申请
        FinancingApplicationCreateRequest request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(testLoanType.getLoanTypeId());
        request.setApplyAmount(new BigDecimal("100000"));
        request.setApplyTerm(6);
        request.setLoanPurposeDetail("用于2025年冬小麦种植测试");
        request.setRepaymentPlan("预计2026年5月收获后还款测试");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/test_id_card.jpg"));

        String requestJson = objectMapper.writeValueAsString(request);

        String responseContent = mockMvc.perform(post("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.message").value("申请已提交，等待平台信用评估"))
                .andExpect(jsonPath("$.data.application_id").exists())
                .andExpect(jsonPath("$.data.application_no").exists())
                .andExpect(jsonPath("$.data.application_status").value(1))
                .andReturn().getResponse().getContentAsString();

        // 解析响应获取申请ID
        @SuppressWarnings("unchecked")
        Map<String, Object> responseMap = objectMapper.readValue(responseContent, Map.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> dataMap = (Map<String, Object>) responseMap.get("data");
        Long applicationId = Long.valueOf(dataMap.get("application_id").toString());

        // 2. 验证数据库中的申请记录
        FinancingApplication savedApplication = applicationRepository.findById(applicationId).orElse(null);
        assertNotNull(savedApplication);
        assertEquals(testLoanType.getLoanTypeId(), savedApplication.getLoanTypeId());
        assertEquals(0, savedApplication.getApplyAmount().compareTo(new BigDecimal("100000")));
        assertEquals(6, savedApplication.getApplyTerm());
        assertEquals(1, savedApplication.getApplicationStatus()); // 待信用评估
        assertNotNull(savedApplication.getApplicationNo());
        assertTrue(savedApplication.getApplicationNo().startsWith("FIN"));

        // 3. 查询用户申请列表
        mockMvc.perform(get("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].applicationId").value(applicationId))
                .andExpect(jsonPath("$.data[0].loanTypeName").value("测试种植周转贷"))
                .andExpect(jsonPath("$.data[0].applicationStatus").value(1));

        // 4. 触发信用评估
        mockMvc.perform(post("/api/internal/financing/applications/" + applicationId + "/evaluate")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("信用评估任务已启动"));

        // 5. 验证申请状态更新
        FinancingApplication updatedApplication = applicationRepository.findById(applicationId).orElse(null);
        assertNotNull(updatedApplication);
        assertTrue(updatedApplication.getApplicationStatus() == 2 || updatedApplication.getApplicationStatus() == 4);
        // 状态应该是2(待银行审批)或4(审批驳回)，取决于模拟的信用评估结果
    }

    @Test
    @WithMockUser(roles = "FARMER")
    void testApplicationValidation() throws Exception {
        // 测试申请参数验证

        // 测试空的贷款类型ID
        FinancingApplicationCreateRequest invalidRequest = new FinancingApplicationCreateRequest();
        invalidRequest.setLoanTypeId(null);
        invalidRequest.setApplyAmount(new BigDecimal("100000"));
        invalidRequest.setApplyTerm(6);
        invalidRequest.setLoanPurposeDetail("测试用途");
        invalidRequest.setRepaymentPlan("测试还款计划");
        invalidRequest.setBankId(101);
        invalidRequest.setMaterialUrls(Arrays.asList("https://example.com/test.jpg"));

        String invalidRequestJson = objectMapper.writeValueAsString(invalidRequest);

        mockMvc.perform(post("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("参数验证失败"));
    }

    @Test
    @WithMockUser(roles = "FARMER")
    void testApplicationAmountValidation() throws Exception {
        // 测试申请金额验证

        FinancingApplicationCreateRequest request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(testLoanType.getLoanTypeId());
        request.setApplyAmount(new BigDecimal("600000")); // 超过最大金额500000
        request.setApplyTerm(6);
        request.setLoanPurposeDetail("测试用途");
        request.setRepaymentPlan("测试还款计划");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/test.jpg"));

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("申请提交失败: 申请金额超出允许范围"));
    }

    @Test
    @WithMockUser(roles = "FARMER")
    void testApplicationTermValidation() throws Exception {
        // 测试申请期限验证

        FinancingApplicationCreateRequest request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(testLoanType.getLoanTypeId());
        request.setApplyAmount(new BigDecimal("100000"));
        request.setApplyTerm(24); // 超过最大期限12
        request.setLoanPurposeDetail("测试用途");
        request.setRepaymentPlan("测试还款计划");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/test.jpg"));

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("申请提交失败: 申请期限超出允许范围"));
    }

    @Test
    @WithMockUser(roles = "FARMER")
    void testInvalidLoanType() throws Exception {
        // 测试无效的贷款类型

        FinancingApplicationCreateRequest request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(999); // 不存在的贷款类型
        request.setApplyAmount(new BigDecimal("100000"));
        request.setApplyTerm(6);
        request.setLoanPurposeDetail("测试用途");
        request.setRepaymentPlan("测试还款计划");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/test.jpg"));

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("申请提交失败: 贷款类型不存在或已停用"));
    }

    @Test
    @WithMockUser(roles = "FARMER")
    void testDatabaseTransactionRollback() throws Exception {
        // 测试数据库事务回滚

        long initialCount = applicationRepository.count();

        // 创建一个会导致异常的请求（无效贷款类型）
        FinancingApplicationCreateRequest request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(999);
        request.setApplyAmount(new BigDecimal("100000"));
        request.setApplyTerm(6);
        request.setLoanPurposeDetail("测试用途");
        request.setRepaymentPlan("测试还款计划");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/test.jpg"));

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/farmer/financing/applications")
                .header("Authorization", "Bearer test_farmer_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500));

        // 验证数据库记录数没有增加（事务回滚）
        long finalCount = applicationRepository.count();
        assertEquals(initialCount, finalCount);
    }
}