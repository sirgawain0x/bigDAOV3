"use client";
import { useEffect, useState } from "react";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { getContract, type Address } from "thirdweb";
import { balanceOf, claimTo } from "thirdweb/extensions/erc721";
import { client } from "../consts/client";
import { base } from "thirdweb/chains";
import { toast } from "sonner";

function Claim721AButton() {
  const activeAccount = useActiveAccount();
  const contract = getContract({
    client,
    chain: base,
    address: "0x214cDD4C76Aa2A632Cc64AF522326f2a1f191908",
  });
  const [nftOwned, setNftOwned] = useState<string>("0");

  const getOwnedNFT = async () => {
    if (activeAccount) {
      const balance = await balanceOf({
        contract: contract,
        owner: activeAccount?.address as Address,
      });
      setNftOwned(balance.toString());
    }
  };

  useEffect(() => {
    getOwnedNFT();
  }, [activeAccount]);

  return (
    <div className="mx-auto">
      <div className="mx-auto my-2">
        {activeAccount ? (
          <p className="mx-auto">You have {nftOwned} tickets</p>
        ) : (
          <p className="mx-auto">Connect Wallet to pull a ticket.</p>
        )}
      </div>

      <TransactionButton
        transaction={() =>
          claimTo({
            contract: contract,
            to: activeAccount?.address as Address,
            quantity: BigInt(1),
          })
        }
        onTransactionSent={(result) => {
          console.log("Transaction submitted", result.transactionHash);
          toast("Transaction submitted");
        }}
        onTransactionConfirmed={(receipt) => {
          console.log("Transaction confirmed", receipt.transactionHash);
          getOwnedNFT();
          toast("Transaction confirmed");
        }}
        onError={(error) => {
          console.error("Transaction error", error);
          toast("Transaction error");
        }}
      >
        Pull A Ticket
      </TransactionButton>
    </div>
  );
}
export default Claim721AButton;
