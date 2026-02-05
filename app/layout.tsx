import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from './context/LanguageContext'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eventosvirtualespro.com'),
  title: "Eventos Virtuales Pro | La Experiencia Inmersiva 3D Definitiva",
  description: "Descubre la nueva era de eventos digitales con Eventos Virtuales Pro. Plataforma inmersiva 3D con auditorios 360°, networking en tiempo real y ferias virtuales interactivas. ¡Transforma tu visión en realidad!",
  keywords: ["eventos virtuales", "plataforma 3D", "convenciones digitales", "networking interactivo", "auditorio 360", "iWebolutions"],
  authors: [{ name: "iWebolutions", url: "https://eventosvirtualespro.com" }],
  creator: "iWebolutions",
  publisher: "iWebolutions",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://eventosvirtualespro.com",
  },
  openGraph: {
    title: "Eventos Virtuales Pro | La Experiencia Inmersiva 3D Definitiva",
    description: "Descubre la nueva era de eventos digitales con Eventos Virtuales Pro. Plataforma inmersiva 3D con auditorios 360°, networking en tiempo real y ferias virtuales interactivas.",
    url: "https://eventosvirtualespro.com",
    siteName: "Eventos Virtuales Pro",
    images: [
      {
        url: "/login-bg.png",
        width: 1200,
        height: 630,
        alt: "Eventos Virtuales Pro Preview",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventos Virtuales Pro | La Experiencia Inmersiva 3D Definitiva",
    description: "Plataforma inmersiva 3D de próxima generación para eventos globales.",
    images: ["/login-bg.png"],
    creator: "@iwebolutions",
  },
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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
