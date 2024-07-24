"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { base } from "thirdweb/chains";
import { generatePayload, isLoggedIn, login, logout } from "../actions/auth";
import { createWallet, inAppWallet } from "thirdweb/wallets";

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.crypto"),
];

export const LoginButton = () => {
  return (
    <ConnectButton
      accountAbstraction={{
        factoryAddress: "0xE90DebFD907F5B655f22bfC16083E45994d708bE",
        chain: base,
        sponsorGas: false,
      }}
      autoConnect={true}
      supportedNFTs={{
        8453: ["0x214cDD4C76Aa2A632Cc64AF522326f2a1f191908"],
      }}
      supportedTokens={{
        8453: [
          {
            address: "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56",
            name: "BigCoin",
            symbol: "BIG",
            icon: "https://bafybeigj7octmywpez3gyhxger24o3lgntad5uzrb6wa673lv7p774ih4a.ipfs.w3s.link/BigCoin.png",
          },
        ],
      }}
      client={client}
      chain={base}
      wallets={wallets}
      showAllWallets={false}
      theme={"light"}
      connectModal={{
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
      // auth={{
      //   isLoggedIn: async (address) => {
      //     console.log("checking if logged in!", { address });
      //     return await isLoggedIn();
      //   },
      //   doLogin: async (params) => {
      //     console.log("logging in!");
      //     await login(params);
      //   },
      //   getLoginPayload: async ({ address }) => generatePayload({ address }),
      //   doLogout: async () => {
      //     console.log("logging out!");
      //     await logout();
      //   },
      // }}
    />
  );
};
