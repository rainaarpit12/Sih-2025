// src/hooks/use-contract.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Minimal ABI for the functions we need
const PRODUCT_REGISTRY_ABI = [
  "function updateRetailerInfo(uint256 _id, string memory _retailerName, string memory _storageConditions, uint256 _retailPrice, string memory _retailerLocation, string memory _dateOfArrival) public",
  "function getProduct(uint256 _id) public view returns (tuple(uint256 id, string name, string category, string dateOfManufacture, string timeOfManufacture, string place, string qualityRating, uint256 priceForFarmer, string description, address farmer, bool isAvailable, uint256 createdAt, uint256 updatedAt))",
  "function getRetailerInfo(uint256 _id) public view returns (tuple(string retailerName, string storageConditions, uint256 retailPrice, string retailerLocation, string dateOfArrival, address retailerAddress, uint256 updatedAt))"
];

export const useContract = () => {
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Check if already connected
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }

        // Create provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Use default Hardhat local network address directly
        // Remove process.env usage since it's not available in browser
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Default Hardhat address

        // Create contract instance
        let contractInstance;
        
        if (accounts.length > 0) {
          // If connected, use signer
          const signer = await provider.getSigner();
          contractInstance = new ethers.Contract(
            contractAddress,
            PRODUCT_REGISTRY_ABI,
            signer
          );
        } else {
          // If not connected, use provider (read-only)
          contractInstance = new ethers.Contract(
            contractAddress,
            PRODUCT_REGISTRY_ABI,
            provider
          );
        }

        setContract(contractInstance);
      } else {
        console.warn('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Re-initialize contract with signer
        await initializeContract();
        
        return true;
      } else {
        console.error('MetaMask is not installed');
        return false;
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsLoading(false);
      return false;
    }
  };

  return {
    contract,
    account,
    isConnected,
    isLoading,
    connectWallet,
  };
};