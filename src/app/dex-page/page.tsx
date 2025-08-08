import { NextPage } from "next";
import { DexComponent } from "@/components/dex/DexComponent";

const DexPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start p-4 overflow-x-hidden">
      <header className="flex flex-col items-center justify-center w-full py-4 sm:py-6 lg:py-8">
        <div className="mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Swap Tokens
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-medium text-center">
            Swap ETH and BIG tokens instantly.
          </p>
        </div>
      </header>
      <DexComponent />
    </div>
  );
};

export default DexPage;
