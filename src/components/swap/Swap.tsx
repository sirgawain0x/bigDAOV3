"use client";
import {
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
  SwapToast,
} from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useActiveAccount } from "thirdweb/react";

export const SwapComponent = () => {
  const account = useActiveAccount();

  const ETHToken: Token = {
    address: "",
    chainId: 8453,
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
    image:
      "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  };

  const BIGToken: Token = {
    address: "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56",
    chainId: 8453,
    decimals: 18,
    name: "Big Coin",
    symbol: "BIG",
    image:
      "https://bafybeigj7octmywpez3gyhxger24o3lgntad5uzrb6wa673lv7p774ih4a.ipfs.w3s.link/BigCoin.png",
  };

  const swappableTokens: Token[] = [ETHToken, BIGToken];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-8">
      <div className="w-full space-y-6">
        {account ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full">
            <Swap isSponsored>
              <SwapAmountInput
                label="Sell"
                swappableTokens={swappableTokens}
                token={ETHToken}
                type="from"
                className="mb-4"
              />
              <SwapToggleButton className="p-2 rounded-full bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors" />
              <SwapAmountInput
                label="Buy"
                swappableTokens={swappableTokens}
                token={BIGToken}
                type="to"
                className="mt-4"
              />
              <SwapMessage className="mt-4 text-sm" />
              <SwapButton className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium" />
              <SwapToast />
            </Swap>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full"></div>
        )}

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Complete the fields to continue</p>
        </div>
      </div>
    </div>
  );
};
