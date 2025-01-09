"use client";

import { useVoting } from "@/hooks/useVoting";
import { useActiveAccount } from "thirdweb/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatEther } from "viem";
import { CreateProposalModal } from "./CreateProposalModal";

const ProposalStateMap = {
  0: { label: "Pending", color: "bg-yellow-500" },
  1: { label: "Active", color: "bg-green-500" },
  2: { label: "Canceled", color: "bg-red-500" },
  3: { label: "Defeated", color: "bg-red-500" },
  4: { label: "Succeeded", color: "bg-green-500" },
  5: { label: "Queued", color: "bg-blue-500" },
  6: { label: "Expired", color: "bg-gray-500" },
  7: { label: "Executed", color: "bg-purple-500" },
};

function ProposalRow({ proposal }: { proposal: any }) {
  const account = useActiveAccount();
  const { useProposalState, useProposalVotes, useHasVoted, useCastVote } = useVoting();

  const { data: state } = useProposalState(BigInt(proposal.proposalId));
  const { data: votes } = useProposalVotes(BigInt(proposal.proposalId));
  const { data: voted } = useHasVoted(BigInt(proposal.proposalId), account?.address || "");
  const { data: isPending } = useHasVoted(BigInt(proposal.proposalId), account?.address || "");

  const stateInfo = ProposalStateMap[state as keyof typeof ProposalStateMap];

  const { castVote: castVoteFor } = useCastVote(BigInt(proposal.proposalId), 1);
  const { castVote: castVoteAgainst } = useCastVote(BigInt(proposal.proposalId), 0);
  const { castVote: castVoteAbstain } = useCastVote(BigInt(proposal.proposalId), 2);

  return (
    <TableRow>
      <TableCell>{proposal.proposalId.toString()}</TableCell>
      <TableCell className="max-w-md truncate">
        {proposal.description}
      </TableCell>
      <TableCell className="font-mono">
        {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
      </TableCell>
      <TableCell>
        <Badge className={stateInfo?.color}>{stateInfo?.label}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1 text-sm">
          <span>For: {formatEther(votes?.[0] || 0n)}</span>
          <span>Against: {formatEther(votes?.[1] || 0n)}</span>
          <span>Abstain: {formatEther(votes?.[2] || 0n)}</span>
        </div>
      </TableCell>
      <TableCell>
        {state === 1 && !voted && (
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={castVoteFor}
              disabled={isPending}
            >
              {isPending ? "Voting..." : "For"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={castVoteAgainst}
              disabled={isPending}
            >
              {isPending ? "Voting..." : "Against"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={castVoteAbstain}
              disabled={isPending}
            >
              {isPending ? "Voting..." : "Abstain"}
            </Button>
          </div>
        )}
        {voted && <Badge variant="secondary">Voted</Badge>}
      </TableCell>
    </TableRow>
  );
}

export function VotingComponent() {
  const { proposals, isLoadingProposals, useProposalThreshold } = useVoting();
  const { data: threshold } = useProposalThreshold();

  if (isLoadingProposals) {
    return <VotingSkeleton />;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4">
      <Card className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Proposal Threshold: {threshold ? formatEther(threshold) : "Loading..."} BIG tokens
          </p>
          <CreateProposalModal />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Proposer</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals?.map((proposal) => (
              <ProposalRow
                key={proposal.proposalId.toString()}
                proposal={proposal}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function VotingSkeleton() {
  return (
    <div className="w-full max-w-[1440px] mx-auto p-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-[50px]" />
              <Skeleton className="h-12 w-[300px]" />
              <Skeleton className="h-12 w-[100px]" />
              <Skeleton className="h-12 w-[80px]" />
              <Skeleton className="h-12 w-[150px]" />
              <Skeleton className="h-12 w-[200px]" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
