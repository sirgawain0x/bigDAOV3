import {
  MediaRenderer,
  TransactionButton,
  useReadContract,
} from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/lib/contracts";
import { getNFT } from "thirdweb/extensions/erc721";
import { client } from "@/app/consts/client";
import { prepareContractCall } from "thirdweb";
import { toast } from "sonner";
import { getReadableError, isUserRejectedError } from "@/lib/utils";

type StakedNFTCardProps = {
  tokenId: bigint;
  refetchStakedInfo: () => void;
  refetchOwnedNFTs: () => void;
};

export const StakedNFTCard: React.FC<StakedNFTCardProps> = ({
  tokenId,
  refetchStakedInfo,
  refetchOwnedNFTs,
}) => {
  const { data: nft } = useReadContract(getNFT, {
    contract: NFT_CONTRACT,
    tokenId: tokenId,
  });

  return (
    <div className="flex flex-col items-center w-full max-w-[200px] mx-auto">
      <MediaRenderer
        client={client}
        src={nft?.metadata.image}
        className="rounded-lg mb-4 h-[200px] w-[200px] object-cover"
      />
      <p className="text-center mb-4">{nft?.metadata.name}</p>
      <TransactionButton
        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/40 rounded-lg transition-colors"
        transaction={() =>
          prepareContractCall({
            contract: STAKING_CONTRACT,
            method: "withdraw",
            params: [[tokenId]],
          })
        }
        onTransactionSent={(result) => {
          console.log("Withdrawing asset...", result.transactionHash);
          toast("Withdrawing asset...");
        }}
        onTransactionConfirmed={(receipt) => {
          console.log("Asset has been withdrawn!", receipt.transactionHash);
          refetchOwnedNFTs();
          refetchStakedInfo();
          toast("Your asset has been withdrawn!");
        }}
        onError={(error) => {
          if (isUserRejectedError(error)) {
            toast("Withdrawal canceled");
            return;
          }
          console.error("Transaction error", error);
          toast.error(getReadableError(error, "Withdrawal failed"));
        }}
      >
        Withdraw
      </TransactionButton>
    </div>
  );
};
