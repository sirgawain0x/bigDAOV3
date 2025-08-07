"use client";
import { createThirdwebClient, defineChain } from "thirdweb";
import { viemAdapter } from "thirdweb/adapters/viem";
import { useSetActiveWallet, useActiveWallet } from "thirdweb/react";
import { createWalletAdapter } from "thirdweb/wallets";
import { useEffect } from "react";
import {
  useAccount,
  useDisconnect,
  useSwitchChain,
  useWalletClient,
  WagmiConfig,
  createConfig,
  http,
} from "wagmi";
import { base as wagmiBase } from "wagmi/chains";
import { base as thirdwebBase } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";


const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const wagmiConfig = createConfig({
  chains: [wagmiBase],
  transports: {
    [wagmiBase.id]: http(),
  },
});

export function WagmiThirdwebProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ThirdwebProvider>
        <WalletConnector>{children}</WalletConnector>
      </ThirdwebProvider>
    </WagmiConfig>
  );
}

function WalletConnector({ children }: { children: React.ReactNode }) {
  const wagmiAccount = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const setActiveWallet = useSetActiveWallet();
  const thirdwebWallet = useActiveWallet();

  // Set up the wallet connection
  useEffect(() => {
    if (!walletClient || !wagmiAccount.isConnected) return;

    const setActive = async () => {
      try {
        console.log("Setting up wallet adapter...");
        console.log("Wallet client:", walletClient);
        console.log("Account connected:", wagmiAccount.isConnected);
        console.log("Account address:", wagmiAccount.address);
        console.log("Chain ID:", await walletClient.getChainId());

        const adaptedAccount = viemAdapter.walletClient.fromViem({
          walletClient: walletClient as any,
        });
        const w = createWalletAdapter({
          adaptedAccount,
          chain: thirdwebBase,
          client,
          onDisconnect: async () => {
            await disconnectAsync();
          },
          switchChain: async (chain) => {
            try {
              await switchChainAsync({ chainId: chain.id as any });
            } catch (error) {
              console.error("Error switching chain:", error);
            }
          },
        });
        setActiveWallet(w);
        console.log("Wallet adapter set successfully");
      } catch (error) {
        console.error("Error setting up wallet adapter:", error);
      }
    };

    setActive();
  }, [
    walletClient,
    wagmiAccount.isConnected,
    wagmiAccount.address,
    disconnectAsync,
    switchChainAsync,
    setActiveWallet,
  ]);

  // Handle disconnecting from wagmi
  useEffect(() => {
    if (!thirdwebWallet) return;

    const disconnectIfNeeded = async () => {
      if (wagmiAccount.status === "disconnected") {
        await thirdwebWallet.disconnect();
      }
    };

    disconnectIfNeeded().catch(console.error);
  }, [wagmiAccount.status, thirdwebWallet]);

  return <>{children}</>;
}
