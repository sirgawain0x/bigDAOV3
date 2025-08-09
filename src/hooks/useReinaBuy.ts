import { useState, useCallback } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import { prepareContractCall, sendTransaction, toWei, Address, getContract } from "thirdweb";
import { getBalance } from "thirdweb/extensions/erc20";
import { Account } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { useToast } from "@/hooks/use-toast";

// Token addresses on Base
const REINA_ADDRESS = "0x8468f9ee7c2275313979c3042166f325b1da5094"; // Reina token address
const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const PRICE_PER_TOKEN = 12; // USDC per Reina token (adjust based on API data)

// Standard ERC20 ABI for basic token operations
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
    stateMutability: "view",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
    stateMutability: "nonpayable",
  },
] as const;

// Reina contract ABI for buying functionality
const REINA_ABI = [
  {
    constant: false,
    inputs: [{ name: "usdcAmount", type: "uint256" }],
    name: "buyWithUsdc",
    outputs: [],
    type: "function",
    stateMutability: "nonpayable",
  },
] as const;

export const useReinaBuy = () => {
  const { toast } = useToast();
  const activeAccount = useActiveAccount();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [reinaBalance, setReinaBalance] = useState<string>("0");
  const [tradingInfo, setTradingInfo] = useState<any>(null);

  // Fetch trading info for Reina
  const fetchTradingInfo = useCallback(async () => {
    try {
      console.log("Fetching trading info for Reina...");
      const response = await fetch(`/api/trading-info?clubId=197&chain=base`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Reina trading info received:", data);
      
      if (data && data.buyPrice) {
        setTradingInfo(data);
        console.log("Trading info set successfully:", data);
      } else {
        console.warn("Trading info received but missing buyPrice:", data);
        setTradingInfo(null);
      }
    } catch (error) {
      console.error("Error fetching Reina trading info:", error);
      setTradingInfo(null);
    }
  }, []);

  // Fetch USDC balance
  const fetchUsdcBalance = useCallback(async () => {
    if (!activeAccount?.address) return;
    
    try {
      const balance = await getBalance({
        contract: getContract({
          client,
          chain: base,
          address: USDC_ADDRESS as Address,
          abi: ERC20_ABI,
        }),
        address: activeAccount.address,
      });
      setUsdcBalance(balance.displayValue);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      setUsdcBalance("0");
    }
  }, [activeAccount?.address]);

  // Fetch Reina balance
  const fetchReinaBalance = useCallback(async () => {
    if (!activeAccount?.address) return;
    
    try {
      const balance = await getBalance({
        contract: getContract({
          client,
          chain: base,
          address: REINA_ADDRESS as Address,
          abi: ERC20_ABI,
        }),
        address: activeAccount.address,
      });
      setReinaBalance(balance.displayValue);
    } catch (error) {
      console.error("Error fetching Reina balance:", error);
      setReinaBalance("0");
    }
  }, [activeAccount?.address]);

  // Calculate Reina amount from USDC
  const calculateReinaAmount = useCallback((usdcAmount: string): string => {
    const parsedValue = parseFloat(usdcAmount);
    if (isNaN(parsedValue) || parsedValue < 0) return "0";
    return (parsedValue / PRICE_PER_TOKEN).toString();
  }, []);

  // Calculate USDC amount from Reina
  const calculateUsdcAmount = useCallback((reinaAmount: string): string => {
    const parsedValue = parseFloat(reinaAmount);
    if (isNaN(parsedValue) || parsedValue < 0) return "0";
    return (parsedValue * PRICE_PER_TOKEN).toString();
  }, []);

  // Execute buy transaction
  const buyReina = useCallback(async (usdcAmount: string, reinaAmount: string) => {
    if (!activeAccount?.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to buy Reina tokens.",
        variant: "destructive",
      });
      return false;
    }

    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive",
      });
      return false;
    }

    if (parseFloat(usdcAmount) > parseFloat(usdcBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough USDC to complete this transaction.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      // Convert USDC amount to wei (USDC has 6 decimals)
      const usdcAmountWei = BigInt(Math.floor(parseFloat(usdcAmount) * 1000000));
      
      // First, approve the Reina contract to spend USDC
      const approveTx = prepareContractCall({
        contract: getContract({
          client,
          chain: base,
          address: USDC_ADDRESS as Address,
          abi: ERC20_ABI,
        }),
        method: "approve",
        params: [REINA_ADDRESS as Address, usdcAmountWei],
      });

      const { transactionHash: approveHash } = await sendTransaction({
        account: activeAccount as Account,
        transaction: approveTx,
      });

      console.log("Approval successful:", approveHash);

      // Then, call the buy function on Reina contract
      const buyTx = prepareContractCall({
        contract: getContract({
          client,
          chain: base,
          address: REINA_ADDRESS as Address,
          abi: REINA_ABI,
        }),
        method: "buyWithUsdc",
        params: [usdcAmountWei],
      });

      const { transactionHash: buyHash } = await sendTransaction({
        account: activeAccount as Account,
        transaction: buyTx,
      });

      console.log("Buy transaction successful:", buyHash);

      toast({
        title: "Purchase Successful!",
        description: `Successfully purchased ${reinaAmount} Reina tokens for ${usdcAmount} USDC.`,
      });

      // Refresh balances
      await fetchUsdcBalance();
      await fetchReinaBalance();

      return true;
    } catch (error) {
      console.error("Transaction failed:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your transaction. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeAccount, usdcBalance, fetchUsdcBalance, fetchReinaBalance, toast]);

  return {
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
  };
};
