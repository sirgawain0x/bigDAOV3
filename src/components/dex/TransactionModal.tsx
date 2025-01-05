import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatEther } from 'viem';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  inputAmount: string;
  outputAmount: string;
  inputToken: string;
  outputToken: string;
  priceImpact: number;
  slippageTolerance: number;
  minimumReceived: bigint;
  isLoading: boolean;
}

export function TransactionModal({
  isOpen,
  onClose,
  onConfirm,
  inputAmount,
  outputAmount,
  inputToken,
  outputToken,
  priceImpact,
  slippageTolerance,
  minimumReceived,
  isLoading,
}: TransactionModalProps) {
  const getPriceImpactColor = (impact: number) => {
    if (impact > 5) return 'text-red-500';
    if (impact > 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>
            Please review your transaction details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span>You pay</span>
            <span className="font-medium">
              {inputAmount} {inputToken}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>You receive</span>
            <span className="font-medium">
              {outputAmount} {outputToken}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Minimum received</span>
            <span className="font-medium">
              {formatEther(minimumReceived)} {outputToken}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Slippage tolerance</span>
            <span className="font-medium">{slippageTolerance}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Price Impact</span>
            <span className={`font-medium ${getPriceImpactColor(priceImpact)}`}>
              {priceImpact.toFixed(2)}%
              {priceImpact > 5 && (
                <span className="block text-xs">
                  High price impact! Consider reducing trade size.
                </span>
              )}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading || priceImpact > 10}
          >
            {isLoading ? "Confirming..." : "Confirm Swap"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
