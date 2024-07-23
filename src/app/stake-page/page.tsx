import { Staking } from "@/components/staking/Staking";

export default function StakePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Stake Rewards</h1>
      <Staking />
    </div>
  );
}
