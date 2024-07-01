import { cookies } from "next/headers";
import { thirdwebAuth } from "../consts/thirdwebAuth";
import React, { useEffect, useState } from "react";
import type { NFT } from "thirdweb";
import Link from "next/link";
import NFTCard from "@/components/nft/nft-card";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { TicketContent } from "./TicketsContent";

export default async function Tickets() {
  const MustLogin = () => (
    <div className="text-center">
      You are not logged in. <br />
      <Button className="my-4" asChild>
        <Link href={"/"}>Log In Now</Link>
      </Button>
    </div>
  );

  const reason = "you are not signed in"; // replace this with your own reason

  const NotAllowed = () => (
    <div className="text-center">
      You are logged in but you do not have access to this page because {reason}
      .
      <br />
      <Button className="my-4 mx-2" asChild>
        <Link href={"/tickets-page"}>Buy A Ticket</Link>
      </Button>
      <Button className="my-4 mx-2" asChild>
        <Link href={"/"}>Return Home</Link>
      </Button>
    </div>
  );

  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    return <MustLogin />;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  console.log({ authResult });
  if (!authResult.valid) {
    return <MustLogin />;
  }

  // If the user has logged in, get their wallet address
  const address = authResult.parsedJWT.sub;
  console.log({ paredResult: authResult.parsedJWT });
  if (!address) return <NotAllowed />;
  // Finally! We can load the gated content for them now
  return <TicketContent />;
}
