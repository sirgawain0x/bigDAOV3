import { Staking } from "@/components/staking/Staking";

export default function StakePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 style={{ marginBottom: "20px" }} className="text-6xl">
        Stake Rewards
      </h1>
      <Staking />
    </div>
  );
}
