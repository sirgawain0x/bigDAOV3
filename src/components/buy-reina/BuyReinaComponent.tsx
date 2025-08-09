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
import { ArrowDown, ArrowUp, Coins, Wallet, TrendingUp, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReinaBuy } from "@/hooks/useReinaBuy";

export const BuyReinaComponent = () => {
  const activeAccount = useActiveAccount();
  
  // State for input values
  const [usdcAmount, setUsdcAmount] = useState<string>("");
  const [reinaAmount, setReinaAmount] = useState<string>("");
  const [currentInput, setCurrentInput] = useState<"usdc" | "reina">("usdc");
  
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

  // Use the Reina buy hook
  const {
    isLoading,
    usdcBalance,
    reinaBalance,
    tradingInfo,
    fetchUsdcBalance,
    fetchReinaBalance,
    fetchTradingInfo,
    calculateReinaAmount,
    calculateUsdcAmount,
    buyReina,
    PRICE_PER_TOKEN,
  } = useReinaBuy();

  const [isLoadingTradingInfo, setIsLoadingTradingInfo] = useState<boolean>(false);
  const [tradingInfoError, setTradingInfoError] = useState<string | null>(null);

  // Fetch balances and trading info on mount and when account changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingTradingInfo(true);
      setTradingInfoError(null);
      try {
        console.log("Loading Reina data...");
        await Promise.all([
          fetchUsdcBalance(),
          fetchReinaBalance(),
          fetchTradingInfo()
        ]);
        console.log("Reina data loaded successfully");
      } catch (error) {
        console.error("Error loading data:", error);
        setTradingInfoError("Failed to load market data");
      } finally {
        setIsLoadingTradingInfo(false);
      }
    };
    
    loadData();
  }, [fetchUsdcBalance, fetchReinaBalance, fetchTradingInfo]);

  // Debug trading info changes
  useEffect(() => {
    console.log("Trading info updated:", tradingInfo);
  }, [tradingInfo]);

  // Manual refresh function
  const handleRefreshTradingInfo = async () => {
    setIsLoadingTradingInfo(true);
    setTradingInfoError(null);
    try {
      await fetchTradingInfo();
    } catch (error) {
      console.error("Error refreshing trading info:", error);
      setTradingInfoError("Failed to refresh market data");
    } finally {
      setIsLoadingTradingInfo(false);
    }
  };

  // Handle input changes
  const handleInputChange = useCallback((value: string, type: "usdc" | "reina") => {
    const parsedValue = parseFloat(value);
    
    if (isNaN(parsedValue) || parsedValue < 0) {
      if (type === "usdc") {
        setUsdcAmount("");
        setReinaAmount("");
      } else {
        setReinaAmount("");
        setUsdcAmount("");
      }
      return;
    }

    if (type === "usdc") {
      setUsdcAmount(value);
      const reinaValue = calculateReinaAmount(value);
      setReinaAmount(reinaValue);
      setCurrentInput("usdc");
    } else {
      setReinaAmount(value);
      const usdcValue = calculateUsdcAmount(value);
      setUsdcAmount(usdcValue);
      setCurrentInput("reina");
    }
  }, [calculateReinaAmount, calculateUsdcAmount]);

  // Toggle between input types
  const toggleInput = () => {
    const newInput = currentInput === "usdc" ? "reina" : "usdc";
    setCurrentInput(newInput);
    
    // Swap values based on current input
    if (currentInput === "usdc" && usdcAmount) {
      const parsedValue = parseFloat(usdcAmount);
      if (!isNaN(parsedValue)) {
        const reinaValue = calculateReinaAmount(usdcAmount);
        setReinaAmount(reinaValue);
        setUsdcAmount("");
      }
    } else if (currentInput === "reina" && reinaAmount) {
      const parsedValue = parseFloat(reinaAmount);
      if (!isNaN(parsedValue)) {
        const usdcValue = calculateUsdcAmount(reinaAmount);
        setUsdcAmount(usdcValue);
        setReinaAmount("");
      }
    }
  };

  // Set max amount
  const setMaxAmount = () => {
    if (currentInput === "usdc") {
      setUsdcAmount(usdcBalance);
      const reinaValue = calculateReinaAmount(usdcBalance);
      setReinaAmount(reinaValue);
    } else {
      const maxReina = calculateReinaAmount(usdcBalance);
      setReinaAmount(maxReina);
      const usdcValue = calculateUsdcAmount(maxReina);
      setUsdcAmount(usdcValue);
    }
  };

  // Handle buy transaction
  const handleBuy = async () => {
    if (!activeAccount?.address || !usdcAmount || parseFloat(usdcAmount) <= 0) {
      return;
    }

    if (parseFloat(usdcAmount) > parseFloat(usdcBalance)) {
      return;
    }

    setShowConfirmDialog(true);
  };

  // Execute the buy transaction
  const executeBuy = async () => {
    setShowConfirmDialog(false);
    
    const success = await buyReina(usdcAmount, reinaAmount);
    
    if (success) {
      // Reset form
      setUsdcAmount("");
      setReinaAmount("");
    }
  };

  const canBuy = activeAccount?.address && 
                 usdcAmount && 
                 parseFloat(usdcAmount) > 0 && 
                 parseFloat(usdcAmount) <= parseFloat(usdcBalance);

  // Get current price display
  const getCurrentPriceDisplay = () => {
    if (isLoadingTradingInfo) return "Loading...";
    if (tradingInfoError) return "Unavailable";
    if (tradingInfo?.buyPrice) return `$${tradingInfo.buyPrice}`;
    return "Unavailable";
  };

  return (
    <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Buy Reina
            </CardTitle>
            <CardDescription>
              Purchase Reina tokens using USDC. Real-time pricing from OnBons API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Trading Info Display */}
            {isLoadingTradingInfo ? (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Market Info</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshTradingInfo}
                    disabled={isLoadingTradingInfo}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Loading market data...</div>
              </div>
            ) : tradingInfo && !tradingInfoError ? (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Market Info</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshTradingInfo}
                    disabled={isLoadingTradingInfo}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-1 font-medium">${tradingInfo.buyPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">24h Volume:</span>
                    <span className="ml-1 font-medium">${parseInt(tradingInfo.volume24Hr).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Cap:</span>
                    <span className="ml-1 font-medium">${parseInt(tradingInfo.marketCap).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Holders:</span>
                    <span className="ml-1 font-medium">{tradingInfo.holders}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Market Info</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshTradingInfo}
                    disabled={isLoadingTradingInfo}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {tradingInfoError || "Unable to load market data"}
                </div>
              </div>
            )}

            {/* Price Display */}
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Current Price:</span>
              <Badge variant="secondary">
                {getCurrentPriceDisplay()}
              </Badge>
            </div>

            {/* Balance Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Wallet className="w-4 h-4" />
                <div>
                  <p className="text-xs text-muted-foreground">USDC Balance</p>
                  <p className="font-medium">
                    {walletBalanceIsLoading ? "Loading..." : `${parseFloat(usdcBalance).toFixed(2)} USDC`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Coins className="w-4 h-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Reina Balance</p>
                  <p className="font-medium">
                    {parseFloat(reinaBalance).toFixed(2)} Reina
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Input */}
            <div className="space-y-4">
              {/* USDC Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="usdc">You Pay (USDC)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={setMaxAmount}
                    className="text-xs h-6 px-2"
                  >
                    Max
                  </Button>
                </div>
                <Input
                  id="usdc"
                  type="number"
                  placeholder="0.0"
                  value={usdcAmount}
                  onChange={(e) => handleInputChange(e.target.value, "usdc")}
                />
                <p className="text-xs text-muted-foreground">
                  Available: {parseFloat(usdcBalance).toFixed(2)} USDC
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
                  {currentInput === "usdc" ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Reina Input */}
              <div className="space-y-2">
                <Label htmlFor="reina">You Receive (Reina)</Label>
                <Input
                  id="reina"
                  type="number"
                  placeholder="0.0"
                  value={reinaAmount}
                  onChange={(e) => handleInputChange(e.target.value, "reina")}
                />
                <p className="text-xs text-muted-foreground">
                  Current Balance: {parseFloat(reinaBalance).toFixed(2)} Reina
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            {usdcAmount && reinaAmount && parseFloat(usdcAmount) > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span>1 Reina = ${getCurrentPriceDisplay()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price Impact:</span>
                  <span className="text-green-600">0% (Fixed Price)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>You Will Receive:</span>
                  <span className="font-medium">{reinaAmount} Reina</span>
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
                {isLoading ? "Processing..." : "Buy Reina"}
              </Button>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">Connect your wallet to buy Reina tokens.</p>
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
                  <span className="font-medium">{usdcAmount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>You Receive:</span>
                  <span className="font-medium">{reinaAmount} Reina</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>1 Reina = ${getCurrentPriceDisplay()}</span>
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
  );
};
