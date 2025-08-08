"use client";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/app/consts/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

export function WagmiThirdwebProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wagmiConfig = createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
    ssr: true,
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <ThirdwebProvider client={client}>{children}</ThirdwebProvider>
    </WagmiProvider>
  );
}

// Keep the old name for backward compatibility
export const ThirdwebProviderWrapper = WagmiThirdwebProvider;