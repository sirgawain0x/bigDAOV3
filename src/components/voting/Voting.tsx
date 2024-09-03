"use client";
import { useReadContract } from "thirdweb/react";
import { VOTING_CONTRACT } from "@/lib/contracts";
import { getAll } from "thirdweb/extensions/vote";
import { ProposalItem } from "thirdweb/extensions/vote";
import { Skeleton } from "../ui/skeleton";
import { shortenAddress } from "thirdweb/utils";

export const Voting = () => {
  const { data: proposals, isLoading } = useReadContract(getAll, {
    contract: VOTING_CONTRACT,
  });
  const now = BigInt(Math.floor(Date.now() / 1000));
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
        proposals?.map((proposal: ProposalItem) => {
          const borderColor =
            proposal?.votes.for > proposal?.votes.against
              ? "border-green-500"
              : proposal?.votes.against > proposal?.votes.for
              ? "border-red-500"
              : "border-yellow-500";
          return (
            <div
              key={proposal?.proposalId}
              className={`p-4 border rounded-lg shadow-md ${borderColor}`}
            >
              <h2 className="text-lg">
                <span className="font-bold">Author:</span>{" "}
                {shortenAddress(proposal?.proposer)}
              </h2>
              <div className="flex flex-row justify-end gap-4 mb-4">
                {proposal?.endBlock < now ? (
                  <h3 className="text-lg font-bold">Proposal Ended</h3>
                ) : proposal?.startBlock > now ? (
                  <h3 className="text-lg font-bold">Proposal Pending</h3>
                ) : (
                  <h3 className="text-lg font-bold">Proposal Active</h3>
                )}
              </div>

              <p className="mb-4">{proposal?.description}</p>
              <div className="flex flex-row justify-between items-center gap-4">
                <p>For: {String(proposal?.votes.for)}</p>
                <p>Abstain: {String(proposal?.votes.abstain)}</p>
                <p>Against: {String(proposal?.votes.against)}</p>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};
