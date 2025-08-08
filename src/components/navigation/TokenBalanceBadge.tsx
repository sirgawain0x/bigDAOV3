"use client";

import { useTokenBalance } from "@/hooks/useTokenBalance";
import Image from "next/image";

type TokenBalanceBadgeProps = {
  label?: string;
};

const TokenBalanceBadge = ({ label = "BIG" }: TokenBalanceBadgeProps) => {
  const { formatted, isLoading } = useTokenBalance();

  return (
    <div
      className="flex items-center gap-2 rounded-full bg-neutral-800 text-white px-3 py-1"
      role="status"
      aria-live="polite"
      aria-label={`${label} token balance`}
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <Image src="/icons/eth-logo.svg" width={16} height={16} alt="Token" />
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-neutral-300">
        {isLoading ? "…" : formatted}
      </span>
    </div>
  );
};

export default TokenBalanceBadge;


