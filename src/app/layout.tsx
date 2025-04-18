import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/auth/AuthProvider';
import ElMatadorGuide from '@/components/ElMatadorGuide';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "El Matador - Financial AI Assistant",
  description: "Your personalized AI-powered financial assistant",
  icons: {
    icon: '/matador.png',
    apple: '/matador.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/matador.png" />
        <link rel="apple-touch-icon" href="/matador.png" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-900 text-white min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
