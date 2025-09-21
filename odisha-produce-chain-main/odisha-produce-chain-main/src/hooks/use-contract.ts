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
  mumbai: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Will be updated after deployment
  mainnet: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Will be updated after deployment
  localhost: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' // Updated with deployed contract
};

// Complete ABI for the ProductRegistry contract
const PRODUCT_REGISTRY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "farmerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contactInfo",
        "type": "string"
      }
    ],
    "name": "FarmerRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_dateOfManufacture",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_timeOfManufacture",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_place",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_qualityRating",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_priceForFarmer",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      }
    ],
    "name": "createProduct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dateOfManufacture",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "timeOfManufacture",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "place",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "qualityRating",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "priceForFarmer",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "farmer",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isAvailable",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "updatedAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct ProductRegistry.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getRetailerInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "retailerName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "storageConditions",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "retailPrice",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "retailerLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dateOfArrival",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "retailerAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "updatedAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct ProductRegistry.RetailerInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextProductId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dateOfManufacture",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "timeOfManufacture",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "place",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "qualityRating",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "priceForFarmer",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isAvailable",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_contactInfo",
        "type": "string"
      }
    ],
    "name": "registerFarmer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "retailerInfos",
    "outputs": [
      {
        "internalType": "string",
        "name": "retailerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageConditions",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "retailPrice",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "retailerLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dateOfArrival",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "retailerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_retailerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_storageConditions",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_retailPrice",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_retailerLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_dateOfArrival",
        "type": "string"
      }
    ],
    "name": "updateRetailerInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Local test accounts from Hardhat node
const LOCAL_TEST_ACCOUNTS = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    role: 'farmer'
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    role: 'distributor'
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    role: 'retailer'
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
    role: 'customer'
  }
];

export const useContract = () => {
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [network, setNetwork] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [useMetaMask, setUseMetaMask] = useState<boolean>(false);

  useEffect(() => {
    initializeContract();
  }, [selectedAccount, useMetaMask]);

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
      if (useMetaMask && typeof window.ethereum !== 'undefined') {
        // MetaMask mode (existing logic)
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
      } else {
        // Local test account mode (no MetaMask)
        console.log('🔧 Using local test accounts mode (no MetaMask required)');
        
        // Connect to local Hardhat node
        const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
        
        // Set local network info
        setChainId(31337);
        setNetwork('localhost');
        
        // Use selected test account
        const testAccount = LOCAL_TEST_ACCOUNTS[selectedAccount];
        setAccount(testAccount.address);
        setIsConnected(true);
        
        console.log(`👤 Using test account: ${testAccount.address} (${testAccount.role})`);
        
        // Create wallet from private key
        const wallet = new ethers.Wallet(testAccount.privateKey, provider);
        
        // Get contract address for localhost
        const contractAddress = getContractAddress('localhost');
        console.log(`📄 Using contract address: ${contractAddress}`);
        
        // Create contract instance with wallet (can sign transactions)
        const contractInstance = new ethers.Contract(contractAddress, PRODUCT_REGISTRY_ABI, wallet);
        setContract(contractInstance);
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (useMetaMask) {
        // MetaMask connection logic
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
      } else {
        // Local test account mode - already connected automatically
        setIsConnected(true);
        console.log('✅ Using local test account - no wallet connection needed');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccount = (accountIndex: number) => {
    if (accountIndex >= 0 && accountIndex < LOCAL_TEST_ACCOUNTS.length) {
      setSelectedAccount(accountIndex);
      console.log(`🔄 Switched to account: ${LOCAL_TEST_ACCOUNTS[accountIndex].address} (${LOCAL_TEST_ACCOUNTS[accountIndex].role})`);
    }
  };

  const toggleMetaMaskMode = () => {
    setUseMetaMask(!useMetaMask);
    setIsConnected(false);
    setAccount('');
    console.log(`🔄 Switched to ${!useMetaMask ? 'MetaMask' : 'local test'} mode`);
  };

  const getCurrentAccountInfo = () => {
    if (!useMetaMask && selectedAccount < LOCAL_TEST_ACCOUNTS.length) {
      return LOCAL_TEST_ACCOUNTS[selectedAccount];
    }
    return null;
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
    isPolygonNetwork: chainId === 80001 || chainId === 137,
    // New functions for local test mode
    useMetaMask,
    toggleMetaMaskMode,
    switchAccount,
    selectedAccount,
    localTestAccounts: LOCAL_TEST_ACCOUNTS,
    getCurrentAccountInfo
  };
};