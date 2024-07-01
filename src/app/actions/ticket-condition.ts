import { getContract, type Address, type NFT } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "../consts/client";
import { balanceOf as balanceOfERC721 } from "thirdweb/extensions/erc721";

export async function hasAccess(address: Address): Promise<boolean> {
  return await hasSomeTickets(address);
  // return await hasSomeTickets(address);
}

async function hasSomeTickets(address: Address) {
  const requiredQuantity = 1n;

  const erc721Contract = getContract({
    // replace with your own NFT contract address
    address: "0x214cDD4C76Aa2A632Cc64AF522326f2a1f191908",
    // replace with the chain that your nft contract was deployed on
    // if that chain isn't included in our default list, use `defineChain`
    chain: base,
    client,
  });

  const ownedBalance = await balanceOfERC721({
    contract: erc721Contract,
    owner: address,
  });

  console.log({ ownedBalance });

  return ownedBalance >= requiredQuantity;
}
