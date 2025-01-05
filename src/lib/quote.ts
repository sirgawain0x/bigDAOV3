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

  // Get ETH balance from contract's total supply (represents ETH in pool)
  const { data: ethInContract, error: ethError, isLoading: ethLoading } = useReadContract({
    contract: DEX_CONTRACT,
    method: "totalSupply",
    params: [],
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

  // If still loading, return undefined instead of null to prevent unnecessary renders
  if (tokensLoading || ethLoading) {
    return undefined;
  }

  if (tokensError || ethError) {
    console.error('Contract errors:', { tokensError, ethError });
    throw new Error(`Failed to fetch reserves: ${tokensError?.message || ethError?.message}`);
  }

  // Check if the values exist but are zero
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

  if (!tokensInContract || !ethInContract) {
    throw new Error("Failed to fetch reserves - values undefined");
  }

  if (!amountIn) {
    return undefined;
  }

  // Use the contract's getAmountOfTokens function to calculate output
  const { data: outputAmount, error: outputError } = useReadContract({
    contract: DEX_CONTRACT,
    method: "getAmountOfTokens",
    params: [
      amountIn,
      tokenIn.symbol === "ETH" ? ethInContract : tokensInContract,  // input reserve matches input token
      tokenOut.symbol === "ETH" ? ethInContract : tokensInContract, // output reserve matches output token
    ],
  });

  if (outputError) {
    console.error('Contract error:', outputError);
    throw new Error(`Failed to calculate output amount: ${outputError.message}`);
  }

  if (!outputAmount) {
    return undefined;
  }

  // Calculate effective price (avoid division by zero)
  const price = amountIn === 0n ? 0 : Number(outputAmount) / Number(amountIn);

  return {
    outputAmount,
    price
  };
}
