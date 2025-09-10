package com.agrichain.controller;

import com.agrichain.entity.Product;
import com.agrichain.entity.RetailerInfo;
import com.agrichain.service.ProductService;
import com.agrichain.service.RetailerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/retailer")
@CrossOrigin(origins = "*")
public class RetailerController {
    
    @Autowired
    private RetailerService retailerService;
    
    @Autowired
    private ProductService productService;
    
    @PostMapping("/update-info/{productId}")
    public ResponseEntity<Map<String, Object>> updateRetailerInfo(
            @PathVariable String productId,
            @RequestBody RetailerInfo retailerInfo) {
        try {
            System.out.println("Received retailer info update for product: " + productId);
            
            RetailerInfo updatedInfo = retailerService.updateRetailerInfo(productId, retailerInfo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("retailerInfo", updatedInfo);
            response.put("message", "Retailer information updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in updateRetailerInfo: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update retailer info: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/info/{productId}")
    public ResponseEntity<Map<String, Object>> getRetailerInfo(@PathVariable String productId) {
        try {
            System.out.println("Fetching retailer info for product: " + productId);
            
            RetailerInfo retailerInfo = retailerService.getRetailerInfo(productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("retailerInfo", retailerInfo);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in getRetailerInfo: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get retailer info: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/product-details/{encryptedCode}")
    public ResponseEntity<Map<String, Object>> getProductWithRetailerInfo(@PathVariable String encryptedCode) {
        try {
            System.out.println("Fetching product with retailer info for encrypted code: " + encryptedCode);
            
            // First verify the product using ProductService
            Product product = productService.verifyProductByEncryptedCode(encryptedCode);
            
            if (product == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Product not found");
                errorResponse.put("success", false);
                errorResponse.put("verified", false);
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Try to get retailer info
            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("success", true);
            response.put("verified", true);
            
            try {
                RetailerInfo retailerInfo = retailerService.getRetailerInfo(product.getProductId());
                response.put("retailerInfo", retailerInfo);
                response.put("hasRetailerInfo", true);
            } catch (Exception e) {
                System.out.println("No retailer info found for product: " + product.getProductId());
                response.put("hasRetailerInfo", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in getProductWithRetailerInfo: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get product details: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}