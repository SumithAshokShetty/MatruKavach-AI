import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Serif_Text } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
import { AuthProvider } from "@/components/AuthContext";
import { LanguageProvider } from "@/components/LanguageContext";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MatruKavach AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${bricolage.variable} ${dmSerif.variable} ${GeistSans.variable} font-body antialiased`}
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                      console.log('ServiceWorker registration successful with scope: ', reg.scope);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              `
            }}
          />
        </body>
      </html>
    </AuthProvider>
  );
}

