"use client";
import { useActiveAccount } from "thirdweb/react";

export const SwapComponent = () => {
  const account = useActiveAccount();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-8">
      <div className="w-full space-y-6">
        {account ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Swap Coming Soon</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We&apos;re working on a new swap interface. Stay tuned!
                </p>
              </div>
              
              {/* Placeholder for swap inputs */}
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sell</span>
                    <span className="text-sm text-gray-500">0.0</span>
                  </div>
                  <div className="mt-2">
                    <input 
                      type="text" 
                      placeholder="0.0" 
                      className="w-full bg-transparent text-lg font-semibold outline-none"
                      disabled
                    />
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button className="p-2 rounded-full bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Buy</span>
                    <span className="text-sm text-gray-500">0.0</span>
                  </div>
                  <div className="mt-2">
                    <input 
                      type="text" 
                      placeholder="0.0" 
                      className="w-full bg-transparent text-lg font-semibold outline-none"
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Connect Wallet to Swap
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Connect Wallet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please connect your wallet to access the swap feature.
              </p>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Complete the fields to continue</p>
        </div>
      </div>
    </div>
  );
};
