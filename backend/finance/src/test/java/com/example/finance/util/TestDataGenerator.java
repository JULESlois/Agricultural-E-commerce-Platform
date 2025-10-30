package com.example.finance.util;

import com.example.finance.dto.FinancingApplicationCreateRequest;
import com.example.finance.entity.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 测试数据生成器
 */
public class TestDataGenerator {
    
    private static final Random random = new Random();
    
    /**
     * 创建测试贷款类型
     */
    public static FinancingLoanType createTestLoanType() {
        FinancingLoanType loanType = new FinancingLoanType();
        loanType.setLoanTypeName("测试种植周转贷");
        loanType.setLoanPurpose("用于测试的贷款类型");
        loanType.setMinLoanAmount(new BigDecimal("10000"));
        loanType.setMaxLoanAmount(new BigDecimal("500000"));
        loanType.setMinLoanTerm(3);
        loanType.setMaxLoanTerm(12);
        loanType.setLoanTermType(2);
        loanType.setInterestRateType(1);
        loanType.setMinInterestRate(new BigDecimal("0.0435"));
        loanType.setMaxInterestRate(new BigDecimal("0.065"));
        loanType.setRequiredMaterials("身份证,种植证明,银行流水");
        loanType.setApplicableObjects("测试农户");
        loanType.setSupportBanks("测试银行");
        loanType.setStatus(1);
        loanType.setSort(1);
        return loanType;
    }
    
    /**
     * 创建测试融资申请
     */
    public static FinancingApplication createTestApplication(Integer loanTypeId) {
        FinancingApplication application = new FinancingApplication();
        application.setApplicationNo("FIN" + System.currentTimeMillis());
        application.setUserId(1001L + random.nextInt(1000));
        application.setLoanTypeId(loanTypeId);
        application.setApplyAmount(new BigDecimal("100000"));
        application.setApplyTerm(6);
        application.setApplyTermType(2);
        application.setLoanPurposeDetail("测试用途");
        application.setRepaymentPlan("测试还款计划");
        application.setBankId(101);
        application.setContactPhone("13800138000");
        application.setContactAddress("测试地址");
        application.setMaterialUrls("https://example.com/test.jpg");
        application.setApplicationStatus(1);
        return application;
    }
    
    /**
     * 创建测试申请请求
     */
    public static FinancingApplicationCreateRequest createTestApplicationRequest(Integer loanTypeId) {
        FinancingApplicationCreateRequest request = new FinancingApplicationCreateRequest();
        request.setLoanTypeId(loanTypeId);
        request.setApplyAmount(new BigDecimal("100000"));
        request.setApplyTerm(6);
        request.setLoanPurposeDetail("测试用途");
        request.setRepaymentPlan("测试还款计划");
        request.setBankId(101);
        request.setMaterialUrls(Arrays.asList("https://example.com/test.jpg"));
        return request;
    }
    
    /**
     * 创建测试银行
     */
    public static FinancingBank createTestBank() {
        FinancingBank bank = new FinancingBank();
        bank.setBankName("测试银行");
        bank.setBankShortName("测试银行");
        bank.setContactDepartment("测试部门");
        bank.setContactPerson("测试联系人");
        bank.setContactPhone("400-123-4567");
        bank.setBankProvince("河南省");
        bank.setSupportedLoanTypes("1,2,3");
        bank.setApprovalCycle("1-2个工作日");
        bank.setBankStatus(1);
        return bank;
    }
    
    /**
     * 创建测试信用评估
     */
    public static FinancingCreditEvaluation createTestCreditEvaluation(Long applicationId, Long userId) {
        FinancingCreditEvaluation evaluation = new FinancingCreditEvaluation();
        evaluation.setApplicationId(applicationId);
        evaluation.setUserId(userId);
        evaluation.setEvaluationType(1);
        evaluation.setCreditScore(85);
        evaluation.setCreditLevel("A级");
        evaluation.setScoreDetail("{\"经营年限\":20,\"平台交易\":30,\"征信记录\":20,\"资产状况\":15}");
        evaluation.setDataSources("平台交易记录，农户经营信息");
        evaluation.setEvaluationResult(1);
        evaluation.setEvaluationRemark("信用良好");
        evaluation.setCreditReportUrl("https://example.com/report.pdf");
        evaluation.setReportGenerateTime(LocalDateTime.now());
        return evaluation;
    }
    
    /**
     * 创建测试银行审批
     */
    public static FinancingBankApproval createTestBankApproval(Long applicationId, Integer bankId) {
        FinancingBankApproval approval = new FinancingBankApproval();
        approval.setApplicationId(applicationId);
        approval.setBankId(bankId);
        approval.setApproverId(3001L);
        approval.setApproverName("测试审批员");
        approval.setApprovalResult(1);
        approval.setApprovalAmount(new BigDecimal("80000"));
        approval.setApprovalTerm(6);
        approval.setInterestRate(new BigDecimal("0.052"));
        approval.setRepaymentMethod("按月付息，到期还本");
        approval.setApprovalRemark("测试审批通过");
        return approval;
    }
    
    /**
     * 创建测试预售计划
     */
    public static FinancingPresalePlan createTestPresalePlan(Long userId) {
        FinancingPresalePlan plan = new FinancingPresalePlan();
        plan.setPlanNo("PRE" + System.currentTimeMillis());
        plan.setUserId(userId);
        plan.setCategoryId(101);
        plan.setProductName("测试农产品");
        plan.setPlantDate(LocalDate.now().plusDays(30));
        plan.setExpectedHarvestDate(LocalDate.now().plusDays(200));
        plan.setTotalYieldQuantity(new BigDecimal("50000"));
        plan.setPresaleUnitPrice(new BigDecimal("4.50"));
        plan.setDepositRatio(new BigDecimal("0.3"));
        plan.setPlanStatus(2); // 预售中
        plan.setAuditStatus(1); // 已审核
        return plan;
    }
    
    /**
     * 创建测试预售认购
     */
    public static FinancingPresaleSubscription createTestSubscription(Long planId, Long userId) {
        FinancingPresaleSubscription subscription = new FinancingPresaleSubscription();
        subscription.setSubscriptionNo("SUB" + System.currentTimeMillis());
        subscription.setPlanId(planId);
        subscription.setUserId(userId);
        subscription.setSubscribedQuantity(new BigDecimal("1000"));
        subscription.setDepositAmount(new BigDecimal("1350")); // 1000 * 4.5 * 0.3
        subscription.setPaymentStatus(1); // 已支付
        subscription.setSubscriptionStatus(1); // 有效
        return subscription;
    }
    
    /**
     * 创建测试还款计划
     */
    public static FinancingRepaymentSchedule createTestRepaymentSchedule(Long applicationId, Integer termNumber) {
        FinancingRepaymentSchedule schedule = new FinancingRepaymentSchedule();
        schedule.setApplicationId(applicationId);
        schedule.setTermNumber(termNumber);
        schedule.setDueDate(LocalDate.now().plusMonths(termNumber));
        schedule.setPrincipalDue(termNumber == 6 ? new BigDecimal("80000") : BigDecimal.ZERO);
        schedule.setInterestDue(new BigDecimal("347")); // 80000 * 0.052 / 12
        schedule.setPaymentStatus(0); // 待还款
        return schedule;
    }
    
    /**
     * 创建测试还款调整申请
     */
    public static FinancingRepaymentAdjustmentRequest createTestAdjustmentRequest(Long applicationId, Long userId) {
        FinancingRepaymentAdjustmentRequest request = new FinancingRepaymentAdjustmentRequest();
        request.setApplicationId(applicationId);
        request.setUserId(userId);
        request.setRequestReason("因天气原因，收获期延后");
        request.setProposedPlanDetails("申请将第6期本金延后1个月偿还");
        request.setRequestStatus(0); // 待审批
        return request;
    }
    
    /**
     * 生成随机金额
     */
    public static BigDecimal randomAmount(int min, int max) {
        int amount = min + random.nextInt(max - min + 1);
        return new BigDecimal(amount);
    }
    
    /**
     * 生成随机期限
     */
    public static int randomTerm(int min, int max) {
        return min + random.nextInt(max - min + 1);
    }
    
    /**
     * 生成随机用户ID
     */
    public static Long randomUserId() {
        return 1001L + random.nextInt(1000);
    }
    
    /**
     * 生成随机申请编号
     */
    public static String randomApplicationNo() {
        return "FIN" + System.currentTimeMillis() + String.format("%04d", random.nextInt(10000));
    }
    
    /**
     * 创建多个测试贷款类型
     */
    public static List<FinancingLoanType> createMultipleTestLoanTypes() {
        FinancingLoanType type1 = createTestLoanType();
        type1.setLoanTypeName("种植周转贷");
        type1.setSort(1);
        
        FinancingLoanType type2 = createTestLoanType();
        type2.setLoanTypeName("农机购置贷");
        type2.setMinLoanAmount(new BigDecimal("50000"));
        type2.setMaxLoanAmount(new BigDecimal("1000000"));
        type2.setSort(2);
        
        FinancingLoanType type3 = createTestLoanType();
        type3.setLoanTypeName("农产品预售贷");
        type3.setMinLoanAmount(new BigDecimal("20000"));
        type3.setMaxLoanAmount(new BigDecimal("800000"));
        type3.setSort(3);
        
        return Arrays.asList(type1, type2, type3);
    }
    
    /**
     * 创建批量测试申请
     */
    public static List<FinancingApplication> createBatchTestApplications(Integer loanTypeId, int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> {
                    FinancingApplication app = createTestApplication(loanTypeId);
                    app.setUserId(randomUserId());
                    app.setApplyAmount(randomAmount(10000, 500000));
                    app.setApplyTerm(randomTerm(3, 12));
                    return app;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}