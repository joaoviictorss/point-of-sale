import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { OrganizationModal } from "@/components/organization-modal";
import { Toaster } from "@/components/Shadcn/sonner";

import { OrganizationModalProvider } from "@/providers/organization-modal-provider";

import { TRPCReactProvider } from "@/trpc/client";

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
  title: "VNS - Admin",
  description: "VNS - Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <OrganizationModalProvider>
              <OrganizationModal canClose={false} />

              {children}
            </OrganizationModalProvider>
            <Toaster />
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
