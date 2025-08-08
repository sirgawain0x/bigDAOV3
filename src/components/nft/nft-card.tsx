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
import Claim721AButton from "@/app/tickets-page/Claim721AButton";

type Props = {
  nft: NFT;
};

const NFTCard = ({ nft }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <Card className="w-[80vw]">
        <CardHeader>
          <CardTitle className="mx-auto my-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center">
              Juneteenth Unity Celebration
            </h1>
          </CardTitle>
          <CardDescription className="text-wrap text-center">
            {nft?.metadata.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Claim721AButton />
        </CardContent>
        <CardFooter className="text-xs"></CardFooter>
      </Card>
    </div>
  );
};

export default NFTCard;
