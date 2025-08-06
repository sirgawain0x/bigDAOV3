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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const Navbar = () => {
  const activeAccount = useActiveAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="my-4 mx-4">
      <div className="flex justify-between items-center">
        {/* Logo on the far left (visible only on larger screens) */}
        <div className="hidden md:block">
          <Link href="/" passHref>
            <Image
              src="/BigDAOLogo2.svg"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* Mobile Menu Button (replaces logo on mobile) */}
        <div className="md:hidden">
          {activeAccount && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <MenuIcon className="w-6 h-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="left">
                <div className="flex flex-col items-center space-y-4">
                  {/* Logo inside the mobile menu */}
                  <SheetHeader onClick={handleLinkClick}>
                    <div className="mb-4">
                      <Link href="/" passHref>
                        <Image
                          src="/BigDAOLogo2.svg"
                          alt="Logo"
                          width={100}
                          height={100}
                        />
                      </Link>
                    </div>
                  </SheetHeader>
                  <NavigationMenu>
                    <NavigationMenuList className="flex flex-col space-y-4">
                      <NavigationMenuItem>
                        <Link href="/tickets-page" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={handleLinkClick}
                          >
                            Assets
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/stake-page" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={handleLinkClick}
                          >
                            Earn Vault
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/liquidity-page" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={handleLinkClick}
                          >
                            Provide Liquidity
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/dex-page" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={handleLinkClick}
                          >
                            Swap
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/voting-page" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={handleLinkClick}
                          >
                            Vote
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/leaderboard" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={handleLinkClick}
                          >
                            Leaderboard
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </SheetContent>
            </Sheet>
          )}
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
                        Assets
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/stake-page" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Earn Vault
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/liquidity-page" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        onClick={handleLinkClick}
                      >
                        Provide Liquidity
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/dex-page" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Swap
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
    </div>
  );
};

export default Navbar;
