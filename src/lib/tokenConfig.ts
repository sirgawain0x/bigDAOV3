import { NATIVE_TOKEN_ADDRESS } from "thirdweb";

export interface TokenConfig {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logo?: string;
}

export const TOKENS: Record<string, TokenConfig> = {
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    address: NATIVE_TOKEN_ADDRESS,
    decimals: 18,
    logo: "/icons/eth-logo.svg",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimals: 6,
    logo: "/icons/usdc-logo.svg",
  },
  cbBTC: {
    name: "Coinbase Wrapped Bitcoin",
    symbol: "cbBTC",
    address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
    decimals: 8,
    logo: "/icons/cbBTC.png",
  },
  BIG: {
    name: "BigCoin",
    symbol: "BIG",
    address: "0x3A8df31105Ef1e653EDF8B1B5EE486eB78803266",
    decimals: 18,
    logo: "/icons/BigDAO512.png",
  },
};

export const getTokenByAddress = (address: string): TokenConfig | undefined => {
  return Object.values(TOKENS).find(token => token.address.toLowerCase() === address.toLowerCase());
};

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS[symbol.toUpperCase()];
};
