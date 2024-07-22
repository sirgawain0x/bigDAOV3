"use client";
import { useReadContract, PayEmbed } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../consts/client";
import { base } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc721";
import NFTCard from "@/components/nft/nft-card";
import Claim721AButton from "./Claim721AButton";

export const TicketContent = () => {
  const ticketContract = getContract({
    client,
    chain: base,
    address: "0x214cDD4C76Aa2A632Cc64AF522326f2a1f191908",
  });

  const { data: firstNFT, isLoading: nftLoading } = useReadContract(getNFT, {
    contract: ticketContract,
    tokenId: BigInt(1), // If your collection does not start at `0` - change this value
  });
  console.log("NFT data", firstNFT);
  return (
    <div className="flex flex-col">
      {!nftLoading && firstNFT && <NFTCard nft={firstNFT} />}
      <div className="max-w-lg mx-auto">
        <PayEmbed
          client={client}
          connectOptions={{
            connectModal: {
              size: "compact",
            },
          }}
          payOptions={{
            prefillBuy: {
              chain: base,
              amount: "0.001",
            },
          }}
        />
      </div>
    </div>
  );
};
