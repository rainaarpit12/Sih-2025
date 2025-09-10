package com.agrichain.service;

import com.agrichain.entity.Product;
import com.agrichain.repository.ProductRepository;
import com.agrichain.repository.BlockchainRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BlockchainRecordRepository blockchainRecordRepository;
    
    public Product verifyProductByEncryptedCode(String encryptedCode) {
        try {
            // Find the blockchain record by encrypted code
            var recordOpt = blockchainRecordRepository.findByEncryptedCode(encryptedCode);
            
            if (recordOpt.isPresent()) {
                String productId = recordOpt.get().getProductId();
                
                // Find the product by product ID
                var productOpt = productRepository.findByProductId(productId);
                
                if (productOpt.isPresent()) {
                    return productOpt.get();
                }
            }
            
            return null;
            
        } catch (Exception e) {
            System.err.println("Error in verifyProductByEncryptedCode: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}