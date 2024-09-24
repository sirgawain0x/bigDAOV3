"use client";
import { useEffect, useState, useCallback } from "react";
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

  const getOwnedNFT = useCallback(async () => {
    if (activeAccount) {
      const balance = await balanceOf({
        contract: contract,
        owner: activeAccount?.address as Address,
      });
      setNftOwned(balance.toString());
    }
  }, [activeAccount, contract, setNftOwned]);

  useEffect(() => {
    getOwnedNFT();
  }, [activeAccount, getOwnedNFT]);

  return (
    <div className="mx-auto">
      <div className="flex flex-row my-2">
        {activeAccount ? (
          <p className="mx-auto">You have {nftOwned} assets.</p>
        ) : (
          <p className="mx-auto">Connect to claim an asset.</p>
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
        Claim Asset
      </TransactionButton>
    </div>
  );
}
export default Claim721AButton;
