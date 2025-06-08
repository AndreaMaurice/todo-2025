import type { Metadata } from "next";
import ReduxProvider from './store/ReduxProvider';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  keywords: ["Todo", "Next.js", "Redux", "TypeScript"],
  authors: [{ name: "Andrea Maurice", url: "https://andreamaurice.vercel.app" }],
  description: "A simple Todo app built with Next.js, Redux, and TypeScript",
  creator: "Andrea Maurice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
