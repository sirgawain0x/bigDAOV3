"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveAccount } from "thirdweb/react";
import { useVoting } from "@/hooks/useVoting";
import { toast } from "sonner";
import { formatEther } from "viem";

interface VoteButtonsProps {
  proposalId: bigint;
  isActive: boolean;
  hasVoted: boolean;
}

export const VoteButtons = ({ proposalId, isActive, hasVoted }: VoteButtonsProps) => {
  const account = useActiveAccount();
  const { useCastVote, useVotingPower } = useVoting();
  
  const [isVoting, setIsVoting] = useState(false);

  // Get user's voting power
  const { data: votingPower } = useVotingPower(
    account?.address || "",
    BigInt(Math.floor(Date.now() / 1000))
  );

  const { castVote: castVoteFor, isPending: isVotingFor } = useCastVote(proposalId, 1);
  const { castVote: castVoteAgainst, isPending: isVotingAgainst } = useCastVote(proposalId, 0);
  const { castVote: castVoteAbstain, isPending: isVotingAbstain } = useCastVote(proposalId, 2);

  const handleVote = async (voteType: 'for' | 'against' | 'abstain') => {
    if (!account?.address) {
      toast.error("Please connect your wallet to vote");
      return;
    }

    if (!votingPower || votingPower === 0n) {
      toast.error("You need BIG tokens to vote");
      return;
    }

    setIsVoting(true);
    try {
      switch (voteType) {
        case 'for':
          await castVoteFor();
          toast.success("Vote cast successfully!");
          break;
        case 'against':
          await castVoteAgainst();
          toast.success("Vote cast successfully!");
          break;
        case 'abstain':
          await castVoteAbstain();
          toast.success("Vote cast successfully!");
          break;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  if (!isActive) {
    return (
      <div className="text-sm text-muted-foreground">
        {hasVoted ? "You have already voted" : "Voting period has ended"}
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-green-600">✓ Voted</span>
        <span className="text-xs text-muted-foreground">
          Power: {votingPower ? formatEther(votingPower) : "0"} BIG
        </span>
      </div>
    );
  }

  const isLoading = isVoting || isVotingFor || isVotingAgainst || isVotingAbstain;

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={() => handleVote('for')}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isVotingFor ? "Voting..." : "For"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleVote('against')}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isVotingAgainst ? "Voting..." : "Against"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleVote('abstain')}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isVotingAbstain ? "Voting..." : "Abstain"}
        </Button>
      </div>
      {votingPower && (
        <div className="text-xs text-muted-foreground">
          Voting Power: {formatEther(votingPower)} BIG
        </div>
      )}
    </div>
  );
};
