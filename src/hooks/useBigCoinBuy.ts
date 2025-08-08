import { useState, useCallback } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import { prepareContractCall, sendTransaction, toWei, Address, getContract } from "thirdweb";
import { getBalance } from "thirdweb/extensions/erc20";
import { Account } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { useToast } from "@/hooks/use-toast";

// Token addresses on Base
const BIG_COIN_ADDRESS = "0x3A8df31105Ef1e653EDF8B1B5EE486eB78803266";
const CBTC_ADDRESS = "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf";
const PRICE_PER_TOKEN = 0.0002; // cbBTC per Big Coin token

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

// Big Coin contract ABI for buying functionality
const BIG_COIN_ABI = [
  {
    constant: false,
    inputs: [{ name: "cbBTCAmount", type: "uint256" }],
    name: "buyWithCbBTC",
    outputs: [],
    type: "function",
    stateMutability: "nonpayable",
  },
] as const;

export const useBigCoinBuy = () => {
  const { toast } = useToast();
  const activeAccount = useActiveAccount();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cbBTCBalance, setCbBTCBalance] = useState<string>("0");
  const [bigCoinBalance, setBigCoinBalance] = useState<string>("0");

  // Fetch cbBTC balance
  const fetchCbBTCBalance = useCallback(async () => {
    if (!activeAccount?.address) return;
    
    try {
      const balance = await getBalance({
        contract: getContract({
          client,
          chain: base,
          address: CBTC_ADDRESS as Address,
          abi: ERC20_ABI,
        }),
        address: activeAccount.address,
      });
      setCbBTCBalance(balance.displayValue);
    } catch (error) {
      console.error("Error fetching cbBTC balance:", error);
      setCbBTCBalance("0");
    }
  }, [activeAccount?.address]);

  // Fetch Big Coin balance
  const fetchBigCoinBalance = useCallback(async () => {
    if (!activeAccount?.address) return;
    
    try {
      const balance = await getBalance({
        contract: getContract({
          client,
          chain: base,
          address: BIG_COIN_ADDRESS as Address,
          abi: ERC20_ABI,
        }),
        address: activeAccount.address,
      });
      setBigCoinBalance(balance.displayValue);
    } catch (error) {
      console.error("Error fetching Big Coin balance:", error);
      setBigCoinBalance("0");
    }
  }, [activeAccount?.address]);

  // Calculate Big Coin amount from cbBTC
  const calculateBigCoinAmount = useCallback((cbBTCAmount: string): string => {
    const parsedValue = parseFloat(cbBTCAmount);
    if (isNaN(parsedValue) || parsedValue < 0) return "0";
    return (parsedValue / PRICE_PER_TOKEN).toString();
  }, []);

  // Calculate cbBTC amount from Big Coin
  const calculateCbBTCAmount = useCallback((bigCoinAmount: string): string => {
    const parsedValue = parseFloat(bigCoinAmount);
    if (isNaN(parsedValue) || parsedValue < 0) return "0";
    return (parsedValue * PRICE_PER_TOKEN).toString();
  }, []);

  // Execute buy transaction
  const buyBigCoin = useCallback(async (cbBTCAmount: string, bigCoinAmount: string) => {
    if (!activeAccount?.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to buy Big Coin tokens.",
        variant: "destructive",
      });
      return false;
    }

    if (!cbBTCAmount || parseFloat(cbBTCAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive",
      });
      return false;
    }

    if (parseFloat(cbBTCAmount) > parseFloat(cbBTCBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough cbBTC to complete this transaction.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      const cbBTCAmountWei = toWei(cbBTCAmount);
      
      // First, approve the Big Coin contract to spend cbBTC
      const approveTx = prepareContractCall({
        contract: getContract({
          client,
          chain: base,
          address: CBTC_ADDRESS as Address,
          abi: ERC20_ABI,
        }),
        method: "approve",
        params: [BIG_COIN_ADDRESS as Address, cbBTCAmountWei],
      });

      const { transactionHash: approveHash } = await sendTransaction({
        account: activeAccount as Account,
        transaction: approveTx,
      });

      console.log("Approval successful:", approveHash);

      // Then, call the buy function on Big Coin contract
      const buyTx = prepareContractCall({
        contract: getContract({
          client,
          chain: base,
          address: BIG_COIN_ADDRESS as Address,
          abi: BIG_COIN_ABI,
        }),
        method: "buyWithCbBTC",
        params: [cbBTCAmountWei],
      });

      const { transactionHash: buyHash } = await sendTransaction({
        account: activeAccount as Account,
        transaction: buyTx,
      });

      console.log("Buy transaction successful:", buyHash);

      toast({
        title: "Purchase Successful!",
        description: `Successfully purchased ${bigCoinAmount} Big Coin tokens for ${cbBTCAmount} cbBTC.`,
      });

      // Refresh balances
      await fetchCbBTCBalance();
      await fetchBigCoinBalance();

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
  }, [activeAccount, cbBTCBalance, fetchCbBTCBalance, fetchBigCoinBalance, toast]);

  return {
    isLoading,
    cbBTCBalance,
    bigCoinBalance,
    fetchCbBTCBalance,
    fetchBigCoinBalance,
    calculateBigCoinAmount,
    calculateCbBTCAmount,
    buyBigCoin,
    PRICE_PER_TOKEN,
  };
};
