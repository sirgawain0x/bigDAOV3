"use client";
import { useState, useEffect, useCallback } from "react";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { client } from "@/app/consts/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Coins, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBigCoinBuy } from "@/hooks/useBigCoinBuy";

export const BuyBigCoinComponent = () => {
  const activeAccount = useActiveAccount();
  
  // State for input values
  const [cbBTCAmount, setCbBTCAmount] = useState<string>("");
  const [bigCoinAmount, setBigCoinAmount] = useState<string>("");
  const [currentInput, setCurrentInput] = useState<"cbBTC" | "bigCoin">("cbBTC");
  
  // Transaction state
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  // Get wallet balance
  const {
    data: walletBalance,
    isLoading: walletBalanceIsLoading,
  } = useWalletBalance({
    chain: base,
    address: activeAccount?.address,
    client,
  });

  // Use the Big Coin buy hook
  const {
    isLoading,
    cbBTCBalance,
    bigCoinBalance,
    fetchCbBTCBalance,
    fetchBigCoinBalance,
    calculateBigCoinAmount,
    calculateCbBTCAmount,
    buyBigCoin,
    PRICE_PER_TOKEN,
  } = useBigCoinBuy();

  // Fetch balances on mount and when account changes
  useEffect(() => {
    fetchCbBTCBalance();
    fetchBigCoinBalance();
  }, [fetchCbBTCBalance, fetchBigCoinBalance]);

  // Handle input changes
  const handleInputChange = useCallback((value: string, type: "cbBTC" | "bigCoin") => {
    const parsedValue = parseFloat(value);
    
    if (isNaN(parsedValue) || parsedValue < 0) {
      if (type === "cbBTC") {
        setCbBTCAmount("");
        setBigCoinAmount("");
      } else {
        setBigCoinAmount("");
        setCbBTCAmount("");
      }
      return;
    }

    if (type === "cbBTC") {
      setCbBTCAmount(value);
      const bigCoinValue = calculateBigCoinAmount(value);
      setBigCoinAmount(bigCoinValue);
      setCurrentInput("cbBTC");
    } else {
      setBigCoinAmount(value);
      const cbBTCValue = calculateCbBTCAmount(value);
      setCbBTCAmount(cbBTCValue);
      setCurrentInput("bigCoin");
    }
  }, [calculateBigCoinAmount, calculateCbBTCAmount]);

  // Toggle between input types
  const toggleInput = () => {
    const newInput = currentInput === "cbBTC" ? "bigCoin" : "cbBTC";
    setCurrentInput(newInput);
    
    // Swap values based on current input
    if (currentInput === "cbBTC" && cbBTCAmount) {
      const parsedValue = parseFloat(cbBTCAmount);
      if (!isNaN(parsedValue)) {
        const bigCoinValue = calculateBigCoinAmount(cbBTCAmount);
        setBigCoinAmount(bigCoinValue);
        setCbBTCAmount("");
      }
    } else if (currentInput === "bigCoin" && bigCoinAmount) {
      const parsedValue = parseFloat(bigCoinAmount);
      if (!isNaN(parsedValue)) {
        const cbBTCValue = calculateCbBTCAmount(bigCoinAmount);
        setCbBTCAmount(cbBTCValue);
        setBigCoinAmount("");
      }
    }
  };

  // Set max amount
  const setMaxAmount = () => {
    if (currentInput === "cbBTC") {
      setCbBTCAmount(cbBTCBalance);
      const bigCoinValue = calculateBigCoinAmount(cbBTCBalance);
      setBigCoinAmount(bigCoinValue);
    } else {
      const maxBigCoin = calculateBigCoinAmount(cbBTCBalance);
      setBigCoinAmount(maxBigCoin);
      const cbBTCValue = calculateCbBTCAmount(maxBigCoin);
      setCbBTCAmount(cbBTCValue);
    }
  };

  // Handle buy transaction
  const handleBuy = async () => {
    if (!activeAccount?.address || !cbBTCAmount || parseFloat(cbBTCAmount) <= 0) {
      return;
    }

    if (parseFloat(cbBTCAmount) > parseFloat(cbBTCBalance)) {
      return;
    }

    setShowConfirmDialog(true);
  };

  // Execute the buy transaction
  const executeBuy = async () => {
    setShowConfirmDialog(false);
    
    const success = await buyBigCoin(cbBTCAmount, bigCoinAmount);
    
    if (success) {
      // Reset form
      setCbBTCAmount("");
      setBigCoinAmount("");
    }
  };

  const canBuy = activeAccount?.address && 
                 cbBTCAmount && 
                 parseFloat(cbBTCAmount) > 0 && 
                 parseFloat(cbBTCAmount) <= parseFloat(cbBTCBalance);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Buy Big Coin
            </CardTitle>
            <CardDescription>
              Purchase Big Coin tokens using cbBTC at a fixed rate of 0.0002 cbBTC per token.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Price Display */}
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Fixed Price:</span>
              <Badge variant="secondary">0.0002 cbBTC per Big Coin</Badge>
            </div>

            {/* Balance Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Wallet className="w-4 h-4" />
                <div>
                  <p className="text-xs text-muted-foreground">cbBTC Balance</p>
                  <p className="font-medium">
                    {walletBalanceIsLoading ? "Loading..." : `${parseFloat(cbBTCBalance).toFixed(6)} cbBTC`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Coins className="w-4 h-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Big Coin Balance</p>
                  <p className="font-medium">
                    {parseFloat(bigCoinBalance).toFixed(2)} Big Coin
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="space-y-2">
              <Label>Transaction Details</Label>
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transaction Type:</span>
                  <span className="font-medium">Fixed Price Purchase</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Network Fee:</span>
                  <span className="text-muted-foreground">~$2-5 (estimated)</span>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {/* cbBTC Input */}
              <div className="space-y-2">
                <Label htmlFor="cbBTC">You Pay (cbBTC)</Label>
                <div className="relative">
                  <Input
                    id="cbBTC"
                    type="number"
                    placeholder="0.0"
                    value={cbBTCAmount}
                    onChange={(e) => handleInputChange(e.target.value, "cbBTC")}
                    className="pr-20"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-1 top-1 h-7"
                    onClick={setMaxAmount}
                  >
                    MAX
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Balance: {parseFloat(cbBTCBalance).toFixed(6)} cbBTC
                </p>
              </div>

              {/* Toggle Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleInput}
                  className="w-8 h-8"
                >
                  {currentInput === "cbBTC" ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Big Coin Input */}
              <div className="space-y-2">
                <Label htmlFor="bigCoin">You Receive (Big Coin)</Label>
                <Input
                  id="bigCoin"
                  type="number"
                  placeholder="0.0"
                  value={bigCoinAmount}
                  onChange={(e) => handleInputChange(e.target.value, "bigCoin")}
                />
                <p className="text-xs text-muted-foreground">
                  Current Balance: {parseFloat(bigCoinBalance).toFixed(2)} Big Coin
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            {cbBTCAmount && bigCoinAmount && parseFloat(cbBTCAmount) > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span>1 Big Coin = 0.0002 cbBTC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price Impact:</span>
                  <span className="text-green-600">0% (Fixed Price)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>You Will Receive:</span>
                  <span className="font-medium">{bigCoinAmount} Big Coin</span>
                </div>
              </div>
            )}

            {/* Buy Button */}
            {activeAccount?.address ? (
              <Button
                onClick={handleBuy}
                disabled={!canBuy || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Processing..." : "Buy Big Coin"}
              </Button>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">Connect your wallet to buy Big Coin tokens.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Please review your transaction details before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>You Pay:</span>
                  <span className="font-medium">{cbBTCAmount} cbBTC</span>
                </div>
                <div className="flex justify-between">
                  <span>You Receive:</span>
                  <span className="font-medium">{bigCoinAmount} Big Coin</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>1 Big Coin = 0.0002 cbBTC</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span className="text-muted-foreground">~$2-5 (estimated)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeBuy}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Processing..." : "Confirm Purchase"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
