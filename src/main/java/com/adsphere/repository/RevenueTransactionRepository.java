package com.adsphere.repository;

import com.adsphere.model.RevenueTransaction;
import com.adsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface RevenueTransactionRepository extends JpaRepository<RevenueTransaction, Long> {
    List<RevenueTransaction> findByPublisher(User publisher);
    List<RevenueTransaction> findByAdvertiser(User advertiser);

    @Query("SELECT SUM(r.publisherShare) FROM RevenueTransaction r WHERE r.publisher.id = :publisherId")
    BigDecimal sumPublisherEarnings(@Param("publisherId") Long publisherId);

    @Query("SELECT SUM(r.totalAmount) FROM RevenueTransaction r WHERE r.advertiser.id = :advertiserId")
    BigDecimal sumAdvertiserSpend(@Param("advertiserId") Long advertiserId);
}
