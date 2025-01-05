import { useState, useEffect } from 'react';
import { useReadContract, useActiveAccount } from 'thirdweb/react';
import { DEX_CONTRACT } from '@/lib/contracts';
import { formatEther } from 'viem';

export interface LiquidityInfo {
  ethReserve: bigint;
  tokenReserve: bigint;
  lpBalance: bigint;
  totalSupply: bigint;
  userShare: number;
}

export function useLiquidity() {
  const [liquidityInfo, setLiquidityInfo] = useState<LiquidityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const activeAccount = useActiveAccount();

  // Get token balance (BIG tokens in contract)
  const { data: tokenReserve } = useReadContract({
    contract: DEX_CONTRACT,
    method: "getTokensInContract",
    params: [],
  });

  // Get total supply (represents ETH in pool)
  const { data: ethReserve } = useReadContract({
    contract: DEX_CONTRACT,
    method: "totalSupply",
    params: [],
  });

  // Get user's LP token balance
  const { data: lpBalance } = useReadContract({
    contract: DEX_CONTRACT,
    method: "balanceOf",
    params: [activeAccount?.address],
  });

  // Get total LP supply
  const { data: totalSupply } = useReadContract({
    contract: DEX_CONTRACT,
    method: "totalSupply",
    params: [],
  });

  useEffect(() => {
    if (ethReserve && tokenReserve && lpBalance && totalSupply && activeAccount?.address) {
      const userShare = totalSupply > 0n ? 
        (Number(lpBalance) / Number(totalSupply)) * 100 : 
        0;

      setLiquidityInfo({
        ethReserve,
        tokenReserve,
        lpBalance,
        totalSupply,
        userShare
      });
      setLoading(false);
    }
  }, [ethReserve, tokenReserve, lpBalance, totalSupply, activeAccount?.address]);

  const calculatePriceImpact = async (inputAmount: bigint, isEthToToken: boolean) => {
    if (!liquidityInfo) return 0;

    try {
      const { data: outputAmount } = await useReadContract({
        contract: DEX_CONTRACT,
        method: "getAmountOfTokens",
        params: [
          inputAmount,
          isEthToToken ? liquidityInfo.ethReserve : liquidityInfo.tokenReserve,
          isEthToToken ? liquidityInfo.tokenReserve : liquidityInfo.ethReserve
        ],
      });

      if (!outputAmount) return 0;

      const inputReserve = isEthToToken ? liquidityInfo.ethReserve : liquidityInfo.tokenReserve;
      const outputReserve = isEthToToken ? liquidityInfo.tokenReserve : liquidityInfo.ethReserve;

      // Calculate price impact as the change in price after the trade
      const priceBeforeTrade = Number(outputReserve) / Number(inputReserve);
      const priceAfterTrade = Number(outputReserve - outputAmount) / 
                             Number(inputReserve + inputAmount);
      
      const priceImpact = Math.abs((priceAfterTrade - priceBeforeTrade) / priceBeforeTrade * 100);
      
      return priceImpact;
    } catch (error) {
      console.error("Error calculating price impact:", error);
      return 0;
    }
  };

  return {
    liquidityInfo,
    loading,
    calculatePriceImpact
  };
}
