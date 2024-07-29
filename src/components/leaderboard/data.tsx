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
    <>
      <div>
        <div className="relative w-11/12 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[500px] 2xl:h-[500px]">
          <Image
            fill={true}
            //style={{ objectFit: "cover", position: "absolute" }}
            loading="lazy"
            src={metadata.bannerUrl}
            alt="Big DAO Leaderboard"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mx-4 sm:mx-8 md:mx-16 lg:mx-24 my-8 sm:my-12 md:my-16 lg:my-20">
        <div className="mb-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {metadata.name}
          </h1>
        </div>
        <div className="flex flex-col mx-auto items-center justify-center px-14">
          <p className="text-base sm:text-lg md:text-xl text-center">
            {metadata.description}
          </p>
        </div>
        <div className="flex flex-col items-center justify-start mt-4">
          <p className="text-sm sm:text-base md:text-lg">
            {data.length} Members
          </p>
        </div>
      </div>
      <div className="flex flex-col w-4/5 mx-auto mb-12">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
