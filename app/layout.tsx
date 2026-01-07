import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from './context/LanguageContext'
import FloatingLanguage from './components/FloatingLanguage'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtual Event Pro",
  description: "Next Gen Virtual Events Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white`}>
        <LanguageProvider>
          <FloatingLanguage />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
