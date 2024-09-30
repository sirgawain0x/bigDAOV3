import { Address, getContract as thirdwebGetContract, Chain } from "thirdweb";
import { client } from "@/app/consts/client";
import { base } from "thirdweb/chains";

type GetContractOptions = {
  address: Address;
  chain?: Chain;
};

export default function getContract(options: GetContractOptions) {
  return thirdwebGetContract({
    client,
    chain: options.chain ?? base,
    address: options.address,
  });
}
