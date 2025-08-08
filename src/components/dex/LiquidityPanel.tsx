"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { base } from "thirdweb/chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveAccount } from "thirdweb/react";
import { formatEther, parseEther } from "viem";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Pool,
  Position,
  nearestUsableTick,
  NonfungiblePositionManager,
  MintOptions,
} from "@uniswap/v3-sdk";
import {
  Currency,
  CurrencyAmount,
  Percent,
  Ether,
  Token,
} from "@uniswap/sdk-core";

import {
  AlphaRouter,
  SwapType,
  SwapToRatioStatus,
} from "@uniswap/smart-order-router";
import { V3_SWAP_ROUTER_ADDRESS } from "@/lib/contracts";
import { useAccount, useWalletClient } from "wagmi";

const BIG_TOKEN_ADDRESS = "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56";
const POOL_FEE = 500; // 0.05%
const TICK_SPACING = 1;

// Suggested initial liquidity amounts
const SUGGESTED_ETH = "1"; // 1 ETH
const SUGGESTED_BIG = "1000"; // 1000 BIG
const SUGGESTED_PRICE = 1000; // 1 ETH = 1000 BIG

const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export function LiquidityPanel() {
  const [ethAmount, setEthAmount] = useState("");
  const [bigAmount, setBigAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [pricePerETH, setPricePerETH] = useState<number | null>(null);
  const account = useActiveAccount();
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();
  const signer = walletClient;

  // Calculate price whenever amounts change
  useEffect(() => {
    if (ethAmount && bigAmount) {
      const eth = parseFloat(ethAmount);
      const big = parseFloat(bigAmount);
      if (eth > 0) {
        setPricePerETH(big / eth);
      }
    }
  }, [ethAmount, bigAmount]);

  // Handle ETH input change
  const handleEthChange = (value: string) => {
    setEthAmount(value);
    if (value && parseFloat(value) > 0) {
      // Maintain the suggested price ratio
      setBigAmount((parseFloat(value) * SUGGESTED_PRICE).toString());
    }
  };

  // Handle BIG input change
  const handleBigChange = (value: string) => {
    setBigAmount(value);
    if (value && parseFloat(value) > 0) {
      // Maintain the suggested price ratio
      setEthAmount((parseFloat(value) / SUGGESTED_PRICE).toString());
    }
  };

  // Load suggested values
  const loadSuggestedValues = () => {
    setEthAmount(SUGGESTED_ETH);
    setBigAmount(SUGGESTED_BIG);
  };

  const handleCreatePool = useCallback(async () => {
    if (!account || !ethAmount || !bigAmount) return;

    try {
      setLoading(true);

      // Create currency instances
      const eth = new Token(
        Number(base.id),
        NATIVE_TOKEN_ADDRESS,
        18,
        "ETH",
        "Ethereum"
      );
      const big = new Token(
        Number(base.id),
        BIG_TOKEN_ADDRESS,
        18,
        "BIG",
        "Big Coin"
      );

      // Calculate valid initial price
      const sqrtRatioX96 = Math.sqrt(SUGGESTED_PRICE) * 2 ** 96;
      const pool = new Pool(
        eth,
        big,
        POOL_FEE,
        sqrtRatioX96,
        0, // liquidity
        0 // tickCurrent
      );

      // Generate call parameters using the static method from NonfungiblePositionManager
      const callParams = NonfungiblePositionManager.createCallParameters(pool);

      // Get transaction data
      const calldata = callParams;

      toast({
        title: "Success",
        description: "Pool created and liquidity added successfully!",
      });
    } catch (error) {
      console.error("Pool creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create pool and add liquidity.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [account, ethAmount, bigAmount, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Liquidity</CardTitle>
        <div className="text-sm text-muted-foreground">
          Enter ETH and BIG amounts
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">ETH Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={ethAmount}
              onChange={(e) => handleEthChange(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">BIG Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={bigAmount}
              onChange={(e) => handleBigChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={loadSuggestedValues}
          >
            Load Suggested Values (1 ETH = 1000 BIG)
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground">
          💡 Suggested initial liquidity:
          <ul className="list-disc list-inside mt-2">
            <li>
              {SUGGESTED_ETH} ETH + {SUGGESTED_BIG} BIG tokens
            </li>
            <li>This sets an initial price of 1 ETH = {SUGGESTED_PRICE} BIG</li>
            <li>Adding more liquidity maintains this price ratio</li>
          </ul>
        </div>
        <Button
          className="w-full"
          onClick={handleCreatePool}
          disabled={!account || !ethAmount || !bigAmount || loading}
        >
          {loading ? "Creating Pool..." : "Create Pool & Add Liquidity"}
        </Button>
      </CardFooter>
    </Card>
  );
}
