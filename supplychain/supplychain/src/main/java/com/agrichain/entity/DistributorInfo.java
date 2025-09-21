package com.agrichain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "distributor_info")
public class DistributorInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private String productId;
    
    @Column(name = "distributor_name")
    private String distributorName;
    
    @Column(name = "warehouse_location")
    private String warehouseLocation;
    
    @Column(name = "storage_conditions")
    private String storageConditions;
    
    @Column(name = "transportation_method")
    private String transportationMethod;
    
    @Column(name = "distribution_price")
    private String distributionPrice;
    
    @Column(name = "date_of_receiving")
    private String dateOfReceiving;
    
    @Column(name = "batch_number")
    private String batchNumber;
    
    @Column(name = "quality_check_status")
    private String qualityCheckStatus;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public DistributorInfo() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public DistributorInfo(String productId) {
        this();
        this.productId = productId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getProductId() {
        return productId;
    }
    
    public void setProductId(String productId) {
        this.productId = productId;
    }
    
    public String getDistributorName() {
        return distributorName;
    }
    
    public void setDistributorName(String distributorName) {
        this.distributorName = distributorName;
    }
    
    public String getWarehouseLocation() {
        return warehouseLocation;
    }
    
    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }
    
    public String getStorageConditions() {
        return storageConditions;
    }
    
    public void setStorageConditions(String storageConditions) {
        this.storageConditions = storageConditions;
    }
    
    public String getTransportationMethod() {
        return transportationMethod;
    }
    
    public void setTransportationMethod(String transportationMethod) {
        this.transportationMethod = transportationMethod;
    }
    
    public String getDistributionPrice() {
        return distributionPrice;
    }
    
    public void setDistributionPrice(String distributionPrice) {
        this.distributionPrice = distributionPrice;
    }
    
    public String getDateOfReceiving() {
        return dateOfReceiving;
    }
    
    public void setDateOfReceiving(String dateOfReceiving) {
        this.dateOfReceiving = dateOfReceiving;
    }
    
    public String getBatchNumber() {
        return batchNumber;
    }
    
    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }
    
    public String getQualityCheckStatus() {
        return qualityCheckStatus;
    }
    
    public void setQualityCheckStatus(String qualityCheckStatus) {
        this.qualityCheckStatus = qualityCheckStatus;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "DistributorInfo{" +
                "id=" + id +
                ", productId='" + productId + '\'' +
                ", distributorName='" + distributorName + '\'' +
                ", warehouseLocation='" + warehouseLocation + '\'' +
                ", storageConditions='" + storageConditions + '\'' +
                ", transportationMethod='" + transportationMethod + '\'' +
                ", distributionPrice='" + distributionPrice + '\'' +
                ", dateOfReceiving='" + dateOfReceiving + '\'' +
                ", batchNumber='" + batchNumber + '\'' +
                ", qualityCheckStatus='" + qualityCheckStatus + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}