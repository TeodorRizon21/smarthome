"use client";

import Link from "next/link";
import { ShoppingCart, Package, User, Globe, ShieldAlert } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type MenuItem = {
  label: string;
  href?: string;
  items?: Array<{
    href: string;
    label: string;
  }>;
};

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Smart Projects",
    items: [
      { href: "/smart-comercial", label: "Smart Comercial" },
      { href: "/smart-residence", label: "Smart Residence" },
    ],
  },
  {
    label: "Smart Technologies",
    items: [
      { href: "/smart-lighting", label: "Smart Lighting" },
      { href: "/smart-intercom", label: "Smart Intercom" },
    ],
  },
  { href: "/products", label: "Produse" },
  { href: "/despre", label: "Despre" },
];

export default function Navbar() {
  const { state } = useCart();
  const { isSignedIn, user } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user?.publicMetadata?.isAdmin === true;
  const isModerator = isAdmin || user?.publicMetadata?.isModerator === true;

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navClass = isHomePage
    ? scrolled
      ? "bg-white/95 shadow-md border-b border-gray-200 transition-all duration-300"
      : "bg-transparent border-b-0 shadow-none transition-all duration-300 navbar--transparent"
    : "bg-white border-b border-gray-200 shadow-md";

  const transparent = isHomePage && !scrolled;

  return (
    <nav className={navClass + " fixed top-0 left-0 w-full z-50"}>
      {/* Mobile navbar */}
      <div className="flex flex-col w-full px-4 pt-4 pb-2 block nav:hidden">
        <div className="flex items-center justify-between w-full">
          {isHomePage ? (
            <span className={`text-lg font-bold ${transparent ? "text-white" : "text-blue-900"}`}>
              SmartHomeMall
            </span>
          ) : (
            <Link href="/" className="flex items-center">
              <Image
                src="/sigla smart home.svg"
                alt="SmartHomeMall Logo"
                width={50}
                height={50}
                className="w-[100px] h-[50px]"
              />
            </Link>
          )}
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className={transparent ? "text-white" : "text-blue-900"}
              >
                <ShoppingCart
                  className={transparent ? "text-white" : "text-blue-900"}
                />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                variant="ghost"
                size="icon"
                className={transparent ? "text-white" : "text-blue-900"}
              >
                <Package
                  className={transparent ? "text-white" : "text-blue-900"}
                />
              </Button>
            </Link>
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: transparent ? { borderColor: "#fff" } : { borderColor: "#1e293b" },
                  },
                  variables: { colorPrimary: transparent ? "#fff" : "#1e293b" },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="icon"
                  className={transparent ? "text-white" : "text-blue-900"}
                >
                  <User
                    className={transparent ? "text-white" : "text-blue-900"}
                  />
                </Button>
              </SignInButton>
            )}
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Desktop navbar */}
      <div className="hidden nav:flex">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-around gap-4">
            {/* Left section - Logo */}
            {isHomePage ? (
              <>
                <div className="flex-1">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/sigla smart home.svg"
                      alt="SmartHomeMall Logo"
                      width={50}
                      height={50}
                      className="w-[100px] h-[50px] 2xl:w-[50px] 2xl:h-[50px] xl:w-[60px] xl:h-[60px]"
                    />
                  </Link>
                </div>
                <div className="flex-1 flex justify-center">
                  <span className={
                    "text-xl font-bold uppercase hidden 2xl:block " +
                    (transparent ? "text-white" : "text-blue-900")
                  }>
                    SmartHomeMall
                  </span>
                </div>
                <div className="flex-1 flex justify-end">
                  {/* Right section */}
                  <div className="flex items-center gap-4">
                    <div className="w-48">
                      <SearchBar
                        className={transparent ? "text-white placeholder-white" : ""}
                        transparent={transparent}
                      />
                    </div>

                    {isAdmin && (
                      <Link href="/admin">
                        <Button
                          variant="ghost"
                          className={transparent ? "text-white" : "text-blue-900"}
                        >
                          {t("nav.admin")}
                        </Button>
                      </Link>
                    )}

                    {isModerator && (
                      <Link href="/moderator">
                        <Button
                          variant="ghost"
                          className={
                            "flex items-center gap-1 " +
                            (transparent ? "text-white" : "text-blue-900")
                          }
                        >
                          <ShieldAlert
                            className={transparent ? "text-white" : "text-blue-900"}
                          />
                          Moderator
                        </Button>
                      </Link>
                    )}

                    <Link href="/cart">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={
                          "relative " + (transparent ? "text-white" : "text-blue-900")
                        }
                      >
                        <ShoppingCart
                          className={transparent ? "text-white" : "text-blue-900"}
                        />
                        {itemCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </Button>
                    </Link>

                    <Link href="/orders">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={transparent ? "text-white" : "text-blue-900"}
                      >
                        <Package
                          className={transparent ? "text-white" : "text-blue-900"}
                        />
                      </Button>
                    </Link>

                    {/* Language switcher */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={transparent ? "text-white" : "text-blue-900"}
                        >
                          <Globe
                            className={transparent ? "text-white" : "text-blue-900"}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage("ro")}>
                          Română {language === "ro" && "✓"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage("en")}>
                          English {language === "en" && "✓"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User button */}
                    {isSignedIn ? (
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: transparent ? { borderColor: "#fff" } : {},
                          },
                          variables: {
                            colorPrimary: transparent ? "#fff" : "#1e293b",
                          },
                        }}
                      />
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={transparent ? "text-white" : "text-blue-900"}
                        >
                          <User
                            className={transparent ? "text-white" : "text-blue-900"}
                          />
                        </Button>
                      </SignInButton>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/" className="flex items-center">
                  <Image
                    src="/sigla smart home.svg"
                    alt="SmartHomeMall Logo"
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] 2xl:w-[50px] 2xl:h-[50px] xl:w-[60px] xl:h-[60px] mr-2"
                  />
                  <span className={
                    "text-xl font-bold uppercase hidden 2xl:block " +
                    (transparent ? "text-white" : "text-blue-900")
                  }>
                    SmartHomeMall
                  </span>
                </Link>

                {/* Center section - Menu */}
                <div className="flex items-center">
                  {MENU_ITEMS.map((item, index) => (
                    <div key={item.label} className="px-6 first:pl-0 last:pr-0">
                      {item.items ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`text-sm font-medium transition-colors hover:text-primary group ${
                                transparent ? "text-white" : "text-gray-600"
                              }`}
                            >
                              {item.label}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="start"
                            className="w-48 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                          >
                            {item.items.map((subItem) => (
                              <DropdownMenuItem 
                                key={subItem.href} 
                                asChild
                                className="focus:bg-blue-50 focus:text-blue-600"
                              >
                                <Link href={subItem.href} className="w-full px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                                  {subItem.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          className={`text-sm font-medium transition-colors hover:text-primary ${
                            transparent ? "text-white" : "text-gray-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                  <div className="w-48">
                    <SearchBar
                      className={transparent ? "text-white placeholder-white" : ""}
                      transparent={transparent}
                    />
                  </div>

                  {isAdmin && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className={transparent ? "text-white" : "text-blue-900"}
                      >
                        {t("nav.admin")}
                      </Button>
                    </Link>
                  )}

                  {isModerator && (
                    <Link href="/moderator">
                      <Button
                        variant="ghost"
                        className={
                          "flex items-center gap-1 " +
                          (transparent ? "text-white" : "text-blue-900")
                        }
                      >
                        <ShieldAlert
                          className={transparent ? "text-white" : "text-blue-900"}
                        />
                        Moderator
                      </Button>
                    </Link>
                  )}

                  <Link href="/cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={
                        "relative " + (transparent ? "text-white" : "text-blue-900")
                      }
                    >
                      <ShoppingCart
                        className={transparent ? "text-white" : "text-blue-900"}
                      />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link href="/orders">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={transparent ? "text-white" : "text-blue-900"}
                    >
                      <Package
                        className={transparent ? "text-white" : "text-blue-900"}
                      />
                    </Button>
                  </Link>

                  {/* Language switcher */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={transparent ? "text-white" : "text-blue-900"}
                      >
                        <Globe
                          className={transparent ? "text-white" : "text-blue-900"}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLanguage("ro")}>
                        Română {language === "ro" && "✓"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguage("en")}>
                        English {language === "en" && "✓"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User button */}
                  {isSignedIn ? (
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: transparent ? { borderColor: "#fff" } : {},
                        },
                        variables: {
                          colorPrimary: transparent ? "#fff" : "#1e293b",
                        },
                      }}
                    />
                  ) : (
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={transparent ? "text-white" : "text-blue-900"}
                      >
                        <User
                          className={transparent ? "text-white" : "text-blue-900"}
                        />
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
