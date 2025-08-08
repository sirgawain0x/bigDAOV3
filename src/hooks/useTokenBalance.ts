"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT } from "@/lib/contracts";
import { formatUnits } from "viem";

type UseTokenBalanceResult = {
  balance: bigint | null;
  formatted: string;
  decimals: number | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const useTokenBalance = (): UseTokenBalanceResult => {
  const activeAccount = useActiveAccount();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [decimals, setDecimals] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDecimals = useCallback(async () => {
    try {
      const tokenDecimals = (await readContract({
        contract: REWARD_TOKEN_CONTRACT,
        method: "function decimals() view returns (uint8)",
      })) as number;
      setDecimals(tokenDecimals);
    } catch (err) {
      setError("Failed to read token decimals");
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    if (!activeAccount?.address) {
      setBalance(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const value = (await readContract({
        contract: REWARD_TOKEN_CONTRACT,
        method: "function balanceOf(address account) view returns (uint256)",
        params: [activeAccount.address],
      })) as bigint;
      setBalance(value);
    } catch (err) {
      setError("Failed to read token balance");
    } finally {
      setIsLoading(false);
    }
  }, [activeAccount?.address]);

  const refresh = useCallback(async () => {
    if (decimals === null) {
      await fetchDecimals();
    }
    await fetchBalance();
  }, [decimals, fetchDecimals, fetchBalance]);

  useEffect(() => {
    // Initial fetch on mount or when account changes
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount?.address]);

  // Optional periodic refresh to keep balance fresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      refresh();
    }, 30_000);
    return () => clearInterval(intervalId);
  }, [refresh]);

  const formatted = useMemo(() => {
    if (balance === null || decimals === null) return "-";
    const value = formatUnits(balance, decimals);
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return value;
    return numeric.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }, [balance, decimals]);

  return { balance, formatted, decimals, isLoading, error, refresh };
};


