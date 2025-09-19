# 🟣 Polygon Integration Setup Guide

This guide will help you deploy and configure the entire project to work with Polygon blockchain instead of Ethereum.

## 📋 Prerequisites

1. **MetaMask Extension**: Install MetaMask browser extension
2. **Test MATIC Tokens**: Get free test tokens from [Polygon Faucet](https://faucet.polygon.technology/)
3. **Node.js & npm**: Ensure you have Node.js installed
4. **Private Key**: Export your MetaMask private key (keep it secure!)

## 🔧 Setup Instructions

### 1. Environment Configuration

1. Navigate to the hardhat directory:
   ```bash
   cd hardhat-example
   ```

2. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```

3. Edit `.env` file and add your details:
   ```env
   # Your MetaMask private key (without 0x prefix)
   PRIVATE_KEY=your_private_key_here
   
   # Get API key from https://polygonscan.com/apis
   POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
   ```

### 2. Install Dependencies

```bash
# Install Hardhat dependencies
cd hardhat-example
npm install

# Install frontend dependencies
cd ../odisha-produce-chain-main/odisha-produce-chain-main
npm install
```

### 3. Deploy Smart Contracts

Deploy to Polygon Mumbai Testnet:
```bash
cd hardhat-example
npm run deploy:mumbai
```

The deployment will:
- Deploy ProductRegistry contract to Polygon Mumbai
- Save contract address to frontend
- Copy ABI files for frontend integration
- Display PolygonScan verification links

### 4. Configure MetaMask

1. **Add Polygon Mumbai Network**:
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com/

2. **Get Test MATIC**:
   - Visit: https://faucet.polygon.technology/
   - Enter your wallet address
   - Request test MATIC tokens

### 5. Update Backend Configuration

The Spring Boot backend is already configured for Polygon! Just update the contract address:

1. Copy the deployed contract address from deployment output
2. Update `supplychain/supplychain/src/main/resources/application.properties`:
   ```properties
   blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS
   ```

### 6. Start the Application

```bash
# Start frontend
cd odisha-produce-chain-main/odisha-produce-chain-main
npm run dev

# Start backend (in separate terminal)
cd supplychain/supplychain
./mvnw spring-boot:run
```

## 🎯 Features Added

### ✅ Polygon Network Support
- **Mumbai Testnet**: For development and testing
- **Polygon Mainnet**: Ready for production
- **Automatic Network Detection**: Frontend detects current network
- **Network Switching**: One-click switch to Polygon

### ✅ Enhanced User Experience
- **Network Status Component**: Shows connection status
- **Wallet Integration**: Connect/disconnect MetaMask
- **Gas Optimization**: Lower gas costs on Polygon
- **Fallback RPCs**: Multiple endpoints for reliability

### ✅ Smart Contract Features
- **Same Functionality**: All features work on Polygon
- **Lower Costs**: Transactions cost ~$0.01 instead of $10+
- **Faster Confirmation**: ~2 second block times
- **EVM Compatible**: No code changes needed

## 🔍 Verification

After deployment, verify your setup:

1. **Check Network Status**: Look for "Polygon Ready" indicator
2. **Test Transaction**: Try adding a product (costs ~0.001 MATIC)
3. **View on PolygonScan**: Check contract on Mumbai PolygonScan
4. **Backend Integration**: Verify Spring Boot connects to contract

## 🚀 Production Deployment

For production deployment to Polygon Mainnet:

1. **Get Real MATIC**: Buy MATIC tokens on exchanges
2. **Deploy to Mainnet**:
   ```bash
   npm run deploy:polygon
   ```
3. **Update Configuration**: Point backend to mainnet contract
4. **Security Audit**: Consider smart contract audit for production

## 🛠 Troubleshooting

### Common Issues:

1. **"Network not supported"**:
   - Ensure MetaMask is connected to Polygon Mumbai
   - Click "Switch to Polygon" button in UI

2. **"Insufficient funds"**:
   - Get test MATIC from faucet
   - Ensure you have enough for gas fees

3. **"Contract not found"**:
   - Verify contract address in configuration
   - Check deployment was successful

4. **"Transaction failed"**:
   - Check gas limits in hardhat.config.ts
   - Verify network connectivity

## 📊 Cost Comparison

| Operation | Ethereum Mainnet | Polygon |
|-----------|------------------|---------|
| Deploy Contract | ~$500 | ~$0.50 |
| Add Product | ~$50 | ~$0.05 |
| Update Info | ~$30 | ~$0.03 |
| Query Data | Free | Free |

## 🔗 Useful Links

- [Polygon Documentation](https://docs.polygon.technology/)
- [Mumbai Faucet](https://faucet.polygon.technology/)
- [PolygonScan Testnet](https://mumbai.polygonscan.com/)
- [MetaMask Setup Guide](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/)

## 📞 Support

If you encounter issues:
1. Check console logs in browser (F12)
2. Verify network configuration
3. Ensure sufficient MATIC balance
4. Check contract deployment status

Your project is now ready to use Polygon blockchain! 🎉