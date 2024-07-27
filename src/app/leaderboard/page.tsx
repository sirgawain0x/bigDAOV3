import { StackClient } from "@stackso/js-core";
import Image from "next/image";

// Initialize the client
const stack = new StackClient({
  apiKey: process.env.STACK_API_KEY || "",
  pointSystemId: 2839,
});

// Get the leaderboard data
const leaderboard = await stack.getLeaderboard();

export default function LeaderboardPage() {
  return (
    <div>
      <div className="flex flex-col">
        <div className="mx-auto">
          <Image
            src={leaderboard.metadata.bannerUrl}
            alt="Big DAO banner"
            width={1500}
            height={500}
          />
        </div>
        <div className="flex flex-col items-center justify-center mx-16 my-16">
          <h1 className="text-3xl font-bold">{leaderboard.metadata.name}</h1>
          <p className="text-lg">{leaderboard.metadata.description}</p>
          <div className="flex flex-col items-center justify-start mx-16 my-16">
            <p>{leaderboard.leaderboard.length} Members</p>
          </div>
        </div>
      </div>
    </div>
  );
}
