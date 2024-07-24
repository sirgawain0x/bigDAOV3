"use client";
import { useReadContract } from "thirdweb/react";
import { VOTING_CONTRACT } from "@/lib/contracts";

export const Voting = () => {
  const { data: proposals, isLoading } = useReadContract({
    contract: VOTING_CONTRACT,
    method:
      "function getAllProposals() view returns ((uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)[] allProposals)",
    params: [],
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 style={{ marginBottom: "20px" }} className="text-6xl">
        Voting
      </h1>
      {proposals?.map((proposal: any, index: number) => (
        <div key={index} className="p-4 border rounded-lg shadow-md">
          <h2>{proposal.title}</h2>
          <p>{proposal.description}</p>
          <p>Votes: {proposal.votes || 0}</p>
        </div>
      ))}
    </div>
  );
};
