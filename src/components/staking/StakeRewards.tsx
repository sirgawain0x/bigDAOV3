"use client";
import { useEffect } from "react";
import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";
import { toast } from "sonner";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";

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
    <div className="flex flex-col w-full p-2">
      {!isTokenBalanceLoading && !tokenMetadataLoading && (
        <p>
          {tokenMetadata?.symbol} Balance:{" "}
          {toEther(BigInt(tokenBalance!.toString()))}
        </p>
      )}
      <h2 className="text-lg font-bold mb-5">
        <span className="">{tokenMetadata?.symbol} Earnings:</span>{" "}
        {stakedInfo && toEther(BigInt(stakedInfo[1].toString()))}
      </h2>
      <div className="flex flex-row w-full">
        <TransactionButton
          style={{
            border: "none",
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            width: "100%",
            fontSize: "12px",
          }}
          transaction={() =>
            prepareContractCall({
              contract: STAKING_CONTRACT,
              method: "claimRewards",
            })
          }
          onTransactionSent={(result) => {
            console.log("Claiming rewards...", result.transactionHash);
            toast("Claiming rewards...");
          }}
          onTransactionConfirmed={(receipt) => {
            console.log("Rewards claimed!", receipt.transactionHash);
            refetchStakedInfo();
            refetchTokenBalance();
            toast("Rewards claimed!");
          }}
          onError={(error) => {
            console.error("Transaction error", error);
            toast("Transaction error");
          }}
        >
          Claim Earnings
        </TransactionButton>
      </div>
    </div>
  );
};
