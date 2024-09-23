"use client";
import { useState, useEffect } from "react";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  toWei,
  toEther,
} from "thirdweb";
import { getBalance, getCurrencyMetadata } from "thirdweb/extensions/erc20";
import {
  useReadContract,
  useActiveAccount,
  useWalletBalance,
  useSendTransaction,
} from "thirdweb/react";
import styles from "@/app/styles/Dex.module.css";
import SwapInput from "./SwapInput";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

export const DexComponent = () => {
  const TOKEN_ADDRESS = "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56";
  const DEX_ADDRESS = "0xADC9c9270A394fB84CF28E28D45e2513CEAD35Bb";

  const activeAccount = useActiveAccount();

  const tokenContract = getContract({
    client,
    chain: base,
    address: TOKEN_ADDRESS,
  });

  const dexContract = getContract({
    client,
    chain: base,
    address: DEX_ADDRESS,
  });
  // Fetch Token Metadata
  const { data: tokenMetadata, isLoading: tokenMetadataLoading } =
    useReadContract(getCurrencyMetadata, {
      contract: tokenContract,
    });

  // Fetch BIG Token Balance
  const { data: tokenBalance, isLoading: tokenBalanceLoading } =
    useReadContract(getBalance, {
      contract: tokenContract,
      address: activeAccount?.address || "",
    });

  // Fetch Native Token Balance
  const { data: nativeBalance, isLoading: nativeBalanceLoading } =
    useWalletBalance({
      client,
      chain: base,
      address: activeAccount?.address || "",
    });

  // Fetch Dex/BIG Balance
  const { data: contractTokenBalance, isLoading: contractTokenBalanceLoading } =
    useReadContract(getBalance, {
      contract: tokenContract,
      address: DEX_ADDRESS,
    });

  const [contractBalance, setContractBalance] = useState<String>("0");
  const [nativeValue, setNativeValue] = useState<String>("0");
  const [tokenValue, setTokenValue] = useState<String>("0");
  const [currentForm, setCurrentForm] = useState<String>("native");
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  // Swap Native Token to BIG
  const { mutateAsync: swapNativeToken } = useSendTransaction();

  // Swap BIG to Native
  const { mutateAsync: swapBigToNative } = useSendTransaction();

  // Approve Token Spending
  const { mutateAsync: approveTokenSpending } = useSendTransaction();

  const handleSwapNativeToken = async () => {
    setIsLoading(true);
    try {
      const transaction = prepareContractCall({
        contract: dexContract,
        method: "function swapEthToToken() payable",
        params: [],
      });

      const tx = await swapNativeToken(transaction);
      console.log(tx);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: amountToGet, isPending } = useReadContract({
    contract: dexContract,
    method:
      "function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) pure returns (uint256)",
    params:
      currentForm === "native"
        ? [
            toWei((nativeValue as string) || "0"),
            toWei((contractBalance as string) || "0"),
            contractTokenBalance?.value || 0n,
          ]
        : [
            toWei((tokenValue as string) || "0"),
            contractTokenBalance?.value || 0n,
            toWei((contractBalance as string) || "0"),
          ],
  });

  // Execute the swap
  // This function will swap the token to native or the native to the token
  const executeSwap = async () => {
    setIsLoading(true);
    try {
      if (currentForm === "native") {
        await swapNativeToken({
          client,
          chain: base,
          value: toWei((nativeValue as string) || "0"),
        });
        alert("Swap executed successfully");
      } else {
        await approveTokenSpending({
          client,
          chain: base,
          value: toWei((nativeValue as string) || "0"),
        });
        await swapBigToNative({
          client,
          chain: base,
          value: toWei((tokenValue as string) || "0"),
        });
        alert("Swap executed successfully");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to execute the swap");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapBigToNative = async () => {
    setIsLoading(true);
    try {
      const transaction = prepareContractCall({
        contract: dexContract,
        method: "function swapTokenToEth(uint256 _tokensSold)",
        params: [amountToGet || 0n],
      });

      const tx = await swapBigToNative(transaction);

      console.log(tx);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchContractBalance = async () => {
      try {
        const balance = await getBalance({
          contract: dexContract,
          address: DEX_ADDRESS,
        });
        setContractBalance(toEther(balance?.value));
      } catch (error) {
        console.error("Error fetching contract balance:", error);
      }
    };

    // Fetch immediately on component mount
    fetchContractBalance();

    // Set up interval to fetch every 10 seconds
    const intervalId = setInterval(fetchContractBalance, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [dexContract]);

  useEffect(() => {
    if (!amountToGet) return;
    if (currentForm === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet, currentForm]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div
          style={{
            backgroundColor: "#111",
            padding: "2rem",
            borderRadius: "10px",
            minWidth: "500px",
          }}
        >
          <div>
            <SwapInput
              current={currentForm as string}
              type="native"
              max={nativeBalance?.displayValue}
              value={nativeValue as string}
              setValue={setNativeValue}
              tokenSymbol="ETH"
              tokenBalance={nativeBalance?.displayValue}
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
              max={tokenBalance?.displayValue}
              value={tokenValue as string}
              setValue={setTokenValue}
              tokenSymbol={tokenMetadata?.symbol as string}
              tokenBalance={tokenBalance?.displayValue}
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
