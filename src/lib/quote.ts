import { Address } from "thirdweb";
import Token from "@/app/types/token";
import { DEX_CONTRACT } from "./contracts";
import { useReadContract } from "thirdweb/react";

export function useGetQuote(params: {
  tokenIn: Token;
  tokenOut: Token;
  amountIn?: bigint;
}) {
  const { tokenIn, tokenOut, amountIn } = params;

  const { data: tokensInContract, error: tokensError, isLoading: tokensLoading } = useReadContract({
    contract: DEX_CONTRACT,
    method: "getTokensInContract",
    params: [],
  });

  const { data: ethInContract, error: ethError, isLoading: ethLoading } = useReadContract({
    contract: DEX_CONTRACT,
    method: "totalSupply",
    params: [],
  });

  const { data: outputAmount, error: outputError } = useReadContract({
    contract: DEX_CONTRACT,
    method: "getAmountOfTokens",
    params: amountIn ? [
      amountIn,
      tokenIn.symbol === "ETH" ? (ethInContract ?? 0n) : (tokensInContract ?? 0n),
      tokenOut.symbol === "ETH" ? (ethInContract ?? 0n) : (tokensInContract ?? 0n),
    ] : [0n, 0n, 0n], 
  });

  console.log('Contract state:', {
    tokensInContract: tokensInContract?.toString(),
    ethInContract: ethInContract?.toString(),
    tokensLoading,
    ethLoading,
    tokensError,
    ethError,
    DEX_CONTRACT: DEX_CONTRACT?.address,
    tokenIn: tokenIn?.symbol,
    tokenOut: tokenOut?.symbol
  });

  if (tokensLoading || ethLoading) {
    return undefined;
  }

  if (tokensError || ethError) {
    console.error('Contract errors:', { tokensError, ethError });
    throw new Error(`Failed to fetch reserves: ${tokensError?.message || ethError?.message}`);
  }

  if (tokensInContract === 0n || ethInContract === 0n) {
    console.warn('Pool has no liquidity:', {
      tokensInContract: tokensInContract?.toString(),
      ethInContract: ethInContract?.toString()
    });
    return {
      outputAmount: 0n,
      price: 0
    };
  }

  if (!tokensInContract || !ethInContract || !amountIn) {
    return undefined;
  }

  if (outputError) {
    console.error('Contract error:', outputError);
    throw new Error(`Failed to calculate output amount: ${outputError.message}`);
  }

  if (!outputAmount) {
    return undefined;
  }

  const price = amountIn === 0n ? 0 : Number(outputAmount) / Number(amountIn);

  return {
    outputAmount,
    price
  };
}
