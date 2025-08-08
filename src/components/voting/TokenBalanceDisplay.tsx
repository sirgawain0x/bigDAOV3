"use client";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT } from "@/lib/contracts";
import { balanceOf } from "thirdweb/extensions/erc20";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const TokenBalanceDisplay = () => {
  const account = useActiveAccount();

  // Debug wallet connection
  console.log("TokenBalanceDisplay - useActiveAccount result:", {
    account,
    hasAccount: !!account,
    address: account?.address,
  });
  
  const { data: bigTokenBalance, isLoading, error } = useReadContract({
    contract: REWARD_TOKEN_CONTRACT,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: {
      enabled: !!account?.address,
    },
  });

  // Debug logging
  console.log("TokenBalanceDisplay Debug:", {
    accountAddress: account?.address,
    accountConnected: !!account,
    bigTokenBalance: bigTokenBalance?.toString(),
    isLoading,
    error: error?.message || error,
    errorType: error?.constructor?.name,
    contractAddress: REWARD_TOKEN_CONTRACT?.address,
    hasMinimumTokens: bigTokenBalance && bigTokenBalance >= BigInt("10000000000000000000000"),
    queryEnabled: !!account?.address && !!REWARD_TOKEN_CONTRACT,
  });

  const hasMinimumTokens = bigTokenBalance && bigTokenBalance >= BigInt("10000000000000000000000"); // 10,000 tokens in wei

  if (!account?.address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Connect your wallet to view your BIG token balance and participate in governance.
          </p>
          <p className="text-xs text-blue-600">
            💡 Look for the Connect button in the top navigation bar
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Failed to load token balance. Please try refreshing the page.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Error: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your BIG Token Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {bigTokenBalance ? formatEther(bigTokenBalance) : "0"} BIG
            </div>
            <div className="text-sm text-muted-foreground">
              Minimum required for proposals: 10,000 BIG
            </div>
            {bigTokenBalance && (
              <div className={`text-sm ${hasMinimumTokens ? 'text-green-600' : 'text-red-600'}`}>
                {hasMinimumTokens ? '✓ Eligible to create proposals' : '✗ Insufficient tokens for proposals'}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
