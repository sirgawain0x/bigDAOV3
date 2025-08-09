"use client";
import React, { useState, useEffect, useCallback } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import { prepareContractCall, sendTransaction, toWei, Address } from "thirdweb";
import { Account } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { TokenConfig, TOKENS } from "@/lib/tokenConfig";

// Filter out BIG and REINA tokens for the swap component
const SWAP_TOKENS: Record<string, TokenConfig> = {
  ETH: TOKENS.ETH,
  USDC: TOKENS.USDC,
  cbBTC: TOKENS.cbBTC,
};
import TokenSwapInput from "./TokenSwapInput";
import { Button } from "@/components/ui/button";
import { ArrowDown, RefreshCw } from "lucide-react";
import { TransactionModal } from "./TransactionModal";
import { useToast } from "@/hooks/use-toast";
import { useTokenBalances } from "@/hooks/useTokenBalances";

export const MultiTokenSwap = () => {
  const { toast } = useToast();
  
  // Token selection state
  const [fromToken, setFromToken] = useState<TokenConfig>(SWAP_TOKENS.ETH);
  const [toToken, setToToken] = useState<TokenConfig>(SWAP_TOKENS.USDC);
  
  // Input values
  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  
  const activeAccount = useActiveAccount();
  const { balances, fetchBalances } = useTokenBalances();

  // Handle token selection
  const handleFromTokenChange = (token: TokenConfig) => {
    setFromToken(token);
    // If the new token is the same as toToken, swap them
    if (token.symbol === toToken.symbol) {
      setToToken(fromToken);
    }
    // Clear values when tokens change
    setFromValue("");
    setToValue("");
  };

  const handleToTokenChange = (token: TokenConfig) => {
    setToToken(token);
    // If the new token is the same as fromToken, swap them
    if (token.symbol === fromToken.symbol) {
      setFromToken(toToken);
    }
    // Clear values when tokens change
    setFromValue("");
    setToValue("");
  };

  // Swap tokens
  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempValue = fromValue;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  // Calculate exchange rate (simplified - in a real implementation you'd use a DEX API)
  const calculateExchangeRate = useCallback(() => {
    if (!fromValue || parseFloat(fromValue) === 0) {
      setToValue("");
      return;
    }

    // This is a simplified calculation - in a real implementation you'd get quotes from a DEX
    // For now, we'll use placeholder rates
    const rates: Record<string, Record<string, number>> = {
      ETH: { USDC: 2000, cbBTC: 0.05 },
      USDC: { ETH: 0.0005, cbBTC: 0.000025 },
      cbBTC: { ETH: 20000, USDC: 40000 },
    };

    const rate = rates[fromToken.symbol]?.[toToken.symbol] || 1;
    const calculatedValue = (parseFloat(fromValue) * rate).toFixed(6);
    setToValue(calculatedValue);
  }, [fromValue, fromToken.symbol, toToken.symbol]);

  useEffect(() => {
    calculateExchangeRate();
  }, [calculateExchangeRate]);

  // Handle swap execution
  const handleSwap = async () => {
    if (!activeAccount?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!fromValue || parseFloat(fromValue) === 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap.",
        variant: "destructive",
      });
      return;
    }

    const fromBalance = balances[fromToken.symbol] || "0";
    if (parseFloat(fromValue) > parseFloat(fromBalance)) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromToken.symbol} to complete this swap.`,
        variant: "destructive",
      });
      return;
    }

    setShowTransactionModal(true);
  };

  const executeSwap = async () => {
    try {
      setIsSwapping(true);
      setShowTransactionModal(false);

      // This is a placeholder implementation
      // In a real implementation, you would:
      // 1. Get a quote from a DEX (like Uniswap V3)
      // 2. Approve tokens if needed
      // 3. Execute the swap transaction
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Swap successful!",
        description: `Successfully swapped ${fromValue} ${fromToken.symbol} for ${toValue} ${toToken.symbol}`,
      });

      // Clear values and refresh balances
      setFromValue("");
      setToValue("");
      await fetchBalances();

    } catch (error) {
      console.error("Swap error:", error);
      toast({
        title: "Swap failed",
        description: "An error occurred during the swap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Swap Tokens</h1>
            <p className="text-gray-500 mt-1">Trade tokens on Base</p>
          </div>

          {/* From Token Input */}
          <TokenSwapInput
            selectedToken={fromToken}
            onTokenChange={handleFromTokenChange}
            value={fromValue}
            setValue={setFromValue}
            balance={balances[fromToken.symbol]}
            disabled={false}
            placeholder="0.0"
          />

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <Button
              onClick={handleSwapTokens}
              variant="outline"
              size="sm"
              className="rounded-full p-2"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Token Input */}
          <TokenSwapInput
            selectedToken={toToken}
            onTokenChange={handleToTokenChange}
            value={toValue}
            setValue={setToValue}
            balance={balances[toToken.symbol]}
            disabled={true}
            tokenSelectorDisabled={false}
            placeholder="0.0"
          />

          {/* Exchange Rate */}
          {fromValue && toValue && parseFloat(fromValue) > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rate</span>
                <span className="text-gray-700">
                  1 {fromToken.symbol} = {(parseFloat(toValue) / parseFloat(fromValue)).toFixed(6)} {toToken.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <div className="mt-6">
            <Button
              onClick={handleSwap}
              disabled={!activeAccount?.address || !fromValue || parseFloat(fromValue) === 0 || isSwapping}
              className="w-full h-12 text-lg font-semibold"
            >
              {isSwapping ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Swapping...
                </>
              ) : !activeAccount?.address ? (
                "Connect Wallet"
              ) : !fromValue || parseFloat(fromValue) === 0 ? (
                "Enter an amount"
              ) : (
                `Swap ${fromToken.symbol} for ${toToken.symbol}`
              )}
            </Button>
          </div>

          {/* Slippage Settings */}
          <div className="mt-4">
            <label className="text-sm text-gray-500">Slippage Tolerance</label>
            <div className="flex space-x-2 mt-1">
              {[0.1, 0.5, 1.0, 2.0].map((value) => (
                <Button
                  key={value}
                  variant={slippageTolerance === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSlippageTolerance(value)}
                  className="flex-1"
                >
                  {value}%
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onConfirm={executeSwap}
          inputAmount={fromValue}
          outputAmount={toValue}
          inputToken={fromToken.symbol}
          outputToken={toToken.symbol}
          priceImpact={0} // Placeholder
          slippageTolerance={slippageTolerance}
          minimumReceived={0n} // Placeholder
          isLoading={isSwapping}
        />
      </div>
    </div>
  );
};
