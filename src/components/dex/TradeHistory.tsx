import React, { useEffect, useState } from "react";
import { useActiveAccount, useContractEvents } from "thirdweb/react";
import { formatEther } from "viem";
import { DEX_CONTRACT } from "@/lib/contracts";
import { prepareEvent } from "thirdweb";

interface Trade {
  timestamp: number;
  hash: string;
  type: "BUY" | "SELL";
  amount: bigint;
  price: number;
}

export function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const activeAccount = useActiveAccount();

  const preparedEvent = prepareEvent({
    signature:
      "event Transfer(address indexed from, address indexed to, uint256 value)",
  });

  const { data: events } = useContractEvents({
    contract: DEX_CONTRACT,
    events: [preparedEvent],
  });

  useEffect(() => {
    if (!activeAccount?.address || !events) return;

    try {
      setLoading(true);

      const tradeData: Trade[] = events
        .filter(
          (event) => event.args && "from" in event.args && "value" in event.args
        )
        .map((event) => {
          const args = event.args as {
            from: string;
            to: string;
            value: bigint;
          };
          return {
            timestamp: Math.floor(Date.now() / 1000),
            hash: event.transactionHash,
            type: args.from === DEX_CONTRACT.address ? "SELL" : "BUY",
            amount: args.value,
            price: Number(formatEther(args.value)),
          };
        });

      setTrades(tradeData);
    } catch (error) {
      console.error("Error processing trade history:", error);
    } finally {
      setLoading(false);
    }
  }, [activeAccount?.address, events]);

  if (loading) return <div>Loading trade history...</div>;
  if (!trades.length) return <div>No trade history found</div>;

  return (
    <div className="bg-background/95 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Your Trade History</h2>
      <div className="space-y-2">
        {trades.map((trade) => (
          <div
            key={trade.hash}
            className="flex justify-between items-center p-2 rounded bg-background/10 hover:bg-background/20"
          >
            <div>
              <span
                className={
                  trade.type === "BUY" ? "text-green-500" : "text-red-500"
                }
              >
                {trade.type}
              </span>
              <span className="ml-2 text-sm">
                {formatEther(trade.amount)}{" "}
                {trade.type === "BUY" ? "BIG" : "ETH"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(trade.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
