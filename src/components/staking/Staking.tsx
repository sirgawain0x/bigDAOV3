"use client";
import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { StakeRewards } from "./StakeRewards";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { NFT } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";
import { toast } from "sonner";

export const Staking = () => {
  const account = useActiveAccount();

  const {
    data: ownedNFTs,
    isLoading: ownedNFTsLoading,
    refetch: refetchOwnedNFTs,
  } = useReadContract(getOwnedNFTs, {
    contract: NFT_CONTRACT,
    owner: account?.address || "",
  });

  const { data: stakedInfo, refetch: refetchStakedInfo } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: [account?.address || ""],
  });

  if (account) {
    return (
      <div
        className="flex flex-col items-center justify-center border rounded-lg w-10/12"
        style={{
          backgroundColor: "#151515",
        }}
      >
        <div className="flex flex-row items-center justify-between w-full p-2">
          <h2 style={{ marginRight: "20px", color: "#FFF" }}>
            Claim to Stake 👉🏽
          </h2>
          <TransactionButton
            style={{
              fontSize: "12px",
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
            transaction={() =>
              claimTo({
                contract: NFT_CONTRACT,
                to: account?.address || "",
                quantity: BigInt(1),
              })
            }
            onTransactionSent={(result) => {
              console.log("Claiming a ticket...", result.transactionHash);
              toast("Claiming a ticket...");
            }}
            onTransactionConfirmed={(receipt) => {
              console.log("Ticket claimed!", receipt.transactionHash);
              toast("Ticket claimed!");
              refetchStakedInfo(); // Refetch staked info after claiming
              refetchOwnedNFTs(); // Refetch owned NFTs after claiming
            }}
            onError={(error) => {
              console.error("Transaction error", error);
              toast("Transaction error");
            }}
          >
            Claim Ticket
          </TransactionButton>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />
        <div className="p-2 w-full">
          <h2 style={{ color: "#FFF" }}>Owned Tickets</h2>
          <div className="flex flex-row items-center justify-between w-full mx-auto">
            {ownedNFTs ? (
              ownedNFTs
                .filter((nft: NFT) => !stakedInfo?.[0]?.includes(nft.id)) // Filter out staked NFTs
                .map((nft: NFT) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    refetchOwnedNFTs={refetchOwnedNFTs}
                    refetchStakedInfo={refetchStakedInfo}
                  />
                ))
            ) : (
              <p style={{ color: "#FFF" }}>You own 0 Tickets.</p>
            )}
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />
        <div className="p-2 w-full">
          <h2 style={{ color: "#FFF" }}>Staked NFTs</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "500px",
            }}
          >
            {stakedInfo && stakedInfo[0].length > 0 ? (
              stakedInfo[0].map((nft: any, index: number) => (
                <StakedNFTCard
                  key={index}
                  tokenId={nft}
                  refetchStakedInfo={refetchStakedInfo}
                  refetchOwnedNFTs={refetchOwnedNFTs}
                />
              ))
            ) : (
              <p style={{ margin: "20px", color: "#FFF" }}>
                You have no staked NFTs.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <p style={{ color: "#FFF" }}>Connect your wallet to stake NFTs.</p>;
};
