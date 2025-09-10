package com.agrichain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.agrichain.entity.RetailerInfo;
import com.agrichain.repository.RetailerInfoRepository;

@Service
public class RetailerService {
    
    @Autowired
    private RetailerInfoRepository retailerInfoRepository;
    
    @Autowired
    private BlockchainService blockchainService;
    
    public RetailerInfo updateRetailerInfo(String productId, RetailerInfo retailerInfo) {
        try {
            System.out.println("Updating retailer info for product: " + productId);
            
            // Check if retailer info already exists
            RetailerInfo existingInfo = retailerInfoRepository.findByProductId(productId)
                    .orElse(new RetailerInfo());
            
            // Update fields
            existingInfo.setProductId(productId);
            existingInfo.setRetailerName(retailerInfo.getRetailerName());
            existingInfo.setStorageConditions(retailerInfo.getStorageConditions());
            existingInfo.setRetailPrice(retailerInfo.getRetailPrice());
            existingInfo.setRetailerLocation(retailerInfo.getRetailerLocation());
            existingInfo.setDateOfArrival(retailerInfo.getDateOfArrival());
            existingInfo.setRetailerAddress(retailerInfo.getRetailerAddress());
            existingInfo.setUpdatedAt(java.time.LocalDateTime.now());
            
            // Save to database
            RetailerInfo savedInfo = retailerInfoRepository.save(existingInfo);
            System.out.println("Retailer info saved to database for product: " + productId);
            
            // Update on blockchain
            blockchainService.updateRetailerInfoOnBlockchain(productId, savedInfo);
            System.out.println("Retailer info updated on blockchain for product: " + productId);
            
            return savedInfo;
            
        } catch (Exception e) {
            System.err.println("Error in updateRetailerInfo: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update retailer info: " + e.getMessage(), e);
        }
    }
    
    public RetailerInfo getRetailerInfo(String productId) {
        try {
            return retailerInfoRepository.findByProductId(productId)
                    .orElseThrow(() -> new RuntimeException("Retailer info not found for product: " + productId));
        } catch (Exception e) {
            System.err.println("Error in getRetailerInfo: " + e.getMessage());
            throw new RuntimeException("Failed to get retailer info: " + e.getMessage(), e);
        }
    }
}