import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopProvider } from "@/context/ShopContext";
import { CartDrawer } from "@/components/store/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VRX Performance | Reprogramación y Mecánica",
  description: "Taller especializado en Stage 1, 2, 3 y mecánica de alto rendimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <ShopProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
