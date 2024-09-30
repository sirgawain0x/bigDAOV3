import { Address } from "thirdweb";
import Token from "@/app/types/token";
import getContract from "@/lib/get-contract";
import { base } from "thirdweb/chains";
import { approve as thirdwebApprove } from "thirdweb/extensions/erc20";

type ApproveOptions = {
  token: Token;
  amount: bigint;
  spender: Address;
};

export default function approve(options: ApproveOptions) {
  const contract = getContract({
    address: options.token.address as Address,
    chain: base,
  });

  return thirdwebApprove({
    contract,
    spender: options.spender,
    amountWei: options.amount,
  });
}
