// app/layout.tsx
import type { Metadata } from "next";
// Impor font baru dari Google Fonts
import { Space_Grotesk, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AuthButtons from "@/components/AuthButtons";

// Konfigurasi font Space Grotesk untuk teks utama (sans-serif)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Konfigurasi font Crimson Pro untuk judul (serif)
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ['400', '700'], // Impor ketebalan yang dibutuhkan
  variable: "--font-crimson-pro",
});

export const metadata: Metadata = {
  title: "BelajarYuk - AI Learning Roadmap",
  description: "Buat jalur belajar terstruktur dengan AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Terapkan variabel font ke tag body */}
      <body className={`${spaceGrotesk.variable} ${crimsonPro.variable} font-sans antialiased`}>
        <Providers>
          <AuthButtons />
          {children}
        </Providers>
      </body>
    </html>
  );
}
