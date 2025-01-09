"use client";
import { useEffect } from "react";
import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { prepareContractCall, toTokens } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";
import { toast } from "sonner";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { Skeleton } from "@/components/ui/skeleton";

export const StakeRewards = () => {
  const account = useActiveAccount();

  const {
    data: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useReadContract(balanceOf, {
    contract: REWARD_TOKEN_CONTRACT,
    owner: account?.address || "",
  });

  const { data: stakedInfo, refetch: refetchStakedInfo } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: [account?.address || ""],
  });

  // Fetch Token Metadata
  const { data: tokenMetadata, isLoading: tokenMetadataLoading } =
    useReadContract(getCurrencyMetadata, {
      contract: REWARD_TOKEN_CONTRACT,
    });

  useEffect(() => {
    refetchStakedInfo();
    const interval = setInterval(() => {
      refetchStakedInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, [refetchStakedInfo]);

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <div className="bg-background/50 p-4 rounded-lg">
          <div className="text-lg font-medium flex items-center gap-2">
            <span>{tokenMetadata?.symbol} Balance: </span>
            {isTokenBalanceLoading || tokenMetadataLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-bold">
                {Number(toTokens(BigInt(tokenBalance!.toString()), 18)).toFixed(
                  2
                )}
              </span>
            )}
          </div>
        </div>
        <div className="bg-background/50 p-4 rounded-lg">
          <div className="text-lg font-medium flex items-center gap-2">
            <span>{tokenMetadata?.symbol} Rewards: </span>
            {!stakedInfo ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-bold">
                {Number(toTokens(BigInt(stakedInfo[1].toString()), 18)).toFixed(
                  2
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-center">
          <TransactionButton
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/40 rounded-lg transition-colors"
            transaction={() =>
              prepareContractCall({
                contract: STAKING_CONTRACT,
                method: "claimRewards",
                params: [],
              })
            }
            onTransactionSent={(result) => {
              console.log("Claiming rewards...", result.transactionHash);
              const rewardAmount = Number(
                toTokens(BigInt(stakedInfo?.[1].toString() || "0"), 18)
              ).toFixed(2);
              toast.loading(`Claiming ${rewardAmount} ${tokenMetadata?.symbol || ''} rewards...`, {
                id: "claiming-rewards"
              });
            }}
            onTransactionConfirmed={(receipt) => {
              console.log("Rewards claimed!", receipt.transactionHash);
              const rewardAmount = Number(
                toTokens(BigInt(stakedInfo?.[1].toString() || "0"), 18)
              ).toFixed(2);
              refetchStakedInfo();
              refetchTokenBalance();
              toast.success(`Successfully claimed ${rewardAmount} ${tokenMetadata?.symbol || ''} rewards!`, {
                id: "claiming-rewards"
              });
            }}
            onError={(error) => {
              console.error("Transaction error", error);
              toast.error("Transaction failed", {
                id: "claiming-rewards"
              });
            }}
          >
            Claim Earnings
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};
