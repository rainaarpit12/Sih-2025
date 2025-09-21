package com.agrichain.repository;

import com.agrichain.entity.DistributorInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistributorInfoRepository extends JpaRepository<DistributorInfo, Long> {
    Optional<DistributorInfo> findByProductId(String productId);
    void deleteByProductId(String productId);
}