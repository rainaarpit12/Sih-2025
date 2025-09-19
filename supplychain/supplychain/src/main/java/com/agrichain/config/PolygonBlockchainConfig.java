package com.agrichain.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "blockchain")
public class PolygonBlockchainConfig {
    
    private String network = "polygon-mumbai";
    private String nodeUrl = "https://rpc-mumbai.maticvigil.com";
    private long chainId = 80001; // Mumbai testnet
    private String contractAddress;
    private String privateKey;
    private Gas gas = new Gas();
    private Mainnet mainnet = new Mainnet();
    private Testnet testnet = new Testnet();
    
    // Getters and Setters
    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }
    
    public String getNodeUrl() { return nodeUrl; }
    public void setNodeUrl(String nodeUrl) { this.nodeUrl = nodeUrl; }
    
    public long getChainId() { return chainId; }
    public void setChainId(long chainId) { this.chainId = chainId; }
    
    public String getContractAddress() { return contractAddress; }
    public void setContractAddress(String contractAddress) { this.contractAddress = contractAddress; }
    
    public String getPrivateKey() { return privateKey; }
    public void setPrivateKey(String privateKey) { this.privateKey = privateKey; }
    
    public Gas getGas() { return gas; }
    public void setGas(Gas gas) { this.gas = gas; }
    
    public Mainnet getMainnet() { return mainnet; }
    public void setMainnet(Mainnet mainnet) { this.mainnet = mainnet; }
    
    public Testnet getTestnet() { return testnet; }
    public void setTestnet(Testnet testnet) { this.testnet = testnet; }
    
    // Nested Configuration Classes
    public static class Gas {
        private long price = 30000000000L; // 30 Gwei
        private long limit = 300000L;
        
        public long getPrice() { return price; }
        public void setPrice(long price) { this.price = price; }
        
        public long getLimit() { return limit; }
        public void setLimit(long limit) { this.limit = limit; }
    }
    
    public static class Mainnet {
        private String url = "https://polygon-rpc.com";
        private long chainId = 137;
        
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        
        public long getChainId() { return chainId; }
        public void setChainId(long chainId) { this.chainId = chainId; }
    }
    
    public static class Testnet {
        private String url = "https://rpc-mumbai.maticvigil.com";
        private long chainId = 80001;
        
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        
        public long getChainId() { return chainId; }
        public void setChainId(long chainId) { this.chainId = chainId; }
    }
    
    // Helper methods
    public boolean isMainnet() {
        return "polygon".equals(network) || "polygon-mainnet".equals(network);
    }
    
    public boolean isTestnet() {
        return "polygon-mumbai".equals(network) || "mumbai".equals(network);
    }
    
    public String getCurrentRpcUrl() {
        return isMainnet() ? mainnet.getUrl() : testnet.getUrl();
    }
    
    public long getCurrentChainId() {
        return isMainnet() ? mainnet.getChainId() : testnet.getChainId();
    }
}