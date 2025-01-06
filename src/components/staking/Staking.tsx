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
import { Skeleton } from "@/components/ui/skeleton";

const NFTSkeleton = () => (
  <div className="flex flex-col items-center w-full max-w-[200px] mx-auto">
    <Skeleton className="rounded-lg mb-4 h-[200px] w-[200px]" />
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-4 space-y-4 sm:space-y-0">
          <p className="text-lg sm:text-xl font-medium">Buy an Asset</p>
          <TransactionButton
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/40 rounded-lg transition-colors"
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
              refetchStakedInfo();
              refetchOwnedNFTs();
            }}
            onError={(error) => {
              console.error("Transaction error", error);
              toast("Transaction error");
            }}
          >
            Buy to Earn
          </TransactionButton>
        </div>
        <hr className="w-full border-t border-border my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Left column: Owned Assets */}
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg cursor-pointer hover:bg-background/60 transition-colors">
                <h2 className="text-lg font-semibold">
                  ({ownedNFTs?.length.toString()}) Assets In Wallet
                </h2>
                <ChevronDown
                  className="h-5 w-5 transition-transform duration-200"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="flex flex-col items-center justify-center w-full gap-4">
                {ownedNFTsLoading ? (
                  <>
                    <NFTSkeleton />
                    <NFTSkeleton />
                  </>
                ) : ownedNFTs && ownedNFTs.length > 0 ? (
                  ownedNFTs
                    .filter((nft: NFT) => !stakedInfo?.[0]?.includes(nft.id)) // Filter out staked NFTs
                    .map((nft: NFT) => (
                      <div key={nft.id} className="w-full max-w-sm mx-auto">
                        <NFTCard
                          nft={nft}
                          refetchOwnedNFTs={refetchOwnedNFTs}
                          refetchStakedInfo={refetchStakedInfo}
                        />
                      </div>
                    ))
                ) : (
                  <p className="text-center py-4">You own 0 Assets.</p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Right column: My Staked Tickets */}
          <Collapsible
            open={isEarnOpen}
            onOpenChange={setIsEarnOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg cursor-pointer hover:bg-background/60 transition-colors">
                <h2 className="text-lg font-semibold">
                  ({stakedInfo?.[0]?.length.toString()}) Assets In Earn Vault
                </h2>
                <ChevronDown
                  className="h-5 w-5 transition-transform duration-200"
                  style={{
                    transform: isEarnOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="flex flex-col items-center justify-center w-full gap-4">
                {!stakedInfo ? (
                  <>
                    <NFTSkeleton />
                    <NFTSkeleton />
                  </>
                ) : stakedInfo[0].length > 0 ? (
                  stakedInfo[0].map((nft: any, index: number) => (
                    <div key={index} className="w-full max-w-sm mx-auto">
                      <StakedNFTCard
                        tokenId={nft}
                        refetchStakedInfo={refetchStakedInfo}
                        refetchOwnedNFTs={refetchOwnedNFTs}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">You have no assets earning yield.</p>
                )}
              </div>
            </CollapsibleContent>
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
