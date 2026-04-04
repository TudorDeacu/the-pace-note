import type { Metadata } from "next";
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
  title: "The Pace Note",
  description: "Motorsportul românesc și cultura auto din România.",
};

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { TranslationProvider } from "@/context/TranslationContext";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-red-600 selection:text-white`}
      >
        <TranslationProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Analytics />
              <Toaster 
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: '#18181b', // zinc-900
                    color: '#fff',
                    border: '1px solid #27272a', // zinc-800
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e', // green-500
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#dc2626', // red-600
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
