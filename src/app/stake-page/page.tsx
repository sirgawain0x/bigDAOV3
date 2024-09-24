import { Staking } from "@/components/staking/Staking";
import { NextPage } from "next";
import { StakeRewards } from "@/components/staking/StakeRewards";

const StakePage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center overflow-x-hidden">
      <header className="flex flex-col items-center justify-center w-full py-4">
        <div className="mx-auto">
          <h1 className="text-3xl mb-5 text-center">Earn Vault</h1>
        </div>
      </header>
      <main className="flex-grow w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row w-full mb-10">
          <StakeRewards />
        </div>
        <div className="flex flex-row w-full">
          <Staking />
        </div>
      </main>
    </div>
  );
};

export default StakePage;
