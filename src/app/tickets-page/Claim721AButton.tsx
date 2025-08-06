"use client";
import { useEffect, useState, useCallback } from "react";
import { TransactionWidget, useActiveAccount } from "thirdweb/react";
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
      <TransactionWidget
        amount={"0.0002"}
        client={client}
        theme="dark"
        transaction={claimTo({
          contract: contract,
          to: activeAccount?.address || "",
          quantity: 1n,
        })}
        title="Juneteenth Unity Celebration"
        description="Claim your BigDAO asset"
        image="/2.png"
      />
      <div className="flex flex-row my-4">
        {activeAccount ? (
          <p className="mx-auto">
            Check the{" "}
            <span className="text-green-500">
              <a href="/stake-page">Earn Vault</a>
            </span>{" "}
            to view your earned rewards.
          </p>
        ) : (
          <p className="mx-auto">Connect to claim an asset.</p>
        )}
      </div>
    </div>
  );
}
export default Claim721AButton;
