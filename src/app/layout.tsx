import React from "react";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/navigation/Footer";
import type { Viewport } from "next";
import { WagmiThirdwebProvider } from "@/components/providers/WagmiThirdwebProvider";
import { QueryClientProviderWrapper } from "@/QueryClientProvider";

export const metadata = {
  title: "BigDAO",
  description: "Where dreams grow big!",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["bigdao", "private", "fund"],
  authors: [
    { name: "G2" },
    {
      name: "Creative Organization DAO",
      url: "https://creativeplatform.xyz",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/BigDAO512.png" },
    { rel: "icon", url: "icons/BigDAO512.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProviderWrapper>
          <WagmiThirdwebProvider>
            <Navbar />
            <div
              style={{
                minHeight: "100vh",
                display: "grid",
                placeContent: "center",
              }}
            >
              {children}
            </div>
            <Toaster />
            <Footer />
          </WagmiThirdwebProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
