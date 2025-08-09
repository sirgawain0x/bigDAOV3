import React from "react";
import { TokenConfig, TOKENS } from "@/lib/tokenConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface Props {
  selectedToken: TokenConfig;
  onTokenChange: (token: TokenConfig) => void;
  value: string;
  setValue: (value: string) => void;
  balance?: string;
  disabled?: boolean;
  tokenSelectorDisabled?: boolean;
  placeholder?: string;
}

export default function TokenSwapInput({
  selectedToken,
  onTokenChange,
  value,
  setValue,
  balance,
  disabled = false,
  tokenSelectorDisabled = false,
  placeholder = "0.0",
}: Props) {
  const truncate = (value: string) => {
    if (!value) return "0";
    if (value.length > 8) {
      return parseFloat(value).toFixed(4);
    }
    return value;
  };

  const handleMaxClick = () => {
    if (balance) {
      setValue(balance);
    }
  };

  return (
    <div className="w-full p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">You {disabled ? "receive" : "pay"}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            Balance: {truncate(balance || "0")}
          </span>
          {!disabled && balance && parseFloat(balance) > 0 && (
            <button
              onClick={handleMaxClick}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Max
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <input
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            className="w-full text-2xl font-semibold bg-transparent border-none outline-none disabled:opacity-50"
            step="any"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedToken.logo && (
            <Image
              src={selectedToken.logo}
              alt={selectedToken.symbol}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          
          <Select
            value={selectedToken.symbol}
            onValueChange={(symbol) => {
              const token = TOKENS[symbol];
              if (token) {
                onTokenChange(token);
              }
            }}
            disabled={tokenSelectorDisabled}
          >
            <SelectTrigger className="w-24 border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TOKENS).map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center space-x-2">
                    {token.logo && (
                      <Image
                        src={token.logo}
                        alt={token.symbol}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
