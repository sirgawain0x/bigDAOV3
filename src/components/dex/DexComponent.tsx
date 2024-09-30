"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  toWei,
  toEther,
  Address,
  toTokens,
  toUnits,
} from "thirdweb";
import { getBalance } from "thirdweb/extensions/erc20";
import {
  useReadContract,
  useActiveAccount,
  useWalletBalance,
  useSendTransaction,
} from "thirdweb/react";
import Token from "@/app/types/token";
import {
  DEX_ADDRESS,
  TOKEN_ADDRESS,
  REWARD_TOKEN_CONTRACT,
} from "@/lib/contracts";
import styles from "@/app/styles/Dex.module.css";
import SwapInput from "./SwapInput";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TransactionButton } from "thirdweb/react";
import {
  allowance as thirdwebAllowance,
  balanceOf,
} from "thirdweb/extensions/erc20";
import approve from "@/app/transactions/approve";

export const DexComponent = () => {
  const fetchAllowance = async (tokenIn: Token, recipient: Address) => {
    return thirdwebAllowance({
      contract: getContract({
        client,
        chain: base,
        address: tokenIn.address,
      }),
      owner: recipient,
      spender: DEX_ADDRESS,
    });
  };

  const fetchBalance = async (tokenIn: Token, recipient: Address) => {
    return balanceOf({
      contract: getContract({
        client,
        chain: base,
        address: tokenIn.address,
      }),
      address: recipient,
    });
  };

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

  const [amount, setAmount] = useState<number>(0);
  const [inputTokenKey, setInputTokenKey] = useState<string | undefined>();
  const [outputTokenKey, setOutputTokenKey] = useState<string | undefined>();

  const [contractBalance, setContractBalance] = useState<String>("0");
  const [nativeValue, setNativeValue] = useState<String>("0");
  const [tokenValue, setTokenValue] = useState<String>("0");
  const [currentForm, setCurrentForm] = useState<String>("native");
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  // Effect for fetching token balance
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (activeAccount?.address && REWARD_TOKEN_CONTRACT) {
        try {
          const balance = await getBalance({
            contract: REWARD_TOKEN_CONTRACT,
            address: activeAccount.address,
          });
          setTokenValue(balance.displayValue);
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };

    fetchTokenBalance();
  }, [activeAccount?.address, tokenValue]);

  // Effect for fetching native balance
  useEffect(() => {
    const fetchNativeBalance = async () => {
      if (activeAccount?.address && walletBalance) {
        try {
          setNativeValue(walletBalance?.displayValue);
        } catch (error) {
          console.error("Error fetching native balance:", error);
        }
      }
    };

    fetchNativeBalance();
  }, [activeAccount?.address, nativeValue, walletBalance]);

  const handleInputChange = useCallback(
    (value: string, type: "native" | "token") => {
      if (type === "native") {
        setNativeValue(value);
      } else {
        setTokenValue(value);
      }
      // No need to manually trigger refetches here, as the useEffect hooks will handle it
    },
    []
  );

  async function executeSwap() {
    try {
      setIsLoading(true);

      // Approve DEX to spend token
      //await tokenContract.call('approve', [DEX_ADDRESS, tokenAmount]);
      approve({
        amount: toWei(tokenValue as string),
        token: tokenAmount,
        spender: DEX_ADDRESS,
      });

      const tx =
        currentForm === "native"
          ? await dexContract.call("swapEthToToken", {
              value: toWei(nativeAmount),
            })
          : await dexContract.call("swapTokenToEth", [toWei(tokenAmount)]);

      await tx.wait();
      alert(`Swap successful!`);
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div
          style={{
            backgroundColor: "#111",
            padding: "2rem",
            borderRadius: "10px",
            minWidth: "440px",
          }}
        >
          <div>
            <SwapInput
              current={currentForm as string}
              type="native"
              max={nativeValue as string}
              value={nativeValue as string}
              setValue={(value) => handleInputChange(value, "native")}
              tokenSymbol="ETH"
              tokenBalance={nativeValue as string}
            />
            <Button
              onClick={() =>
                currentForm === "native"
                  ? setCurrentForm("token")
                  : setCurrentForm("native")
              }
              className={styles.toggleButton}
            >
              {currentForm === "native" ? (
                <ArrowDown className="w-4 h-4" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </Button>
            <SwapInput
              current={currentForm as string}
              type="token"
              max={tokenValue as string}
              value={tokenValue as string}
              setValue={(value) => handleInputChange(value, "token")}
              tokenSymbol="BIG"
              tokenBalance={tokenValue as string}
            />
          </div>
          {activeAccount?.address ? (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <button
                onClick={executeSwap}
                disabled={isLoading as boolean}
                className={styles.swapButton}
              >
                {isLoading ? "Loading..." : "Swap"}
              </button>
            </div>
          ) : (
            <p>Connect wallet to exchange.</p>
          )}
        </div>
      </div>
    </main>
  );
};
