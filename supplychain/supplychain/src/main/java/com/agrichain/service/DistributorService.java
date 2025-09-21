package com.agrichain.service;

import com.agrichain.entity.DistributorInfo;
import com.agrichain.repository.DistributorInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DistributorService {
    
    @Autowired
    private DistributorInfoRepository distributorInfoRepository;
    
    public DistributorInfo updateDistributorInfo(String productId, DistributorInfo distributorInfo) {
        try {
            // Check if distributor info already exists for this product
            Optional<DistributorInfo> existingInfo = distributorInfoRepository.findByProductId(productId);
            
            DistributorInfo infoToSave;
            if (existingInfo.isPresent()) {
                // Update existing info
                infoToSave = existingInfo.get();
                infoToSave.setDistributorName(distributorInfo.getDistributorName());
                infoToSave.setWarehouseLocation(distributorInfo.getWarehouseLocation());
                infoToSave.setStorageConditions(distributorInfo.getStorageConditions());
                infoToSave.setTransportationMethod(distributorInfo.getTransportationMethod());
                infoToSave.setDistributionPrice(distributorInfo.getDistributionPrice());
                infoToSave.setDateOfReceiving(distributorInfo.getDateOfReceiving());
                infoToSave.setBatchNumber(distributorInfo.getBatchNumber());
                infoToSave.setQualityCheckStatus(distributorInfo.getQualityCheckStatus());
                infoToSave.preUpdate(); // Update timestamp
            } else {
                // Create new info
                infoToSave = new DistributorInfo(productId);
                infoToSave.setDistributorName(distributorInfo.getDistributorName());
                infoToSave.setWarehouseLocation(distributorInfo.getWarehouseLocation());
                infoToSave.setStorageConditions(distributorInfo.getStorageConditions());
                infoToSave.setTransportationMethod(distributorInfo.getTransportationMethod());
                infoToSave.setDistributionPrice(distributorInfo.getDistributionPrice());
                infoToSave.setDateOfReceiving(distributorInfo.getDateOfReceiving());
                infoToSave.setBatchNumber(distributorInfo.getBatchNumber());
                infoToSave.setQualityCheckStatus(distributorInfo.getQualityCheckStatus());
            }
            
            DistributorInfo savedInfo = distributorInfoRepository.save(infoToSave);
            System.out.println("Distributor info saved successfully: " + savedInfo);
            return savedInfo;
            
        } catch (Exception e) {
            System.err.println("Error saving distributor info: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save distributor information", e);
        }
    }
    
    public DistributorInfo getDistributorInfo(String productId) {
        Optional<DistributorInfo> distributorInfo = distributorInfoRepository.findByProductId(productId);
        if (distributorInfo.isPresent()) {
            return distributorInfo.get();
        } else {
            throw new RuntimeException("Distributor information not found for product: " + productId);
        }
    }
    
    public boolean hasDistributorInfo(String productId) {
        return distributorInfoRepository.findByProductId(productId).isPresent();
    }
    
    public void deleteDistributorInfo(String productId) {
        Optional<DistributorInfo> distributorInfo = distributorInfoRepository.findByProductId(productId);
        if (distributorInfo.isPresent()) {
            distributorInfoRepository.delete(distributorInfo.get());
        }
    }
}