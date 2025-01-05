import React, { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { formatEther } from 'viem';
import { DEX_CONTRACT } from '@/lib/contracts';

interface Trade {
  timestamp: number;
  hash: string;
  type: 'BUY' | 'SELL';
  amount: bigint;
  price: number;
}

export function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    const fetchTradeHistory = async () => {
      if (!activeAccount?.address) return;

      try {
        setLoading(true);
        
        // Get transfer events
        const transferFilter = DEX_CONTRACT.filters.Transfer(
          null,
          activeAccount.address
        );
        
        const events = await DEX_CONTRACT.queryFilter(transferFilter, -1000); // Last 1000 blocks
        
        const tradeData = await Promise.all(
          events.map(async (event) => {
            const block = await event.getBlock();
            return {
              timestamp: block.timestamp,
              hash: event.transactionHash,
              type: event.args.from === "0x0000000000000000000000000000000000000000" ? 'BUY' : 'SELL',
              amount: event.args.value,
              price: 0, // Calculate based on your AMM formula
            };
          })
        );

        setTrades(tradeData.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error('Error fetching trade history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();
    // Refresh every minute
    const interval = setInterval(fetchTradeHistory, 60000);
    return () => clearInterval(interval);
  }, [activeAccount?.address]);

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
              <span className={trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                {trade.type}
              </span>
              <span className="ml-2 text-sm">
                {formatEther(trade.amount)} {trade.type === 'BUY' ? 'BIG' : 'ETH'}
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
