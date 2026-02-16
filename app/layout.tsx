import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Polla26 - Predicciones Copa Mundial FIFA 2026",
  description: "Compite con tu familia y amigos prediciendo los resultados de la Copa Mundial FIFA 2026. Crea pronósticos, gana puntos y corona al campeón de la polla familiar.",
  keywords: ["Copa Mundial 2026", "FIFA", "Predicciones", "Polla", "Fútbol", "Mundial", "Pronósticos"],
  authors: [{ name: "Polla26" }],
  icons: {
    icon: "/2026_FIFA_World_Cup.webp",
    shortcut: "/2026_FIFA_World_Cup.webp",
    apple: "/2026_FIFA_World_Cup.webp",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://polla26.com",
    title: "Polla26 - Predicciones Copa Mundial FIFA 2026",
    description: "Compite con tu familia y amigos prediciendo los resultados de la Copa Mundial FIFA 2026. ¡Demuestra quién conoce más de fútbol!",
    siteName: "Polla26",
    images: [
      {
        url: "/PortadaWeb_mundial.webp",
        width: 1200,
        height: 630,
        alt: "Polla26 - Copa Mundial FIFA 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polla26 - Predicciones Copa Mundial FIFA 2026",
    description: "Compite con tu familia y amigos prediciendo los resultados de la Copa Mundial FIFA 2026. ¡Demuestra quién conoce más de fútbol!",
    images: ["/PortadaWeb_mundial.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
