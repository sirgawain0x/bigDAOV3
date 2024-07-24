"use client";

import { base } from "thirdweb/chains";
import { client } from "@/app/consts/client";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { StakeRewards } from "./StakeRewards";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { NFT } from "thirdweb";
import { useEffect, useState } from "react";
import {
  claimTo,
  getNFTs,
  ownerOf,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";
import { toast } from "sonner";

export const Staking = () => {
  const account = useActiveAccount();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

  const getOwnedNFTs = async () => {
    let ownedNFTs: NFT[] = [];

    const totalNFTSupply = await totalSupply({
      contract: NFT_CONTRACT,
    });
    const nfts = await getNFTs({
      contract: NFT_CONTRACT,
      start: 0,
      count: parseInt(totalNFTSupply.toString()),
    });

    for (let nft of nfts) {
      const owner = await ownerOf({
        contract: NFT_CONTRACT,
        tokenId: nft.id,
      });
      if (owner === account?.address) {
        ownedNFTs.push(nft);
      }
    }
    setOwnedNFTs(ownedNFTs);
  };

  useEffect(() => {
    if (account) {
      getOwnedNFTs();
    }
  }, [account]);

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
            transaction={() =>
              claimTo({
                contract: NFT_CONTRACT,
                to: account?.address || "",
                quantity: BigInt(1),
              })
            }
            onTransactionConfirmed={() => {
              alert("NFT claimed!");
              toast("NFT claimed!");
              getOwnedNFTs();
            }}
            style={{
              fontSize: "12px",
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "10px",
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "500px",
            }}
          >
            {ownedNFTs && ownedNFTs.length > 0 ? (
              ownedNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  refetch={getOwnedNFTs}
                  refecthStakedInfo={refetchStakedInfo}
                />
              ))
            ) : (
              <p style={{ color: "#FFF" }}>You own 0 Tickets</p>
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
                  refetchOwnedNFTs={getOwnedNFTs}
                />
              ))
            ) : (
              <p style={{ margin: "20px", color: "#FFF" }}>
                No ticket's staked
              </p>
            )}
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />
        <StakeRewards />
      </div>
    );
  }
};
