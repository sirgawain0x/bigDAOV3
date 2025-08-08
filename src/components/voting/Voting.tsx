"use client";
import { useReadContract } from "thirdweb/react";
import { VOTING_CONTRACT } from "@/lib/contracts";
import { getAll } from "thirdweb/extensions/vote";
import { ProposalItem } from "thirdweb/extensions/vote";
import { Skeleton } from "../ui/skeleton";
import { shortenAddress } from "thirdweb/utils";
import { CreateProposalModal } from "./CreateProposalModal";
import { VoteButtons } from "./VoteButtons";
import { TokenBalanceDisplay } from "./TokenBalanceDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useActiveAccount } from "thirdweb/react";
import { useVoting } from "@/hooks/useVoting";

export const Voting = () => {
  const { data: proposals, isLoading } = useReadContract(getAll, {
    contract: VOTING_CONTRACT,
  });
  const now = BigInt(Math.floor(Date.now() / 1000));
  const account = useActiveAccount();
  
  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Token Balance Display */}
      <TokenBalanceDisplay />

      {/* Create Proposal Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Create New Proposal</span>
            <CreateProposalModal />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            BIG token holders with a minimum of 10,000 tokens can create governance proposals.
          </p>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Proposals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            // Display skeleton or loading state here
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : proposals && proposals.length > 0 ? (
            proposals.map((proposal: ProposalItem) => {
              const borderColor =
                proposal?.votes.for > proposal?.votes.against
                  ? "border-green-500"
                  : proposal?.votes.against > proposal?.votes.for
                  ? "border-red-500"
                  : "border-yellow-500";
              
              const isActive = proposal?.startBlock <= now && proposal?.endBlock > now;
              
              return (
                <div
                  key={proposal?.proposalId}
                  className={`p-4 border rounded-lg shadow-md ${borderColor} bg-card overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h2 className="text-lg font-semibold break-words">
                      <span className="font-bold">Author:</span>{" "}
                      {shortenAddress(proposal?.proposer)}
                    </h2>
                    <div className="flex flex-row justify-end flex-shrink-0">
                      {proposal?.endBlock < now ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium whitespace-nowrap">
                          Proposal Ended
                        </span>
                      ) : proposal?.startBlock > now ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium whitespace-nowrap">
                          Proposal Pending
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium whitespace-nowrap">
                          Proposal Active
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mb-4 text-muted-foreground break-words leading-relaxed">{proposal?.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-sm">
                    <div className="flex flex-col gap-2">
                      <p className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-green-600">✓</span>
                        <span className="font-medium">For:</span> {String(proposal?.votes.for)}
                      </p>
                      <p className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-yellow-600">○</span>
                        <span className="font-medium">Abstain:</span> {String(proposal?.votes.abstain)}
                      </p>
                      <p className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-red-600">✗</span>
                        <span className="font-medium">Against:</span> {String(proposal?.votes.against)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground break-all max-w-full">
                      <span className="font-medium">Proposal ID:</span> {proposal?.proposalId?.toString()}
                    </div>
                  </div>
                  
                  {/* Voting Section */}
                  <div className="mt-4 pt-4 border-t">
                    <VoteButtons
                      proposalId={proposal?.proposalId || 0n}
                      isActive={isActive}
                      hasVoted={false} // We'll handle this in the VoteButtons component
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No proposals found.</p>
              <p className="text-sm mt-2">Be the first to create a proposal!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
