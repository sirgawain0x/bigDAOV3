"use client";
import { useReadContract } from "thirdweb/react";
import { VOTING_CONTRACT } from "@/lib/contracts";
import { Skeleton } from "../ui/skeleton";

export const Voting = () => {
  const { data: proposals, isLoading } = useReadContract({
    contract: VOTING_CONTRACT,
    method:
      "function getAllProposals() view returns ((uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)[] allProposals)",
    params: [],
  });
  return (
    <>
      {isLoading ? (
        // Display skeleton or loading state here
        <div className="flex items-center space-x-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[550px]" />
            <Skeleton className="h-4 w-[500px]" />
          </div>
        </div>
      ) : (
        proposals?.map((proposal: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <h2>{proposal.title}</h2>
            <p>{proposal.description}</p>
            <p>Votes: {proposal.votes || 0}</p>
          </div>
        ))
      )}
    </>
  );
};
