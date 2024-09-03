"use client";
import { ThirdwebProvider } from "thirdweb/react";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/navigation/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
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
        </ThirdwebProvider>
      </body>
    </html>
  );
}
