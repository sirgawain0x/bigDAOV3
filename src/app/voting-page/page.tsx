import { useReadContract } from "thirdweb/react";
import { Voting } from "@/components/voting/Voting";

export default function VotePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: "20px" }} className="text-6xl">
        The Board
      </h1>
      <Voting />
    </div>
  );
}
