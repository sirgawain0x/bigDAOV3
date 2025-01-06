import { useState, useEffect } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { DEX_CONTRACT } from "@/lib/contracts";
import { formatEther } from "viem";
import { readContract } from "thirdweb";

export interface LiquidityInfo {
  ethReserve: bigint;
  tokenReserve: bigint;
  lpBalance: bigint;
  totalSupply: bigint;
  userShare: number;
}

export function useLiquidity() {
  const [liquidityInfo, setLiquidityInfo] = useState<LiquidityInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const activeAccount = useActiveAccount();

  // Contract read functions
  const { data: tokenReserve } = useReadContract({
    contract: DEX_CONTRACT,
    method: "getTokensInContract",
    params: [],
  });

  const { data: ethReserve } = useReadContract({
    contract: DEX_CONTRACT,
    method: "totalSupply",
    params: [],
  });

  const { data: lpBalance } = useReadContract({
    contract: DEX_CONTRACT,
    method: "balanceOf",
    params: [activeAccount?.address as string],
  });

  const { data: totalSupply } = useReadContract({
    contract: DEX_CONTRACT,
    method: "totalSupply",
    params: [],
  });

  // Add the getAmountOfTokens contract read
  const getAmountOfTokens = async (
    inputAmount: bigint,
    inputReserve: bigint,
    outputReserve: bigint
  ) => {
    const data = await readContract({
      contract: DEX_CONTRACT,
      method: "getAmountOfTokens",
      params: [inputAmount, inputReserve, outputReserve],
    });
    return data;
  };

  useEffect(() => {
    if (
      ethReserve &&
      tokenReserve &&
      lpBalance &&
      totalSupply &&
      activeAccount?.address
    ) {
      const userShare =
        totalSupply > 0n ? (Number(lpBalance) / Number(totalSupply)) * 100 : 0;

      setLiquidityInfo({
        ethReserve,
        tokenReserve,
        lpBalance,
        totalSupply,
        userShare,
      });
      setLoading(false);
    }
  }, [
    ethReserve,
    tokenReserve,
    lpBalance,
    totalSupply,
    activeAccount?.address,
  ]);

  const calculatePriceImpact = async (
    inputAmount: bigint,
    isEthToToken: boolean
  ) => {
    if (!liquidityInfo) return 0;

    try {
      const outputAmount = await getAmountOfTokens(
        inputAmount,
        isEthToToken ? liquidityInfo.ethReserve : liquidityInfo.tokenReserve,
        isEthToToken ? liquidityInfo.tokenReserve : liquidityInfo.ethReserve
      );

      if (!outputAmount) return 0;

      const inputReserve = isEthToToken
        ? liquidityInfo.ethReserve
        : liquidityInfo.tokenReserve;
      const outputReserve = isEthToToken
        ? liquidityInfo.tokenReserve
        : liquidityInfo.ethReserve;

      // Calculate price impact as the change in price after the trade
      const priceBeforeTrade = Number(outputReserve) / Number(inputReserve);
      const priceAfterTrade =
        Number(outputReserve - outputAmount) /
        Number(inputReserve + inputAmount);

      const priceImpact = Math.abs(
        ((priceAfterTrade - priceBeforeTrade) / priceBeforeTrade) * 100
      );

      return priceImpact;
    } catch (error) {
      console.error("Error calculating price impact:", error);
      return 0;
    }
  };

  return {
    liquidityInfo,
    loading,
    calculatePriceImpact,
  };
}
