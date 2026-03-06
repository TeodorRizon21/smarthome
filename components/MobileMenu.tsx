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
  labelKey: "nav.smartProjects" | "nav.smartTechnologies" | "nav.products" | "nav.about";
  href?: string;
  items?: Array<{
    href: string;
    labelKey: "nav.smartComercial" | "nav.smartResidence" | "nav.smartLighting" | "nav.smartIntercom";
  }>;
};

const MENU_ITEMS: MenuItem[] = [
  {
    labelKey: "nav.smartProjects",
    items: [
      { href: "/smart-comercial", labelKey: "nav.smartComercial" },
      { href: "/smart-residence", labelKey: "nav.smartResidence" },
    ],
  },
  {
    labelKey: "nav.smartTechnologies",
    items: [
      { href: "/smart-lighting", labelKey: "nav.smartLighting" },
      { href: "/smart-intercom", labelKey: "nav.smartIntercom" },
    ],
  },
  { href: "/products", labelKey: "nav.products" },
  { href: "/despre", labelKey: "nav.about" },
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
          className={`nav:hidden shrink-0 ${transparent ? "text-white hover:bg-white/10" : "text-blue-900 hover:bg-blue-50"}`}
        >
          <Menu className="shrink-0" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 p-0 flex flex-col bg-white">
        <SheetHeader className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{t("nav.menu")}</h2>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col divide-y divide-gray-100">
            {MENU_ITEMS.map((item) => (
              <div key={item.labelKey} className="py-4 px-6">
                {item.items ? (
                  <>
                    <div className="text-base font-semibold text-gray-900 mb-3">
                      {t(item.labelKey)}
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
                          {t(subItem.labelKey)}
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
                    {t(item.labelKey)}
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

