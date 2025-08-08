"use client";
import { useReadContract, BuyWidget, useActiveAccount } from "thirdweb/react";
import { getContract, toWei, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { client } from "../consts/client";
import { base } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc721";
import NFTCard from "@/components/nft/nft-card";

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

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="max-w-lg mx-auto">
        {!nftLoading && firstNFT && <NFTCard nft={firstNFT} />}
      </div>
      {/* <div className="max-w-lg mx-auto">
        <BuyWidget
          client={client}
          chain={base}
          tokenAddress={NATIVE_TOKEN_ADDRESS} // USDC on Base
          amount="0.002" // top up 5 USDC by default (user can change this)
          title="Get Funds"
          description="Top up your wallet with crypto"
          onSuccess={() => {
            alert("Top up successful!");
          }}
        />
      </div> */}
    </div>
  );
};
