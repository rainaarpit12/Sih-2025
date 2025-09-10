package com.agrichain.repository;

import com.agrichain.entity.RetailerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RetailerInfoRepository extends JpaRepository<RetailerInfo, Long> {
    Optional<RetailerInfo> findByProductId(String productId);
}