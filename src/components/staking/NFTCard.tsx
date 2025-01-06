import { client } from "@/app/consts/client";
import { NFT, prepareContractCall } from "thirdweb";
import { MediaRenderer, TransactionButton } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";
import { toast } from "sonner";

type OwnedNFTsProps = {
  nft: NFT;
  refetchOwnedNFTs: () => void;
  refetchStakedInfo: () => void;
};

export const NFTCard = ({
  nft,
  refetchOwnedNFTs,
  refetchStakedInfo,
}: OwnedNFTsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div className="flex flex-col items-center w-full max-w-[200px] mx-auto">
      <MediaRenderer
        client={client}
        src={nft.metadata.image}
        className="rounded-lg mb-4 h-[200px] w-[200px] object-cover"
      />
      <p className="text-center mb-4">{nft.metadata.name}</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/40 rounded-lg transition-colors"
      >
        Earn
      </button>
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-1000"
        >
          <div
            className="min-w-[300px] bg-[#222] p-4 rounded-lg flex flex-col items-center"
          >
            <div className="flex justify-end w-full">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border-none bg-transparent text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <h3 className="mb-4 text-white">You&apos;re about to stake:</h3>
            <MediaRenderer
              client={client}
              src={nft.metadata.image}
              className="rounded-lg mb-4"
            />
            {!isApproved ? (
              <TransactionButton
                transaction={() =>
                  approve({
                    contract: NFT_CONTRACT,
                    to: STAKING_CONTRACT.address,
                    tokenId: nft.id,
                  })
                }
                className="w-full"
                onTransactionConfirmed={() => setIsApproved(true)}
              >
                Approve
              </TransactionButton>
            ) : (
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: STAKING_CONTRACT,
                    method: "stake",
                    params: [[nft.id]],
                  })
                }
                onTransactionConfirmed={(receipt) => {
                  toast("Your asset is staked!");
                  console.log("Asset staked!", receipt.transactionHash);
                  setIsModalOpen(false);
                  refetchOwnedNFTs();
                  refetchStakedInfo();
                }}
                className="w-full"
              >
                Earn Yield
              </TransactionButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
