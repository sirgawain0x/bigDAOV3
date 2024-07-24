import { useReadContract } from "thirdweb/react";
import { Voting } from "@/components/voting/Voting";

export default function VotePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 style={{ marginBottom: "20px" }} className="text-6xl">
        The Board
      </h1>
      <Voting />
    </div>
  );
}
