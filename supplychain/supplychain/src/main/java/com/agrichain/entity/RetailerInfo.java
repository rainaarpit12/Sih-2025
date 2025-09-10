package com.agrichain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "retailer_info")
public class RetailerInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", unique = true, nullable = false)
    private String productId;
    
    @Column(name = "retailer_name", nullable = false)
    private String retailerName;
    
    @Column(name = "storage_conditions", columnDefinition = "TEXT")
    private String storageConditions;
    
    @Column(name = "retail_price")
    private Double retailPrice;
    
    @Column(name = "retailer_location")
    private String retailerLocation;
    
    @Column(name = "date_of_arrival")
    private String dateOfArrival;
    
    @Column(name = "retailer_address")
    private String retailerAddress;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public RetailerInfo() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    
    public String getRetailerName() { return retailerName; }
    public void setRetailerName(String retailerName) { this.retailerName = retailerName; }
    
    public String getStorageConditions() { return storageConditions; }
    public void setStorageConditions(String storageConditions) { this.storageConditions = storageConditions; }
    
    public Double getRetailPrice() { return retailPrice; }
    public void setRetailPrice(Double retailPrice) { this.retailPrice = retailPrice; }
    
    public String getRetailerLocation() { return retailerLocation; }
    public void setRetailerLocation(String retailerLocation) { this.retailerLocation = retailerLocation; }
    
    public String getDateOfArrival() { return dateOfArrival; }
    public void setDateOfArrival(String dateOfArrival) { this.dateOfArrival = dateOfArrival; }
    
    public String getRetailerAddress() { return retailerAddress; }
    public void setRetailerAddress(String retailerAddress) { this.retailerAddress = retailerAddress; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}