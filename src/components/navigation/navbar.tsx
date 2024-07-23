"use client";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { toEther } from "thirdweb";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { balanceOf } from "thirdweb/extensions/erc20";
import { REWARD_TOKEN_CONTRACT } from "@/lib/contracts";
import Link from "next/link";
import { LoginButton } from "@/app/consts/LoginButton";
import { useState } from "react";

const Navbar = () => {
  const activeAccount = useActiveAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    data: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useReadContract(balanceOf, {
    contract: REWARD_TOKEN_CONTRACT,
    address: activeAccount?.address || "",
  });

  return (
    <div className="my-4 mx-4 md:columns-xs xs:columns-3xs">
      <div className="flex justify-between items-center">
        <LoginButton />
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* Menu Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex md:items-center md:justify-between`}
      >
        <NavigationMenu className="my-4 mx-4 w-full">
          <NavigationMenuList className="flex flex-col md:flex-row md:space-x-4">
            <NavigationMenuItem></NavigationMenuItem>
            {activeAccount && (
              <>
                <NavigationMenuItem>
                  <Link href="/tickets-page" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Tickets
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/stake-page" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Stake
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/voting-page" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Vote
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {isTokenBalanceLoading ?? (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Loading...
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {toEther(BigInt(tokenBalance?.toString() || "0"))} BIG
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
