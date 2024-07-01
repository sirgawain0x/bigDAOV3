"use client";
import { ThirdwebProvider } from "thirdweb/react";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import { LoginButton } from "./consts/LoginButton";

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
        </ThirdwebProvider>
      </body>
    </html>
  );
}
