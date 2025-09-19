#!/bin/bash

# 🟣 Polygon Deployment and Configuration Script
# This script deploys contracts to Polygon and updates all configurations

echo "🚀 Starting Polygon Integration Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "hardhat-example/hardhat.config.ts" ]; then
    print_error "Please run this script from the project root directory (sih2025/)"
    exit 1
fi

# Step 1: Check dependencies
print_info "Checking dependencies..."

if [ ! -f "hardhat-example/.env" ]; then
    print_warning ".env file not found. Creating from template..."
    cp hardhat-example/.env.example hardhat-example/.env
    print_warning "Please edit hardhat-example/.env with your private key and API keys before continuing."
    read -p "Press Enter after you've updated the .env file..."
fi

# Step 2: Install dependencies
print_info "Installing Hardhat dependencies..."
cd hardhat-example
npm install || {
    print_error "Failed to install Hardhat dependencies"
    exit 1
}

# Step 3: Install dotenv if not present
if ! npm list dotenv &> /dev/null; then
    print_info "Installing dotenv package..."
    npm install dotenv
fi

print_status "Dependencies installed successfully"

# Step 4: Compile contracts
print_info "Compiling smart contracts..."
npx hardhat compile || {
    print_error "Failed to compile contracts"
    exit 1
}
print_status "Contracts compiled successfully"

# Step 5: Deploy to Polygon Mumbai
print_info "Deploying to Polygon Mumbai testnet..."
echo "Make sure you have:"
echo "1. Added your private key to .env"
echo "2. Added Polygon Mumbai network to MetaMask"
echo "3. Got test MATIC from https://faucet.polygon.technology/"
echo ""
read -p "Ready to deploy? (y/N): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    deployment_output=$(npx hardhat run scripts/deploy-ProductRegistry.ts --network mumbai 2>&1)
    
    if [ $? -eq 0 ]; then
        print_status "Contract deployed successfully to Polygon Mumbai!"
        echo "$deployment_output"
        
        # Extract contract address from deployment output
        contract_address=$(echo "$deployment_output" | grep -o "0x[a-fA-F0-9]\{40\}" | head -1)
        
        if [ ! -z "$contract_address" ]; then
            print_info "Contract address: $contract_address"
            
            # Step 6: Update Spring Boot configuration
            print_info "Updating Spring Boot backend configuration..."
            cd ../supplychain/supplychain/src/main/resources
            
            # Backup original file
            cp application.properties application.properties.backup
            
            # Update contract address
            sed -i.bak "s/blockchain.contract.address=.*/blockchain.contract.address=$contract_address/" application.properties
            
            print_status "Backend configuration updated!"
            
            # Step 7: Update frontend configuration
            print_info "Frontend contract integration is automatic via deployment script"
            
            cd ../../../../
            
            print_status "🎉 Polygon integration setup complete!"
            echo ""
            echo "Next steps:"
            echo "1. Start the frontend: cd odisha-produce-chain-main/odisha-produce-chain-main && npm run dev"
            echo "2. Start the backend: cd supplychain/supplychain && ./mvnw spring-boot:run"
            echo "3. Connect MetaMask to Polygon Mumbai network"
            echo "4. Test the application with some MATIC tokens"
            echo ""
            echo "📊 View your contract on PolygonScan:"
            echo "https://mumbai.polygonscan.com/address/$contract_address"
        else
            print_error "Could not extract contract address from deployment output"
        fi
    else
        print_error "Deployment failed!"
        echo "$deployment_output"
        exit 1
    fi
else
    print_warning "Deployment cancelled"
fi

print_info "Setup script completed. Check POLYGON_SETUP_GUIDE.md for detailed instructions."