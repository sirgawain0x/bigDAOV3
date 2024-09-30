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
export const FACTORY_CONTRACT = "0xE90DebFD907F5B655f22bfC16083E45994d708bE";
export const TOKEN_ADDRESS = "0x7DFECBf3bf20eA5B1fAce4f6936be71be130Bd56";
export const DEX_ADDRESS = "0xADC9c9270A394fB84CF28E28D45e2513CEAD35Bb";

export const NFT_CONTRACT = getContract({
  client: client,
  chain: base,
  address: nftContractAddress,
});

export const REWARD_TOKEN_CONTRACT = getContract({
  client: client,
  chain: base,
  address: rewardTokenContractAddress,
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
  address: DEX_ADDRESS,
  abi: dexABI,
});
