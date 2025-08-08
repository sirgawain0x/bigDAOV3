import { useState, useEffect } from "react";
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
import { REWARD_TOKEN_CONTRACT } from "@/lib/contracts";
import { parseEther } from "viem";
import { toast } from "sonner";
import { VOTING_CONTRACT } from "@/lib/contracts";

export function CreateProposalModal() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [value, setValue] = useState("");
  const [calldata, setCalldata] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const account = useActiveAccount();
  const { usePropose, useVotingPower } = useVoting();
  const { propose, isPending: isProposePending, error: proposeError } = usePropose();

  // Fetch current block number
  const [currentBlock, setCurrentBlock] = useState<bigint | undefined>(
    undefined
  );
  useEffect(() => {
    async function fetchBlockNumber() {
      if (!VOTING_CONTRACT) return;
      try {
        // Use a simple approach - just use a recent block number or current timestamp
        setCurrentBlock(BigInt(Date.now())); // Temporary solution
      } catch (error) {
        console.error("Error fetching block number:", error);
      }
    }
    fetchBlockNumber();
  }, []);

  // Get user's BIG token balance directly
  const { data: bigTokenBalance, isLoading: isBalanceLoading } = useReadContract({
    contract: REWARD_TOKEN_CONTRACT,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: {
      enabled: !!account?.address && !!REWARD_TOKEN_CONTRACT,
    },
  });

  // Get user's voting power using the current block number
  const { data: votingPower } = useVotingPower(
    account?.address || "",
    currentBlock ?? 0n
  );

  // Check if user has minimum 10,000 BIG tokens (changed from 100,000)
  const hasEnoughTokens = bigTokenBalance && bigTokenBalance >= parseEther("10000");
  const minimumRequired = parseEther("10000");

  // Check if user has enough voting power
  const hasEnoughVotingPower = votingPower && votingPower >= parseEther("10000");

  // Debug logging (after votingPower is declared)
  console.log("CreateProposalModal Debug:", {
    accountAddress: account?.address,
    bigTokenBalance: bigTokenBalance?.toString(),
    isBalanceLoading,
    hasEnoughTokens: bigTokenBalance && bigTokenBalance >= parseEther("10000"),
    votingPower: votingPower?.toString(),
    hasEnoughVotingPower: votingPower && votingPower >= parseEther("10000"),
    minimumRequired: parseEther("10000").toString(),
    contractAddress: REWARD_TOKEN_CONTRACT?.address,
  });

  // Handle propose error
  useEffect(() => {
    if (proposeError) {
      console.error("Propose error:", proposeError);
      toast.error(`Failed to create proposal: ${proposeError.message || "Unknown error"}`);
      setIsSubmitting(false);
    }
  }, [proposeError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account?.address) {
      toast.error("Please connect your wallet");
      return;
    }
    
    if (!hasEnoughTokens) {
      toast.error("You need at least 10,000 BIG tokens to create a proposal");
      return;
    }

    if (!hasEnoughVotingPower) {
      toast.error("You need at least 10,000 voting power to create a proposal");
      return;
    }

    if (!target || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate target address
    if (!target.startsWith("0x") || target.length !== 42) {
      toast.error("Please enter a valid contract address");
      return;
    }

    // Validate calldata
    if (calldata && !calldata.match(/^[0-9a-fA-F]+$/)) {
      toast.error("Please enter valid calldata (hexadecimal without 0x prefix)");
      return;
    }

    setIsSubmitting(true);

    try {
      const targets = [target.startsWith("0x") ? target : `0x${target}`];
      const values = [parseEther(value || "0")];
      const calldatas = [`0x${calldata}`];

      console.log("Submitting proposal with:", {
        targets,
        values: values.map(v => v.toString()),
        calldatas,
        description,
        accountAddress: account.address
      });

      // Validate that we have a valid voting contract
      if (!VOTING_CONTRACT) {
        throw new Error("Voting contract not initialized");
      }

      const result = propose(targets as `0x${string}`[], values as bigint[], calldatas as `0x${string}`[], description);
      
      console.log("Proposal result:", result);
      toast.success("Proposal created successfully!");
      setOpen(false);
      // Reset form
      setDescription("");
      setTarget("");
      setValue("");
      setCalldata("");
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to create proposal";
      if (error.message?.includes("execution reverted")) {
        errorMessage = "Transaction reverted. This could be due to insufficient voting power or invalid parameters.";
      } else if (error.message?.includes("insufficient voting power")) {
        errorMessage = "Insufficient voting power to create proposal. You need at least 10,000 BIG tokens.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !hasEnoughTokens || !hasEnoughVotingPower || isSubmitting || isProposePending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasEnoughTokens && hasEnoughVotingPower ? "default" : "secondary"}
          disabled={!account?.address}
        >
          Create Proposal
          {!hasEnoughTokens && account?.address && " (Need 10k BIG)"}
          {!hasEnoughVotingPower && hasEnoughTokens && account?.address && " (Need 10k BIG)"}
          {!account?.address && " (Connect Wallet)"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your proposal..."
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target Wallet Address *</Label>
            <Input
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x..."
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value (in BIG)</Label>
            <Input
              id="value"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.0"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calldata">Calldata (hex)</Label>
            <Input
              id="calldata"
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              placeholder="Enter calldata without 0x prefix"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isDisabled}
          >
            {isSubmitting || isProposePending ? "Creating Proposal..." : "Submit Proposal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
