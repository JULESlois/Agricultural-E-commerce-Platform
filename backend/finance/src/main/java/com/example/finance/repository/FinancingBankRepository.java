package com.example.finance.repository;

import com.example.finance.entity.FinancingBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingBankRepository extends JpaRepository<FinancingBank, Integer> {
    
    /**
     * 查询正常合作状态的银行
     */
    List<FinancingBank> findByBankStatus(Integer bankStatus);
    
    /**
     * 根据省份查询银行
     */
    List<FinancingBank> findByBankProvinceAndBankStatus(String bankProvince, Integer bankStatus);
    
    /**
     * 根据省份和城市查询银行
     */
    List<FinancingBank> findByBankProvinceAndBankCityAndBankStatus(String bankProvince, String bankCity, Integer bankStatus);
    
    /**
     * 查询支持指定贷款类型的银行
     */
    @Query("SELECT fb FROM FinancingBank fb WHERE fb.bankStatus = 1 AND fb.supportedLoanTypes LIKE %:loanTypeId%")
    List<FinancingBank> findBySupportedLoanType(@Param("loanTypeId") String loanTypeId);
}