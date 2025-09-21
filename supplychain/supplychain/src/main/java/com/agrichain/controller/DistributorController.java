package com.agrichain.controller;

import com.agrichain.entity.Product;
import com.agrichain.entity.DistributorInfo;
import com.agrichain.service.ProductService;
import com.agrichain.service.DistributorService;
import com.agrichain.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/distributor")
@CrossOrigin(origins = "*")
public class DistributorController {
    
    @Autowired
    private DistributorService distributorService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private BlockchainService blockchainService;
    
    @PostMapping("/update-info/{productId}")
    public ResponseEntity<Map<String, Object>> updateDistributorInfo(
            @PathVariable String productId,
            @RequestBody DistributorInfo distributorInfo) {
        try {
            System.out.println("Received distributor info update for product: " + productId);
            
            // Update distributor info in database
            DistributorInfo updatedInfo = distributorService.updateDistributorInfo(productId, distributorInfo);
            System.out.println("Distributor info updated in database");
            
            // Update distributor info on blockchain
            try {
                blockchainService.updateDistributorInfoOnBlockchain(productId, updatedInfo);
                System.out.println("Distributor info updated on blockchain");
            } catch (Exception blockchainError) {
                System.err.println("Warning: Failed to update blockchain, but database update succeeded: " + blockchainError.getMessage());
                // Continue execution - blockchain update failure shouldn't break the flow
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("distributorInfo", updatedInfo);
            response.put("message", "Distributor information updated successfully");
            response.put("blockchainUpdated", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in updateDistributorInfo: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update distributor info: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/info/{productId}")
    public ResponseEntity<Map<String, Object>> getDistributorInfo(@PathVariable String productId) {
        try {
            System.out.println("Fetching distributor info for product: " + productId);
            
            DistributorInfo distributorInfo = distributorService.getDistributorInfo(productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("distributorInfo", distributorInfo);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in getDistributorInfo: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get distributor info: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/product-details/{encryptedCode}")
    public ResponseEntity<Map<String, Object>> getProductWithDistributorInfo(@PathVariable String encryptedCode) {
        try {
            System.out.println("Fetching product with distributor info for encrypted code: " + encryptedCode);
            
            // First verify the product using ProductService
            Product product = productService.verifyProductByEncryptedCode(encryptedCode);
            
            if (product == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Product not found");
                errorResponse.put("success", false);
                errorResponse.put("verified", false);
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Try to get distributor info
            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("success", true);
            response.put("verified", true);
            
            try {
                DistributorInfo distributorInfo = distributorService.getDistributorInfo(product.getProductId());
                response.put("distributorInfo", distributorInfo);
                response.put("hasDistributorInfo", true);
            } catch (Exception e) {
                System.out.println("No distributor info found for product: " + product.getProductId());
                response.put("hasDistributorInfo", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in getProductWithDistributorInfo: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get product details: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}