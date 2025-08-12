// app/layout.tsx

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // 1. Impor provider

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "BelajarYuk AI Roadmap",
  description: "Buat jalur belajar terstruktur dengan AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        {/* 2. Bungkus children dengan Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}