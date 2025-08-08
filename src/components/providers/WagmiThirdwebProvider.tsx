"use client";
import { ThirdwebProvider } from "thirdweb/react";
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
      <ThirdwebProvider>
        {children}
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

// Keep the old name for backward compatibility
export const ThirdwebProviderWrapper = WagmiThirdwebProvider;