"use client";
import { useActiveAccount } from "thirdweb/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const account = useActiveAccount();
  return (
    <div className="flex flex-col">
      <div className="mx-auto">
        <h1 className="text-4xl font-bold">Welcome to</h1>
      </div>
      <div className="mx-auto">
        <Image
          src="/BigDAOLogo2.svg"
          alt="BigDAO"
          width={400}
          height={400}
          priority
        />
      </div>

      {account && (
        <div className="mt-6 text-center">
          You are now logged in. <br />
          <Button className="my-4" asChild>
            <Link href="/tickets-page">Enter</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
