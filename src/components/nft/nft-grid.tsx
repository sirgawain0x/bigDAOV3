import type { NFT as NFTType } from "thirdweb";
import NFTCard from "./nft-card";
import { Skeleton } from "../ui/skeleton";

type Props = {
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnClickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  isLoading,
  data,
  overrideOnClickBehavior,
  emptyText = "No Artifakts Found.",
}: Props) {
  return (
    <div className="grid-template-column gap-4">
      {isLoading ? (
        [...Array(20)].map((_, index) => <Skeleton key={index} />)
      ) : data && data.length > 0 ? (
        data.map((nft, index) => (
          <div key={index}>
            <NFTCard nft={nft} />
          </div>
        ))
      ) : (
        <div className="flex items-center space-x-4">{emptyText}</div>
      )}
    </div>
  );
}
