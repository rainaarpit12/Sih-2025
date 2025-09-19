// src/hooks/use-contract.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Polygon network configurations
const POLYGON_NETWORKS = {
  mumbai: {
    chainId: '0x13881', // 80001 in hex
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
  mainnet: {
    chainId: '0x89', // 137 in hex
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  }
};

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  mumbai: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Will be updated after deployment
  mainnet: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Will be updated after deployment
  localhost: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
};

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
  const [network, setNetwork] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);

  useEffect(() => {
    initializeContract();
  }, []);

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 80001: return 'mumbai';
      case 137: return 'mainnet';
      case 31337: return 'localhost';
      default: return 'unknown';
    }
  };

  const getContractAddress = (networkName: string): string => {
    return CONTRACT_ADDRESSES[networkName as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES.mumbai;
  };

  const switchToPolygon = async (network: 'mumbai' | 'mainnet' = 'mumbai') => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_NETWORKS[network].chainId }],
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORKS[network]],
          });
        } catch (addError) {
          throw new Error(`Failed to add ${network} network`);
        }
      } else {
        throw switchError;
      }
    }
  };

  const initializeContract = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get current network
        const networkInfo = await provider.getNetwork();
        const currentChainId = Number(networkInfo.chainId);
        const networkName = getNetworkName(currentChainId);
        
        setChainId(currentChainId);
        setNetwork(networkName);
        
        console.log(`🔗 Connected to network: ${networkName} (${currentChainId})`);
        
        // Check if already connected
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
        
        // Get contract address for current network
        const contractAddress = getContractAddress(networkName);
        console.log(`📄 Using contract address: ${contractAddress}`);

        // Create contract instance
        let contractInstance;
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          contractInstance = new ethers.Contract(contractAddress, PRODUCT_REGISTRY_ABI, signer);
        } else {
          contractInstance = new ethers.Contract(contractAddress, PRODUCT_REGISTRY_ABI, provider);
        }
        
        setContract(contractInstance);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            initializeContract(); // Reinitialize with new account
          } else {
            setAccount('');
            setIsConnected(false);
          }
        });
        
        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload(); // Reload to reinitialize with new network
        });
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
        
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Check if we're on a Polygon network, if not suggest switching
          if (chainId !== 80001 && chainId !== 137) {
            const shouldSwitch = window.confirm(
              'You are not connected to Polygon network. Would you like to switch to Polygon Mumbai (testnet)?'
            );
            
            if (shouldSwitch) {
              await switchToPolygon('mumbai');
            }
          }
          
          await initializeContract();
        }
      } else {
        throw new Error('MetaMask not installed');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    account,
    isConnected,
    isLoading,
    network,
    chainId,
    connectWallet,
    switchToPolygon,
    isPolygonNetwork: chainId === 80001 || chainId === 137
  };
};