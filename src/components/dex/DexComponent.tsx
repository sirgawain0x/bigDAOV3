"use client";
import { useState, useEffect, useCallback } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import { prepareContractCall, sendTransaction, toWei, Address } from "thirdweb";
import { getBalance } from "thirdweb/extensions/erc20";
import { Account } from "thirdweb/wallets";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import Token from "@/app/types/token";
import {
  TOKEN_ADDRESS,
  REWARD_TOKEN_CONTRACT,
  DEX_CONTRACT,
} from "@/lib/contracts";
import styles from "@/app/styles/Dex.module.css";
import SwapInput from "./SwapInput";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  allowance as thirdwebAllowance,
  balanceOf,
} from "thirdweb/extensions/erc20";
import approve from "@/app/transactions/approve";
import { useGetQuote } from "@/lib/quote";
import { useLiquidity } from "@/hooks/useLiquidity";
import { LiquidityPanel } from "./LiquidityPanel";
import { formatEther } from "viem";
import { TransactionModal } from "./TransactionModal";
import { TradeHistory } from "./TradeHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DexComponent = () => {
  // State for exchange rate
  const [exchangeRate, setExchangeRate] = useState<number>(1); // Initialize with 1 as default

  // Form state
  const [currentForm, setCurrentForm] = useState<"native" | "token">("native");
  const [nativeValue, setNativeValue] = useState<string>("");
  const [tokenValue, setTokenValue] = useState<string>("");

  // Use the quote hook at component level
  const quote = useGetQuote({
    tokenIn: {
      name: "BIG",
      address: TOKEN_ADDRESS,
      decimals: 18,
      symbol: "BIG",
    },
    tokenOut: {
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      symbol: "ETH",
    },
    amountIn:
      currentForm === "native"
        ? toWei(nativeValue || "0")
        : toWei(tokenValue || "0"),
  });

  // Update exchange rate when quote changes
  useEffect(() => {
    if (quote?.price) {
      setExchangeRate(quote.price);
    }
  }, [quote?.price]);

  const activeAccount = useActiveAccount();
  const {
    data: walletBalance,
    isLoading: walletBalanceIsLoading,
    isError: walletBalanceIsError,
  } = useWalletBalance({
    chain: base,
    address: activeAccount?.address,
    client,
  });
  console.log("balance", walletBalance?.displayValue, walletBalance?.symbol);

  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { liquidityInfo, calculatePriceImpact } = useLiquidity();
  const [priceImpact, setPriceImpact] = useState<number>(0);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5); // 0.5%
  const [minimumReceived, setMinimumReceived] = useState<bigint>(0n);

  // Effect for fetching token balance
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (activeAccount?.address && REWARD_TOKEN_CONTRACT) {
        try {
          const balance = await getBalance({
            contract: REWARD_TOKEN_CONTRACT,
            address: activeAccount.address,
          });
          setTokenBalance(balance.displayValue);
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };

    fetchTokenBalance();
  }, [activeAccount?.address]);

  // Effect for fetching native balance
  useEffect(() => {
    const fetchNativeBalance = async () => {
      if (activeAccount?.address && walletBalance) {
        try {
          setNativeBalance(walletBalance.displayValue);
        } catch (error) {
          console.error("Error fetching native balance:", error);
        }
      }
    };

    fetchNativeBalance();
  }, [activeAccount?.address, walletBalance]);

  const handleInputChange = useCallback(
    (value: string, type: "native" | "token") => {
      const parsedValue = parseFloat(value);

      if (isNaN(parsedValue)) {
        if (type === "native") {
          setNativeValue("");
        } else {
          setTokenValue("");
        }
        setPriceImpact(0);
        return;
      }

      if (type === "native") {
        setNativeValue(value);
        const tokenAmount = (parsedValue * exchangeRate).toString();
        setTokenValue(tokenAmount);
        // Calculate price impact for ETH to Token
        calculatePriceImpact(BigInt(toWei(value)), true).then((impact) => {
          setPriceImpact(impact);
        });
      } else {
        setTokenValue(value);
        const nativeAmount = (parsedValue / exchangeRate).toString();
        setNativeValue(nativeAmount);
        // Calculate price impact for Token to ETH
        calculatePriceImpact(BigInt(toWei(value)), false).then((impact) => {
          setPriceImpact(impact);
        });
      }
    },
    [exchangeRate, calculatePriceImpact]
  );

  const toggleForm = () => {
    const newForm = currentForm === "native" ? "token" : "native";

    // Swap the input values based on the exchange rate
    if (currentForm === "native") {
      const parsedValue = parseFloat(nativeValue);
      if (!isNaN(parsedValue)) {
        const newTokenValue = (parsedValue * exchangeRate).toString();
        setTokenValue(newTokenValue);
      } else {
        setTokenValue("");
      }
      setNativeValue("");
    } else {
      const parsedValue = parseFloat(tokenValue);
      if (!isNaN(parsedValue)) {
        const newNativeValue = (parsedValue / exchangeRate).toString();
        setNativeValue(newNativeValue);
      } else {
        setNativeValue("");
      }
      setTokenValue("");
    }

    setCurrentForm(newForm);
  };

  const quoteData = useGetQuote({
    tokenIn:
      currentForm === "native"
        ? {
            name: "Ethereum",
            decimals: 18,
            symbol: "ETH",
            address: "0x0000000000000000000000000000000000000000",
          }
        : {
            name: "BIG",
            decimals: 18,
            symbol: "BIG",
            address: TOKEN_ADDRESS,
          },
    tokenOut:
      currentForm === "native"
        ? {
            name: "BIG",
            decimals: 18,
            symbol: "BIG",
            address: TOKEN_ADDRESS,
          }
        : {
            name: "Ethereum",
            decimals: 18,
            symbol: "ETH",
            address: "0x0000000000000000000000000000000000000000",
          },
    amountIn:
      currentForm === "native"
        ? toWei(nativeValue || "0")
        : toWei(tokenValue || "0"),
  });

  useEffect(() => {
    if (!currentForm || !nativeValue || !tokenValue) {
      setMinimumReceived(0n);
      return;
    }

    if (quoteData?.outputAmount) {
      setMinimumReceived(quoteData.outputAmount);
    }
  }, [currentForm, nativeValue, tokenValue, quoteData]);

  const handleSwap = async () => {
    setShowTransactionModal(true);
  };

  const executeSwapWithSlippage = async () => {
    try {
      setIsLoading(true);
      setShowTransactionModal(false);

      if (currentForm === "token" && parseFloat(tokenValue) > 0) {
        const tokenAmount = BigInt(toWei(tokenValue));

        // Approve DEX to spend token
        await approve({
          amount: tokenAmount,
          token: {
            name: "BIG",
            decimals: 18,
            symbol: "BIG",
            address: TOKEN_ADDRESS,
          },
          spender: DEX_CONTRACT.address as Address,
        });

        const tx = prepareContractCall({
          contract: DEX_CONTRACT,
          method: "swapTokenToEth",
          params: [tokenAmount],
        });

        const { transactionHash } = await sendTransaction({
          account: activeAccount as Account,
          transaction: tx,
        });
        console.log("Swap successful!", transactionHash);
      } else if (currentForm === "native" && parseFloat(nativeValue) > 0) {
        const ethAmount = BigInt(toWei(nativeValue));

        const tx = prepareContractCall({
          contract: DEX_CONTRACT,
          method: "swapEthToToken",
          params: [],
          value: ethAmount,
        });

        const { transactionHash } = await sendTransaction({
          account: activeAccount as Account,
          transaction: tx,
        });
        console.log("Swap successful!", transactionHash);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during swap. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Swap Interface */}
          <div>
            <div
              style={{
                backgroundColor: "#FFF",
                padding: "2rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                minWidth: "440px",
              }}
            >
              {/* Slippage Settings */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground">
                  Slippage Tolerance
                </label>
                <Select
                  value={slippageTolerance.toString()}
                  onValueChange={(value) =>
                    setSlippageTolerance(parseFloat(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select slippage tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1%</SelectItem>
                    <SelectItem value="0.5">0.5%</SelectItem>
                    <SelectItem value="1.0">1.0%</SelectItem>
                    <SelectItem value="2.0">2.0%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pool Info */}
              {liquidityInfo && (
                <div className="mb-4 p-2 rounded bg-background/10">
                  <div className="flex justify-between text-sm">
                    <span>
                      Pool ETH: {formatEther(liquidityInfo.ethReserve)} ETH
                    </span>
                    <span>
                      Pool BIG: {formatEther(liquidityInfo.tokenReserve)} BIG
                    </span>
                  </div>
                  {priceImpact > 0 && (
                    <div
                      className={`mt-2 text-sm ${
                        priceImpact > 5
                          ? "text-red-500"
                          : priceImpact > 3
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      Price Impact: {priceImpact.toFixed(2)}%
                      {priceImpact > 5 && (
                        <span className="block text-xs">
                          High price impact! Consider reducing trade size.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Swap Interface */}
              <div>
                <SwapInput
                  current={currentForm}
                  type="native"
                  max={nativeBalance}
                  value={nativeValue}
                  setValue={(value) => handleInputChange(value, "native")}
                  tokenSymbol="ETH"
                  tokenBalance={nativeBalance}
                />
                <Button onClick={toggleForm} className={styles.toggleButton}>
                  {currentForm === "native" ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
                <SwapInput
                  current={currentForm}
                  type="token"
                  max={tokenBalance}
                  value={tokenValue}
                  setValue={(value) => handleInputChange(value, "token")}
                  tokenSymbol="BIG"
                  tokenBalance={tokenBalance}
                />
              </div>

              {activeAccount?.address ? (
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={handleSwap}
                    disabled={isLoading || priceImpact > 10}
                    className={`${styles.swapButton} ${
                      priceImpact > 5 ? "opacity-80" : ""
                    }`}
                  >
                    {isLoading
                      ? "Loading..."
                      : priceImpact > 10
                      ? "Price Impact Too High"
                      : "Review Swap"}
                  </button>
                </div>
              ) : (
                <p>Connect wallet to exchange.</p>
              )}
            </div>

            {/* Transaction Modal */}
            <TransactionModal
              isOpen={showTransactionModal}
              onClose={() => setShowTransactionModal(false)}
              onConfirm={executeSwapWithSlippage}
              inputAmount={currentForm === "native" ? nativeValue : tokenValue}
              outputAmount={currentForm === "native" ? tokenValue : nativeValue}
              inputToken={currentForm === "native" ? "ETH" : "BIG"}
              outputToken={currentForm === "native" ? "BIG" : "ETH"}
              priceImpact={priceImpact}
              slippageTolerance={slippageTolerance}
              minimumReceived={minimumReceived}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Liquidity Panel and Trade History */}
          <div className="space-y-4">
            <LiquidityPanel />
            <TradeHistory />
          </div>
        </div>
      </div>
    </main>
  );
};
