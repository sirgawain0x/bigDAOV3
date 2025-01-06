"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { base } from "thirdweb/chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useActiveAccount,
  useWalletBalance,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { prepareContractCall, type PreparedTransaction } from "thirdweb";
import { type AbiFunction } from "abitype";
import { client } from "@/app/consts/client";
import { DEX_CONTRACT } from "@/lib/contracts";
import { useLiquidity } from "@/hooks/useLiquidity";
import { formatEther, parseEther } from "viem";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Account } from "thirdweb/wallets";

export default function LiquidityPanel() {
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [lpAmountToRemove, setLpAmountToRemove] = useState("");
  const [removing, setRemoving] = useState(false);
  const activeAccount = useActiveAccount();
  const { toast } = useToast();

  const { liquidityInfo, loading, calculatePriceImpact } = useLiquidity();

  const { mutate: sendTransaction } = useSendTransaction();
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);

  // Get user's ETH balance
  const { data: ethBalance } = useWalletBalance({
    client,
    chain: base,
    address: activeAccount?.address as string,
  });

  const handleAddLiquidity = async () => {
    if (!ethAmount || !tokenAmount) {
      toast({
        title: "Error",
        description: "Please enter both ETH and token amounts",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingLiquidity(true);
      const ethValue = parseEther(ethAmount);
      const tokenValue = parseEther(tokenAmount);

      const addLiquiditytransaction = await prepareContractCall({
        contract: DEX_CONTRACT,
        method: "addLiquidity",
        params: [tokenValue],
        value: ethValue,
      }) as PreparedTransaction<[], AbiFunction>;

      await sendTransaction(addLiquiditytransaction);

      toast({
        title: "Success",
        description: "Liquidity added successfully",
      });

      // Reset form
      setEthAmount("");
      setTokenAmount("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add liquidity",
        variant: "destructive",
      });
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!liquidityInfo?.lpBalance) {
      toast({
        title: "Error",
        description: "No liquidity to remove",
        variant: "destructive",
      });
      return;
    }

    if (!lpAmountToRemove) {
      toast({
        title: "Error",
        description: "Please enter an amount to remove",
        variant: "destructive",
      });
      return;
    }

    const removeAmount = parseEther(lpAmountToRemove);
    if (removeAmount > liquidityInfo.lpBalance) {
      toast({
        title: "Error",
        description: "Amount exceeds your LP token balance",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRemovingLiquidity(true);
      const removeLiquiditytransaction = await prepareContractCall({
        contract: DEX_CONTRACT,
        method: "removeLiquidity",
        params: [removeAmount],
      }) as PreparedTransaction<[], AbiFunction>;

      await sendTransaction(removeLiquiditytransaction);

      toast({
        title: "Success",
        description: "Liquidity removed successfully",
      });

      // Reset form
      setLpAmountToRemove("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove liquidity",
        variant: "destructive",
      });
    } finally {
      setIsRemovingLiquidity(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Liquidity Info</CardTitle>
          <CardDescription>Please wait...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity Pool</CardTitle>
        <CardDescription>
          Add or remove liquidity from the ETH-BIG pool
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!removing ? (
            <>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="ETH Amount"
                  value={ethAmount}
                  onChange={(e: any) => setEthAmount(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="BIG Amount"
                  value={tokenAmount}
                  onChange={(e: any) => setTokenAmount(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAddLiquidity}
                disabled={isAddingLiquidity}
              >
                {isAddingLiquidity ? "Adding Liquidity..." : "Add Liquidity"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Your LP Token Balance:
                </p>
                <p className="text-lg font-bold">
                  {liquidityInfo?.userShare} LP
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="lpAmount" className="text-sm font-medium">
                  Amount to Remove
                </label>
                <Input
                  id="lpAmount"
                  type="number"
                  placeholder="Enter LP amount"
                  value={lpAmountToRemove}
                  onChange={(e) => setLpAmountToRemove(e.target.value)}
                  disabled={isRemovingLiquidity}
                />
              </div>

              <Button
                onClick={handleRemoveLiquidity}
                disabled={isRemovingLiquidity || !lpAmountToRemove}
                className="w-full"
              >
                {isRemovingLiquidity ? "Removing..." : "Remove Liquidity"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setRemoving(!removing)}
        >
          {removing ? "Switch to Add Liquidity" : "Switch to Remove Liquidity"}
        </Button>
      </CardFooter>
    </Card>
  );
}
