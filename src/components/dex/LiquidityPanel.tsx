import React, { useState } from 'react';
import { useLiquidity } from '@/hooks/useLiquidity';
import { Button } from '@/components/ui/button';
import { DEX_CONTRACT, TOKEN_ADDRESS } from '@/lib/contracts';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, sendTransaction, toWei, Account } from 'thirdweb';
import { formatEther } from 'viem';
import approve from '@/app/transactions/approve';

export function LiquidityPanel() {
  const { liquidityInfo, loading } = useLiquidity();
  const [ethAmount, setEthAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);
  const activeAccount = useActiveAccount();

  const addLiquidity = async () => {
    if (!activeAccount?.address || !ethAmount || !tokenAmount) return;
    
    try {
      setIsAddingLiquidity(true);
      const tokenAmountBigInt = BigInt(toWei(tokenAmount));
      
      // First approve tokens
      await approve({
        amount: tokenAmountBigInt,
        token: {
          name: "BIG",
          decimals: 18,
          symbol: "BIG",
          address: TOKEN_ADDRESS,
        },
        spender: DEX_CONTRACT.address,
      });

      // Then add liquidity
      const tx = prepareContractCall({
        contract: DEX_CONTRACT,
        method: "addLiquidity",
        params: [tokenAmountBigInt],
        value: BigInt(toWei(ethAmount)),
      });

      await sendTransaction({
        transaction: tx,
        account: activeAccount as Account,
      });

    } catch (error) {
      console.error('Error adding liquidity:', error);
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  const removeLiquidity = async () => {
    if (!activeAccount?.address || !liquidityInfo?.userLPBalance) return;
    
    try {
      setIsRemovingLiquidity(true);
      
      const tx = prepareContractCall({
        contract: DEX_CONTRACT,
        method: "removeLiquidity",
        params: [liquidityInfo.userLPBalance],
      });

      await sendTransaction({
        transaction: tx,
        account: activeAccount as Account,
      });

    } catch (error) {
      console.error('Error removing liquidity:', error);
    } finally {
      setIsRemovingLiquidity(false);
    }
  };

  if (loading) return <div>Loading liquidity info...</div>;

  return (
    <div className="bg-background/95 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Liquidity Pool</h2>
      
      {/* Pool Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">ETH Reserve</p>
          <p className="font-medium">{liquidityInfo ? formatEther(liquidityInfo.ethReserve) : '0'} ETH</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">BIG Reserve</p>
          <p className="font-medium">{liquidityInfo ? formatEther(liquidityInfo.tokenReserve) : '0'} BIG</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Your Share</p>
          <p className="font-medium">{liquidityInfo?.userShare.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total LP Supply</p>
          <p className="font-medium">{liquidityInfo ? formatEther(liquidityInfo.totalLPSupply) : '0'}</p>
        </div>
      </div>

      {/* Add Liquidity Form */}
      <div className="space-y-4 mb-4">
        <input
          type="number"
          placeholder="ETH Amount"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          className="w-full p-2 rounded border"
        />
        <input
          type="number"
          placeholder="BIG Amount"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          className="w-full p-2 rounded border"
        />
        <Button 
          onClick={addLiquidity}
          disabled={isAddingLiquidity || !ethAmount || !tokenAmount}
          className="w-full"
        >
          {isAddingLiquidity ? 'Adding Liquidity...' : 'Add Liquidity'}
        </Button>
      </div>

      {/* Remove Liquidity Button */}
      {liquidityInfo?.userLPBalance && liquidityInfo.userLPBalance > 0n && (
        <Button
          onClick={removeLiquidity}
          disabled={isRemovingLiquidity}
          variant="destructive"
          className="w-full"
        >
          {isRemovingLiquidity ? 'Removing Liquidity...' : 'Remove All Liquidity'}
        </Button>
      )}
    </div>
  );
}
