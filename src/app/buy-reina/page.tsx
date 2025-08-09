import { NextPage } from "next";
import { BuyReinaComponent } from "@/components/buy-reina/BuyReinaComponent";

const BuyReinaPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start p-4 overflow-x-hidden">
      <header className="flex flex-col items-center justify-center w-full py-4 sm:py-6 lg:py-8">
        <div className="mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Buy Reina
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-medium text-center">
            Purchase Reina tokens using cbBTC with real-time pricing from OnBons API.
          </p>
        </div>
      </header>
      <BuyReinaComponent />
    </div>
  );
};

export default BuyReinaPage;
