import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "OXO - Tic Tac Toe", description: "Clean tic tac toe" };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${inter.variable} h-full`}><body className="min-h-[100dvh] min-h-screen bg-[#f2f2f2] antialiased overflow-x-hidden">{children}</body></html>;
}
