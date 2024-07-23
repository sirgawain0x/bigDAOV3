import { base } from "thirdweb/chains";
import { client } from "@/app/consts/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";

const nftContractAddress = "<contract_address>";
const rewardTokenContractAddress = "<contract_address>";
const stakingContractAddress = "<contract_address>";

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
