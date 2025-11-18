package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.dto.RevenueStatDTO;
import com.example.SubscriptionService.model.SubscriptionOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubscriptionOrderRepository extends JpaRepository<SubscriptionOrder, Long>, JpaSpecificationExecutor<SubscriptionOrder> {
    Page<SubscriptionOrder> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT new com.example.SubscriptionService.dto.RevenueStatDTO(CAST(o.updatedAt AS LocalDate), SUM(o.amount), COUNT(o)) " +
            "FROM SubscriptionOrder o " +
            "WHERE o.status = 'COMPLETED' AND o.updatedAt BETWEEN :startDate AND :endDate " +
            "GROUP BY CAST(o.updatedAt AS LocalDate) " +
            "ORDER BY CAST(o.updatedAt AS LocalDate) ASC")
    List<RevenueStatDTO> getRevenueStats(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
}
