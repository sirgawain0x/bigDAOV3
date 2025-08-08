"use client";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { base } from "thirdweb/chains";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { FACTORY_CONTRACT } from "@/lib/contracts";

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.crypto.wallet"),
];

export const LoginButton = () => {
  return (
    <ConnectButton
      accountAbstraction={{
        factoryAddress: FACTORY_CONTRACT,
        chain: base,
        sponsorGas: false,
      }}
      autoConnect={true}
      appMetadata={{
        name: "BigDao",
        url: "https://big.creativeplatform.xyz",
        description: "A family owned DAO",
        logoUrl:
          "https://bafybeiggcmjpnxrsywdq6y5mks6l5egrxudaelsjedxwoe5yfyyw7xjnu4.ipfs.w3s.link/BigDAO.png",
      }}
      connectModal={{
        size: "wide",
        privacyPolicyUrl:
          "https://app.charmverse.io/creative-like-brown-fowl/big-dao-privacy-policy-9035723468020447",
        termsOfServiceUrl:
          "https://app.charmverse.io/creative-like-brown-fowl/big-dao-terms-of-service-5694437438861041",
        welcomeScreen: {
          title: "Welcome to BigDAO",
          subtitle: "Where dreams grow big!",
          img: {
            src: "https://bafybeiggcmjpnxrsywdq6y5mks6l5egrxudaelsjedxwoe5yfyyw7xjnu4.ipfs.w3s.link/BigDAO.png",
            width: 200,
            height: 200,
          },
        },
      }}
      supportedNFTs={{
        8453: ["0x214cDD4C76Aa2A632Cc64AF522326f2a1f191908"],
      }}
      supportedTokens={{
        8453: [
          {
            address: "0x3A8df31105Ef1e653EDF8B1B5EE486eB78803266",
            name: "BigCoin",
            symbol: "BIG",
            icon: "https://bafybeigj7octmywpez3gyhxger24o3lgntad5uzrb6wa673lv7p774ih4a.ipfs.w3s.link/BigCoin.png",
          },
          {
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            name: "USDC",
            symbol: "USDC",
            icon: "/icons/usdc-logo.svg",
          },
          {
            address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
            name: "Coinbase Wrapped BTC",
            symbol: "cbBTC",
            icon: "/icons/cbBTC.png",
          }
        ],
      }}
      client={client}
      chain={base}
      wallets={wallets}
      showAllWallets={false}
      theme={"light"}
    />
  );
};
