import React from "react";
import styles from "@/app/styles/Dex.module.css";

type Props = {
  type: "native" | "token";
  tokenSymbol?: string;
  tokenBalance?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
}: Props) {
  const truncate = (value: string) => {
    if (value === undefined) return;
    if (value.length > 5) {
      return value.slice(0, 5);
    }
    return value;
  };

  return (
    <div className={styles.swapInputContainer}>
      <div className="flex flex-col w-full">
        <input
          type="number"
          placeholder="0.0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={current !== type}
          className={styles.swapInput}
          step="any"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-300">{tokenSymbol}</span>
            <span className="text-xs text-gray-400">
              Balance: {truncate(tokenBalance as string)}
            </span>
          </div>
          {current === type && (
            <button
              onClick={() => setValue(max || "0")}
              className={styles.maxButton}
            >
              Max
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
