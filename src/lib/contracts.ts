import { base } from "thirdweb/chains";
import { client } from "@/app/consts/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";
import { voteABI } from "./voteABI";
import { dexABI } from "./dexABI";

const nftContractAddress = "0x214cDD4C76Aa2A632Cc64AF522326f2a1f191908";
const rewardTokenContractAddress = "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56";
const stakingContractAddress = "0xCc5447e03b827CE620BCfC8D3b4edF3043D43704";
const votingContractAddress = "0xe26e4c90e38Bf7a2753e97397307DD6fA7e576A2";
const dexContractAddress = "0xADC9c9270A394fB84CF28E28D45e2513CEAD35Bb";
export const FACTORY_CONTRACT = "0xE90DebFD907F5B655f22bfC16083E45994d708bE";
export const TOKEN_ADDRESS = "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56";

export const NFT_CONTRACT = getContract({
  client: client,
  chain: base,
  address: nftContractAddress,
});

// Standard ERC20 ABI for balanceOf
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
] as const;

export const REWARD_TOKEN_CONTRACT = getContract({
  client: client,
  chain: base,
  address: rewardTokenContractAddress,
  abi: ERC20_ABI,
});

export const STAKING_CONTRACT = getContract({
  client: client,
  chain: base,
  address: stakingContractAddress,
  abi: stakingABI,
});

export const VOTING_CONTRACT = getContract({
  client: client,
  chain: base,
  address: votingContractAddress,
  abi: voteABI,
});

export const DEX_CONTRACT = getContract({
  client: client,
  chain: base,
  address: dexContractAddress,
  abi: dexABI,
});

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const V3_SWAP_ROUTER_ADDRESS =
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
