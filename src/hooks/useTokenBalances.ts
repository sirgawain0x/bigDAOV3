import { useState, useEffect, useCallback } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import { getBalance } from "thirdweb/extensions/erc20";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { TOKENS } from "@/lib/tokenConfig";
import { Address } from "thirdweb";

export const useTokenBalances = () => {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeAccount = useActiveAccount();
  const { data: walletBalance } = useWalletBalance({
    chain: base,
    address: activeAccount?.address,
    client,
  });

  const fetchBalances = useCallback(async () => {
    if (!activeAccount?.address) {
      setBalances({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newBalances: Record<string, string> = {};

      // Fetch ETH balance
      if (walletBalance) {
        newBalances.ETH = walletBalance.displayValue;
      }

      // Fetch token balances
      for (const [symbol, token] of Object.entries(TOKENS)) {
        if (symbol === "ETH") continue; // Skip ETH as it's handled above
        
        try {
          const contract = {
            client,
            chain: base,
            address: token.address as Address,
          };
          
          const balance = await getBalance({
            contract,
            address: activeAccount.address,
          });
          
          newBalances[symbol] = balance.displayValue;
        } catch (error) {
          console.error(`Error fetching ${symbol} balance:`, error);
          newBalances[symbol] = "0";
        }
      }

      setBalances(newBalances);
    } catch (err) {
      setError("Failed to fetch balances");
      console.error("Error fetching balances:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeAccount?.address, walletBalance]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const getBalanceForToken = useCallback((symbol: string): string => {
    return balances[symbol] || "0";
  }, [balances]);

  const hasSufficientBalance = useCallback((symbol: string, amount: string): boolean => {
    const balance = getBalanceForToken(symbol);
    return parseFloat(balance) >= parseFloat(amount);
  }, [getBalanceForToken]);

  return {
    balances,
    isLoading,
    error,
    fetchBalances,
    getBalanceForToken,
    hasSufficientBalance,
  };
};
