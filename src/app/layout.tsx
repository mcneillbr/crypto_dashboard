import type { Metadata } from "next";
import { Amiko } from "next/font/google";
import "./globals.css";

const inter = Amiko({ weight: "400", style: "normal", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Demo Crypto Dashboard",
  keywords: "crypto, dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="{inter.className} w-full flex flex-col flex-wrap sm:flex-nowrap flex-grow">
        {children}
      </body>
    </html>
  );
}
