package com.example.finance.service;

import com.example.finance.dto.FinancingApplicationCreateRequest;
import com.example.finance.dto.FinancingApplicationResponse;
import com.example.finance.entity.FinancingApplication;
import com.example.finance.entity.FinancingLoanType;
import com.example.finance.repository.FinancingApplicationRepository;
import com.example.finance.repository.FinancingLoanTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class FinancingApplicationService {
    
    @Autowired
    private FinancingApplicationRepository applicationRepository;
    
    @Autowired
    private FinancingLoanTypeRepository loanTypeRepository;
    
    /**
     * 创建融资申请
     */
    @Transactional
    public FinancingApplication createApplication(Long userId, FinancingApplicationCreateRequest request) {
        // 验证贷款类型
        FinancingLoanType loanType = loanTypeRepository.findByLoanTypeIdAndStatus(request.getLoanTypeId(), 1);
        if (loanType == null) {
            throw new RuntimeException("贷款类型不存在或已停用");
        }
        
        // 验证申请金额范围
        if (request.getApplyAmount().compareTo(loanType.getMinLoanAmount()) < 0 ||
            request.getApplyAmount().compareTo(loanType.getMaxLoanAmount()) > 0) {
            throw new RuntimeException("申请金额超出允许范围");
        }
        
        // 验证申请期限范围
        if (request.getApplyTerm() < loanType.getMinLoanTerm() ||
            request.getApplyTerm() > loanType.getMaxLoanTerm()) {
            throw new RuntimeException("申请期限超出允许范围");
        }
        
        // 创建申请记录
        FinancingApplication application = new FinancingApplication();
        application.setApplicationNo(generateApplicationNo());
        application.setUserId(userId);
        application.setLoanTypeId(request.getLoanTypeId());
        application.setApplyAmount(request.getApplyAmount());
        application.setApplyTerm(request.getApplyTerm());
        application.setApplyTermType(loanType.getLoanTermType());
        application.setLoanPurposeDetail(request.getLoanPurposeDetail());
        application.setRepaymentPlan(request.getRepaymentPlan());
        application.setSourceId(request.getSourceId());
        application.setBankId(request.getBankId());
        application.setContactPhone(""); // 需要从用户信息获取
        application.setContactAddress(""); // 需要从用户信息获取
        application.setMaterialUrls(String.join(",", request.getMaterialUrls()));
        application.setApplicationStatus(1); // 待信用评估
        
        return applicationRepository.save(application);
    }
    
    /**
     * 获取用户的融资申请列表
     */
    public List<FinancingApplicationResponse> getUserApplications(Long userId) {
        List<FinancingApplication> applications = applicationRepository.findByUserIdOrderByCreateTimeDesc(userId);
        
        return applications.stream().map(app -> {
            FinancingLoanType loanType = loanTypeRepository.findById(app.getLoanTypeId()).orElse(null);
            String loanTypeName = loanType != null ? loanType.getLoanTypeName() : "未知类型";
            
            return new FinancingApplicationResponse(
                app.getApplicationId(),
                app.getApplicationNo(),
                loanTypeName,
                app.getApplyAmount(),
                app.getApplyTerm(),
                app.getApplicationStatus(),
                app.getCreateTime()
            );
        }).collect(Collectors.toList());
    }
    
    /**
     * 根据银行ID和状态获取待审批申请
     */
    public List<FinancingApplication> getApplicationsByBankAndStatus(Integer bankId, Integer status) {
        return applicationRepository.findByBankIdAndStatus(bankId, status);
    }
    
    /**
     * 根据申请ID获取申请详情
     */
    public FinancingApplication getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId).orElse(null);
    }
    
    /**
     * 更新申请状态
     */
    @Transactional
    public void updateApplicationStatus(Long applicationId, Integer status) {
        FinancingApplication application = applicationRepository.findById(applicationId).orElse(null);
        if (application != null) {
            application.setApplicationStatus(status);
            applicationRepository.save(application);
        }
    }
    
    /**
     * 生成申请编号
     */
    private String generateApplicationNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = String.format("%08d", new Random().nextInt(100000000));
        return "FIN" + dateStr + randomStr;
    }
}