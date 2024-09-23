import { Staking } from "@/components/staking/Staking";
import { NextPage } from "next";

const StakePage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center overflow-x-hidden">
      <header className="flex flex-col items-center justify-center w-full py-4">
        <div className="mx-auto">
          <h1 className="text-3xl mb-5 text-center">Stake Rewards</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Staking />
      </main>
    </div>
  );
};

export default StakePage;
