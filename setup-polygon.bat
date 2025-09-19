@echo off
REM 🟣 Polygon Deployment and Configuration Script for Windows
REM This script deploys contracts to Polygon and updates all configurations

echo 🚀 Starting Polygon Integration Setup...

REM Check if we're in the right directory
if not exist "hardhat-example\hardhat.config.ts" (
    echo ❌ Please run this script from the project root directory (sih2025/)
    pause
    exit /b 1
)

REM Step 1: Check dependencies
echo ℹ️  Checking dependencies...

if not exist "hardhat-example\.env" (
    echo ⚠️  .env file not found. Creating from template...
    copy "hardhat-example\.env.example" "hardhat-example\.env"
    echo ⚠️  Please edit hardhat-example\.env with your private key and API keys before continuing.
    pause
)

REM Step 2: Install dependencies
echo ℹ️  Installing Hardhat dependencies...
cd hardhat-example
call npm install
if errorlevel 1 (
    echo ❌ Failed to install Hardhat dependencies
    pause
    exit /b 1
)

REM Install dotenv
echo ℹ️  Installing dotenv package...
call npm install dotenv

echo ✅ Dependencies installed successfully

REM Step 3: Compile contracts
echo ℹ️  Compiling smart contracts...
call npx hardhat compile
if errorlevel 1 (
    echo ❌ Failed to compile contracts
    pause
    exit /b 1
)
echo ✅ Contracts compiled successfully

REM Step 4: Deploy to Polygon Mumbai
echo ℹ️  Deploying to Polygon Mumbai testnet...
echo Make sure you have:
echo 1. Added your private key to .env
echo 2. Added Polygon Mumbai network to MetaMask
echo 3. Got test MATIC from https://faucet.polygon.technology/
echo.
set /p confirm="Ready to deploy? (y/N): "

if /i "%confirm%"=="y" (
    echo ℹ️  Deploying contract...
    call npx hardhat run scripts/deploy-ProductRegistry.ts --network mumbai > deployment_output.txt 2>&1
    
    if errorlevel 1 (
        echo ❌ Deployment failed!
        type deployment_output.txt
        pause
        exit /b 1
    ) else (
        echo ✅ Contract deployed successfully to Polygon Mumbai!
        type deployment_output.txt
        
        echo.
        echo ✅ 🎉 Polygon integration setup complete!
        echo.
        echo Next steps:
        echo 1. Start the frontend: cd odisha-produce-chain-main\odisha-produce-chain-main ^&^& npm run dev
        echo 2. Start the backend: cd supplychain\supplychain ^&^& mvnw spring-boot:run
        echo 3. Connect MetaMask to Polygon Mumbai network
        echo 4. Test the application with some MATIC tokens
        echo.
        echo 📊 Check the deployment output above for your contract address and PolygonScan link
    )
) else (
    echo ⚠️  Deployment cancelled
)

cd ..
echo ℹ️  Setup script completed. Check POLYGON_SETUP_GUIDE.md for detailed instructions.
pause