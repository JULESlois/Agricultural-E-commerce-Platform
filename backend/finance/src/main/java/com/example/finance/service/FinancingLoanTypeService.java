package com.example.finance.service;

import com.example.finance.entity.FinancingLoanType;
import com.example.finance.repository.FinancingLoanTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FinancingLoanTypeService {
    
    @Autowired
    private FinancingLoanTypeRepository loanTypeRepository;
    
    /**
     * 获取所有启用的贷款类型
     */
    public List<FinancingLoanType> getAllActiveLoanTypes() {
        return loanTypeRepository.findByStatusOrderBySort(1);
    }
    
    /**
     * 根据ID获取贷款类型详情
     */
    public FinancingLoanType getLoanTypeById(Integer loanTypeId) {
        return loanTypeRepository.findByLoanTypeIdAndStatus(loanTypeId, 1);
    }
    
    /**
     * 根据银行名称查询支持的贷款类型
     */
    public List<FinancingLoanType> getLoanTypesByBank(String bankName) {
        return loanTypeRepository.findBySupportBank(bankName);
    }
}