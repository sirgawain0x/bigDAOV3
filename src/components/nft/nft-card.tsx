"use client";
import { MediaRenderer } from "thirdweb/react";
import type { NFT } from "thirdweb";
import { client } from "@/app/consts/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  nft: NFT;
};

const NFTCard = ({ nft }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-[90vw]">
        <CardHeader>
          <CardTitle className="mx-auto">{nft?.metadata.name}</CardTitle>
          <CardDescription className="text-wrap text-center">
            {nft?.metadata.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <MediaRenderer client={client} src={nft?.metadata.image} />
        </CardContent>
        <CardFooter className="text-xs"></CardFooter>
      </Card>
    </div>
  );
};

export default NFTCard;