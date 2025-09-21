import { useState, useEffect } from 'react';

interface TokenAllocation {
  userId: string;
  amount: string;
  type: string;
}

interface TokenInfo {
  mintAddress: string;
  symbol: string;
  totalSupply: string;
  userBalance: string;
  allocations: TokenAllocation[];
}

interface TokenBalanceProps {
  projectId: string;
  userId: string;
}

export default function TokenBalance({ projectId, userId }: TokenBalanceProps) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenInfo();
  }, [projectId]);

  const fetchTokenInfo = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tokens`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTokenInfo(data);
    } catch (error) {
      console.error('Failed to fetch token info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserAllocation = () => {
    if (!tokenInfo) return '0';
    return tokenInfo.allocations
      .filter(a => a.userId === userId)
      .reduce((total, allocation) => total + parseInt(allocation.amount), 0)
      .toString();
  };

  const formatTokenAmount = (amount: string) => {
    const num = parseInt(amount);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getAllocationsByType = () => {
    if (!tokenInfo) return {};
    return tokenInfo.allocations.reduce((acc, allocation) => {
      if (!acc[allocation.type]) acc[allocation.type] = 0;
      acc[allocation.type] += parseInt(allocation.amount);
      return acc;
    }, {} as Record<string, number>);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-500">Failed to load token information</p>
      </div>
    );
  }

  const userAllocation = getUserAllocation();
  const allocationsByType = getAllocationsByType();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Token Balance</h3>
        <span className="text-sm text-gray-500 font-mono">
          ${tokenInfo.symbol}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Your Balance</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatTokenAmount(userAllocation)}
          </p>
          <p className="text-xs text-gray-500">
            {((parseInt(userAllocation) / parseInt(tokenInfo.totalSupply)) * 100).toFixed(2)}% of total supply
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Token Distribution</p>
          <div className="space-y-2">
            {Object.entries(allocationsByType).map(([type, amount]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span>{formatTokenAmount(amount.toString())}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">Total Supply</p>
          <p className="font-semibold">{formatTokenAmount(tokenInfo.totalSupply)}</p>
        </div>

        <div className="text-xs text-gray-500 break-all">
          <p>Mint Address:</p>
          <p className="font-mono">{tokenInfo.mintAddress}</p>
        </div>
      </div>
    </div>
  );
}