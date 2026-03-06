import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProvider } from "@/contexts/language-context";
import Navbar from "@/components/Navbar";
import CollectionsNav from "@/components/CollectionsNav";
import BackButton from "@/components/BackButton";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "SmartHomeMall",
  description:
    "Discover your signature scent from our exquisite collection of luxury perfumes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          <LanguageProvider>
            <CartProvider>
              <Navbar />
              <CollectionsNav />

              {children}
              <Toaster />
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
