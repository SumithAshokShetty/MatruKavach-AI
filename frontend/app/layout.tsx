import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Serif_Text } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSerif = DM_Serif_Text({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MatruKavach AI",
  description: "Advanced Maternal Health Monitoring System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${bricolage.variable} ${dmSerif.variable} ${GeistSans.variable} font-body antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
