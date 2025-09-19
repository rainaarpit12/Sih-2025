import { ethers } from "hardhat";
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log(`🚀 Deploying ProductRegistry to ${hre.network.name}...`);
  
  // Get the contract factory
  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  
  // Deploy with gas optimization for Polygon
  const deploymentOptions: any = {};
  
  if (hre.network.name === "mumbai" || hre.network.name === "polygon") {
    deploymentOptions.gasPrice = ethers.parseUnits("30", "gwei"); // 30 Gwei for Polygon
    deploymentOptions.gasLimit = 3000000;
  }
  
  console.log("📄 Deploying contract...");
  const productRegistry = await ProductRegistry.deploy(deploymentOptions);
  
  console.log("⏳ Waiting for deployment confirmation...");
  await productRegistry.waitForDeployment();
  
  const contractAddress = await productRegistry.getAddress();
  console.log(`✅ ProductRegistry deployed to: ${contractAddress}`);
  console.log(`🌐 Network: ${hre.network.name} (Chain ID: ${hre.network.config.chainId})`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployedAt: new Date().toISOString(),
    txHash: productRegistry.deploymentTransaction()?.hash
  };
  
  // Create contract address file for frontend
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  
  const contractAddressFile = path.join(frontendDir, "contract-address.json");
  fs.writeFileSync(contractAddressFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`📁 Contract address saved to: ${contractAddressFile}`);
  
  // Copy ABI to frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json");
  const frontendAbiPath = path.join(frontendDir, "ProductRegistry.json");
  
  if (fs.existsSync(artifactPath)) {
    fs.copyFileSync(artifactPath, frontendAbiPath);
    console.log(`📋 ABI copied to: ${frontendAbiPath}`);
  }
  
  // Display network information
  if (hre.network.name === "mumbai") {
    console.log(`🔍 Verify on PolygonScan: https://mumbai.polygonscan.com/address/${contractAddress}`);
    console.log(`💧 Get test MATIC: https://faucet.polygon.technology/`);
  } else if (hre.network.name === "polygon") {
    console.log(`🔍 Verify on PolygonScan: https://polygonscan.com/address/${contractAddress}`);
  }
  
  console.log("🎉 Deployment completed successfully!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});