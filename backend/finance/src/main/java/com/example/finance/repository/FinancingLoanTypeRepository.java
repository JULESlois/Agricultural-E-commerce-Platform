package com.example.finance.repository;

import com.example.finance.entity.FinancingLoanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingLoanTypeRepository extends JpaRepository<FinancingLoanType, Integer> {
    
    /**
     * 查询启用状态的贷款类型，按排序权重排序
     */
    List<FinancingLoanType> findByStatusOrderBySort(Integer status);
    
    /**
     * 根据贷款类型ID和状态查询
     */
    FinancingLoanType findByLoanTypeIdAndStatus(Integer loanTypeId, Integer status);
    
    /**
     * 查询支持指定银行的贷款类型
     */
    @Query("SELECT lt FROM FinancingLoanType lt WHERE lt.status = 1 AND lt.supportBanks LIKE %:bankName%")
    List<FinancingLoanType> findBySupportBank(String bankName);
}