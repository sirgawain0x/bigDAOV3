"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useVoting } from "@/hooks/useVoting";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TOKEN_ADDRESS } from "@/lib/contracts";
import { formatEther, parseEther } from "viem";
import { toast } from "sonner";

export function CreateProposalModal() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [value, setValue] = useState("");
  const [calldata, setCalldata] = useState("");

  const account = useActiveAccount();
  const { usePropose, useVotingPower } = useVoting();
  const { propose } = usePropose();

  // Get user's voting power
  const { data: votingPower } = useVotingPower(
    account?.address || "",
    BigInt(0) // current block
  );

  const hasEnoughTokens = votingPower && votingPower >= parseEther("100000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.address) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!hasEnoughTokens) {
      toast.error("You need at least 100,000 BIG tokens to create a proposal");
      return;
    }

    try {
      await propose(
        [target], // targets
        [parseEther(value || "0")], // values
        [`0x${calldata}`], // calldatas
        description // description
      );
      toast.success("Proposal created successfully!");
      setOpen(false);
      // Reset form
      setDescription("");
      setTarget("");
      setValue("");
      setCalldata("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create proposal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasEnoughTokens ? "default" : "secondary"}
          disabled={!hasEnoughTokens}
        >
          Create Proposal
          {!hasEnoughTokens && " (Need 100k BIG)"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your proposal..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target Contract Address</Label>
            <Input
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value (in ETH)</Label>
            <Input
              id="value"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calldata">Calldata (hex)</Label>
            <Input
              id="calldata"
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              placeholder="Enter calldata without 0x prefix"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Proposal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
