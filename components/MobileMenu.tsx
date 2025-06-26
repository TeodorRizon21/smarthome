"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"
import { useLanguage } from "@/contexts/language-context"

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

export default function MobileMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.isAdmin === true
  const { language, setLanguage, t } = useLanguage()
  const isHomePage = pathname === "/"
  const [scrolled, setScrolled] = useState(false)
  const transparent = isHomePage && !scrolled

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`block nav:hidden ml-2 ${transparent ? "text-white hover:bg-white/10" : "text-blue-900 hover:bg-blue-50"}`}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 p-0 flex flex-col bg-white">
        <SheetHeader className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col divide-y divide-gray-100">
            {MENU_ITEMS.map((item) => (
              <div key={item.label} className="py-4 px-6">
                {item.items ? (
                  <>
                    <div className="text-base font-semibold text-gray-900 mb-3">
                      {item.label}
                    </div>
                    <div className="space-y-3 pl-3">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center text-sm transition-colors hover:text-blue-600",
                            pathname === subItem.href
                              ? "text-blue-600 font-medium"
                              : "text-gray-600"
                          )}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></div>
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block text-base font-semibold transition-colors hover:text-blue-600",
                      pathname === item.href
                        ? "text-blue-600"
                        : "text-gray-900"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
          {isAdmin && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors font-medium" 
                onClick={() => setIsOpen(false)}
              >
                <span>{t("nav.admin")}</span>
              </Link>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-900">
              <Globe className="h-5 w-5" />
              <span className="font-medium">{t("nav.language")}</span>
            </div>
            <Select value={language} onValueChange={(value: "en" | "ro") => setLanguage(value)}>
              <SelectTrigger className="w-24 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                <SelectValue placeholder={t("nav.language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ro">Română</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

