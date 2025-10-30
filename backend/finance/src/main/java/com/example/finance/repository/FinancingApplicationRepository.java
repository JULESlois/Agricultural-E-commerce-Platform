package com.example.finance.repository;

import com.example.finance.entity.FinancingApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancingApplicationRepository extends JpaRepository<FinancingApplication, Long> {
    
    /**
     * 根据用户ID查询申请列表，按创建时间倒序
     */
    List<FinancingApplication> findByUserIdOrderByCreateTimeDesc(Long userId);
    
    /**
     * 根据申请编号查询
     */
    FinancingApplication findByApplicationNo(String applicationNo);
    
    /**
     * 根据申请状态查询
     */
    List<FinancingApplication> findByApplicationStatusOrderByCreateTimeDesc(Integer applicationStatus);
    
    /**
     * 根据银行ID和申请状态查询待审批的申请
     */
    @Query("SELECT fa FROM FinancingApplication fa WHERE fa.bankId = :bankId AND fa.applicationStatus = :status ORDER BY fa.createTime ASC")
    List<FinancingApplication> findByBankIdAndStatus(@Param("bankId") Integer bankId, @Param("status") Integer status);
    
    /**
     * 根据用户ID和申请状态查询
     */
    List<FinancingApplication> findByUserIdAndApplicationStatus(Long userId, Integer applicationStatus);
}