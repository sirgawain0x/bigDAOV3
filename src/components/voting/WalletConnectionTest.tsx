"use client";
import { useState, useEffect } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useAccount, useWalletClient } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { REWARD_TOKEN_CONTRACT } from "@/lib/contracts";
import { balanceOf } from "thirdweb/extensions/erc20";

export const WalletConnectionTest = () => {
  const [mounted, setMounted] = useState(false);
  const thirdwebAccount = useActiveAccount();
  const wagmiAccount = useAccount();
  const { data: walletClient } = useWalletClient();
  
  // Always call hooks - this is required by Rules of Hooks
  const { data: bigTokenBalance, isLoading, error } = useReadContract(balanceOf, {
    contract: REWARD_TOKEN_CONTRACT,
    owner: thirdwebAccount?.address || "",
    queryOptions: {
      enabled: !!thirdwebAccount?.address && !!REWARD_TOKEN_CONTRACT && mounted,
    },
  });
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Wallet Connection Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">Loading connection status...</div>
        </CardContent>
      </Card>
    );
  }

  const getConnectionStatus = () => {
    if (!wagmiAccount.isConnected) return "Wagmi: Not Connected";
    if (!thirdwebAccount?.address) return "Wagmi: Connected, Thirdweb: Not Active";
    return "Both Connected";
  };

  const getChainInfo = async () => {
    if (!walletClient) return "No wallet client";
    try {
      const chainId = await walletClient.getChainId();
      return `Chain ID: ${chainId}`;
    } catch (error) {
      return `Error getting chain: ${error}`;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Wallet Connection Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <strong>Connection Status:</strong> {getConnectionStatus()}
        </div>
        <div className="text-sm">
          <strong>Wagmi Address:</strong> {wagmiAccount.address || "None"}
        </div>
        <div className="text-sm">
          <strong>Thirdweb Address:</strong> {thirdwebAccount?.address || "None"}
        </div>
        <div className="text-sm">
          <strong>Token Balance:</strong> {isLoading ? "Loading..." : error ? `Error: ${error.message}` : bigTokenBalance?.toString() || "0"}
        </div>
        <div className="text-sm">
          <strong>Wallet Client:</strong> {walletClient ? "Available" : "Not Available"}
        </div>
        <Button 
          size="sm" 
          onClick={async () => {
            const chainInfo = await getChainInfo();
            console.log(chainInfo);
            alert(chainInfo);
          }}
        >
          Get Chain Info
        </Button>
      </CardContent>
    </Card>
  );
};
