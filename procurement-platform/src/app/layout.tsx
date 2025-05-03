'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnimationProvider from "./components/AnimationProvider";
import CustomCursor from "./components/CustomCursor";
import PremiumLoader from "./components/PremiumLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AADF Smart Procurement Platform",
  description: "A digital platform for streamlining AADF's procurement process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  // Disable the loader in development mode for faster refresh
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsLoading(false);
    }
  }, []);

  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isLoading && <PremiumLoader onLoadComplete={() => setIsLoading(false)} />}

        <AnimationProvider>
          {children}
          <CustomCursor />
        </AnimationProvider>
      </body>
    </html>
  );
}
