import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { GaTags } from "@/components/ga-tags";

import { QueryClientProvider } from "../lib/query-client-provider";

import { GlobalStateProvider } from "./(main)/o/[slug]/context";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Base Chat",
  description: "Base Chat powered by Ragie",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <GlobalStateProvider>
      <html lang="en" className="h-full w-full">
        <GaTags gaKey={process.env.GOOGLE_ANALYTICS_KEY} />
        <body className={`${inter.className} antialiased h-full w-full bg-white`}>
          <QueryClientProvider>{children}</QueryClientProvider>
          <Toaster position="bottom-center" />
        </body>
      </html>
    </GlobalStateProvider>
  );
}
