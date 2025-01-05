import { Address } from "thirdweb";
import Token from "@/app/types/token";
import getContract from "@/lib/get-contract";
import { base } from "thirdweb/chains";
import { approve as thirdwebApprove } from "thirdweb/extensions/erc20";

type ApproveOptions = {
  token: Token;
  amount: bigint; // Ensure this is a bigint
  spender: Address;
};

export default async function approve(options: ApproveOptions) {
  const contract = getContract({
    address: options.token.address as Address,
    chain: base,
  });

  // Ensure amount is passed as a bigint
  return await thirdwebApprove({
    contract,
    spender: options.spender,
    amountWei: options.amount, // Ensure this is a bigint
  });
}
