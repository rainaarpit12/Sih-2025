// src/components/AccountSelector.tsx
import React from 'react';
import { useContract } from '../hooks/use-contract';

export const AccountSelector: React.FC = () => {
  const { 
    useMetaMask, 
    toggleMetaMaskMode, 
    switchAccount, 
    selectedAccount, 
    localTestAccounts, 
    getCurrentAccountInfo,
    account,
    isConnected 
  } = useContract();

  const currentAccountInfo = getCurrentAccountInfo();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Account Settings</h3>
      
      {/* Mode Toggle */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useMetaMask}
            onChange={toggleMetaMaskMode}
            className="rounded"
          />
          <span>Use MetaMask (uncheck for local test mode)</span>
        </label>
      </div>

      {/* Current Account Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">Current Account:</div>
        <div className="font-mono text-sm break-all">{account}</div>
        {currentAccountInfo && (
          <div className="text-sm text-blue-600 capitalize">
            Role: {currentAccountInfo.role}
          </div>
        )}
        <div className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Test Account Selector */}
      {!useMetaMask && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Test Account:
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => switchAccount(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {localTestAccounts.map((account, index) => (
              <option key={index} value={index}>
                {account.role.charAt(0).toUpperCase() + account.role.slice(1)} - {account.address.slice(0, 10)}...
              </option>
            ))}
          </select>
          
          <div className="mt-2 text-xs text-gray-500">
            💡 No MetaMask needed! Using pre-funded local test accounts.
          </div>
        </div>
      )}

      {/* MetaMask Instructions */}
      {useMetaMask && (
        <div className="text-sm text-gray-600">
          <div className="mb-2">MetaMask mode enabled. Connect your wallet to interact with the blockchain.</div>
          <div className="text-xs text-amber-600">
            ⚠️ Make sure you're connected to the Polygon network.
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSelector;