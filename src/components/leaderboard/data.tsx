"use client";

import { useEffect, useState } from "react";
import { Points, columns } from "@/components/leaderboard/columns";
import { DataTable } from "@/components/leaderboard/data-table";
import Image from "next/image";
import { StackClient } from "@stackso/js-core";

// Initialize the client
const stack = new StackClient({
  apiKey: `${process.env.NEXT_PUBLIC_STACK_API_KEY}`, // Use NEXT_PUBLIC_ prefix for client-side env vars
  pointSystemId: 2839,
});

interface LeaderboardItem {
  uniqueId: number;
  address: string;
  points: number;
  identities?: [{}];
}

interface LeaderboardProps {
  leaderboard: {
    leaderboard: LeaderboardItem[];
    metadata: {
      bannerUrl: string;
      name: string;
      description: string;
    };
  };
}

export default function LeaderboardPage() {
  const [data, setData] = useState<Points[]>([]);
  const [metadata, setMetadata] = useState({
    bannerUrl: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const leaderboard = await stack.getLeaderboard();
      setData(
        leaderboard.leaderboard.map((item, i) => ({
          uniqueId: i + 1, // Ensure unique IDs start at 1
          address: item.address,
          points: item.points,
          identities: item.identities,
        }))
      );
      setMetadata({
        bannerUrl: leaderboard.metadata.bannerUrl,
        name: leaderboard.metadata.name,
        description: leaderboard.metadata.description,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="mx-auto">
        <Image
          src={metadata.bannerUrl}
          alt="Big DAO banner"
          width={1500}
          height={500}
        />
      </div>
      <div className="flex flex-col items-center justify-center mx-16 my-16">
        <h1 className="text-3xl font-bold">{metadata.name}</h1>
        <p className="text-lg">{metadata.description}</p>
        <div className="flex flex-col items-center justify-start mx-16 my-16">
          <p>{data.length} Members</p>
        </div>
      </div>
      <div className="mx-16">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
