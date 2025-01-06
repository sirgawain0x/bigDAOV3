import { Staking } from "@/components/staking/Staking";
import { NextPage } from "next";
import { StakeRewards } from "@/components/staking/StakeRewards";

const StakePage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start p-4 overflow-x-hidden">
      <header className="flex flex-col items-center justify-center w-full py-4 sm:py-6 lg:py-8">
        <div className="mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center">
            Earn Vault Rewards
          </h1>
        </div>
      </header>
      <main className="flex-grow w-full max-w-[1440px] space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="w-full bg-background/95 rounded-lg shadow-lg p-4 sm:p-6">
          <StakeRewards />
        </div>
        <div className="w-full bg-background/95 rounded-lg shadow-lg p-4 sm:p-6">
          <Staking />
        </div>
      </main>
    </div>
  );
};

export default StakePage;
