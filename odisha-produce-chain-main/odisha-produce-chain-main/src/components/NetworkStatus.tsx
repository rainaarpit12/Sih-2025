import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useContract } from '@/hooks/use-contract';

export const NetworkStatus: React.FC = () => {
  const { 
    isConnected, 
    network, 
    chainId, 
    account, 
    connectWallet, 
    switchToPolygon, 
    isPolygonNetwork 
  } = useContract();

  const getNetworkBadgeColor = () => {
    if (!isConnected) return 'destructive';
    if (isPolygonNetwork) return 'default';
    return 'secondary';
  };

  const getNetworkDisplayName = () => {
    switch (network) {
      case 'mumbai': return 'Polygon Mumbai';
      case 'mainnet': return 'Polygon Mainnet';
      case 'localhost': return 'Local Network';
      default: return 'Unknown Network';
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!window.ethereum) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-destructive">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">MetaMask Not Detected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Please install MetaMask to interact with the blockchain
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {isConnected ? formatAddress(account) : 'Not Connected'}
                </span>
                <Badge variant={getNetworkBadgeColor()} className="text-xs">
                  {getNetworkDisplayName()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Chain ID: {chainId || 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isConnected && (
              <Button onClick={connectWallet} size="sm">
                Connect Wallet
              </Button>
            )}
            
            {isConnected && !isPolygonNetwork && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <Button 
                  onClick={() => switchToPolygon('mumbai')} 
                  size="sm" 
                  variant="outline"
                >
                  Switch to Polygon
                </Button>
              </div>
            )}
            
            {isConnected && isPolygonNetwork && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">Polygon Ready</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};