import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookieToInitialState } from 'wagmi'
import { headers } from 'next/headers'

import { config } from '@/config'
import AppKitProvider from '@/context'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JaLearnApp",
  description: "Simple app to learn a few japanese words",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider initialState={initialState}>{children}</AppKitProvider>
      </body>
    </html>
  );
}
