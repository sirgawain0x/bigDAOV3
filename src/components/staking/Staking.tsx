"use client";
import { useState } from "react";
import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { NFT } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Plus, X } from "lucide-react";

export const Staking = () => {
  const account = useActiveAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isEarnOpen, setIsEarnOpen] = useState(false);

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
      <div>
        <div className="flex flex-row items-center justify-between w-full p-2">
          <p style={{ marginRight: "20px" }}>Buy an Asset.</p>
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
              console.log("Claiming an asset...", result.transactionHash);
              toast("Claiming an asset...");
            }}
            onTransactionConfirmed={(receipt) => {
              console.log("Asset claimed!", receipt.transactionHash);
              toast("Asset claimed!");
              refetchStakedInfo(); // Refetch staked info after claiming
              refetchOwnedNFTs(); // Refetch owned NFTs after claiming
            }}
            onError={(error) => {
              console.error("Transaction error", error);
              toast("Transaction error");
            }}
          >
            Buy to Earn
          </TransactionButton>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />

        {/* New two-column layout */}
        <div className="flex flex-row w-full">
          {/* Left column: Tickets I Own */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="w-60 p-2 cursor-pointer">
              <CollapsibleTrigger asChild>
                <div className="flex flex-row items-center justify-between">
                  <h1 className="text-lg">
                    ({ownedNFTs?.length.toString()}) Assets In Wallet
                  </h1>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col items-center justify-center">
                  {ownedNFTs && ownedNFTs.length > 0 ? (
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
                    <p style={{ margin: "20px" }}>You own 0 Assets.</p>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Right column: My Staked Tickets */}
          <Collapsible open={isEarnOpen} onOpenChange={setIsEarnOpen}>
            <div className="w-60 p-2 cursor-pointer">
              <CollapsibleTrigger asChild>
                <div className="flex flex-row items-center justify-between">
                  <h1 className="text-lg">
                    ({stakedInfo?.[0]?.length.toString()}) Assets In Earn Vault
                  </h1>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col items-center justify-center w-full mx-auto">
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
                    <p style={{ margin: "20px" }}>
                      You have no assets earning yield.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
    );
  }

  return (
    <p style={{ color: "#FFF" }}>
      Connect your wallet to earn yield on your assets.
    </p>
  );
};
