"use client";
import { useActiveAccount } from "thirdweb/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { LoginButton } from "@/app/consts/LoginButton";
import { useState } from "react";

const Navbar = () => {
  const activeAccount = useActiveAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="my-4 mx-4">
      <div className="flex justify-between items-center">
        {/* Logo on the far left (visible only on larger screens) */}
        <div className="hidden md:block">
          <Link href="/" passHref>
            <Image src="/BigDAOLogo2.svg" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        {/* Mobile Menu Button (replaces logo on mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
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

        {/* Centered Navigation Menu (visible on larger screens) */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
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
                  <NavigationMenuItem>
                    <Link href="/leaderboard" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Leaderboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Login button on the far right */}
        <div className="flex items-center">
          <LoginButton />
        </div>
      </div>

      {/* Mobile Dropdown menu with Logo inside */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden mt-4`}>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col space-y-4">
            {/* Logo inside the mobile menu */}
            <div className="flex justify-center mb-4">
              <Link href="/" passHref>
                <Image
                  src="/BigDAOLogo2.svg"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
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
                <NavigationMenuItem>
                  <Link href="/leaderboard" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Leaderboard
                    </NavigationMenuLink>
                  </Link>
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
