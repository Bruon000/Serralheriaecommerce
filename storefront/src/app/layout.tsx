import type { Metadata } from "next";
import ChatVendedor from "@/components/ChatVendedor";
import AIChatVendedor from "@/components/AIChatVendedor";
import { Space_Grotesk, Inter } from "next/font/google";

import "./globals.css";
import DevTools from "../components/dev/DevTools.client";

import SiteHeader from "../components/SiteHeader";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import FloatingOfertaConstrutor from "../components/FloatingOfertaConstrutor";
import FloatingCartButton from "../components/FloatingCartButton";
import ConstructorNudge from "../components/ConstructorNudge";
import BuilderRegistryInit from "../components/BuilderRegistryInit";
import ThemeAutoStyle from "../components/ThemeAutoStyle";
import ThemeBanner from "../components/ThemeBanner";
import { getSiteSettings } from "../lib/builder";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portões, Grades e Estruturas Metálicas sob medida",
  description:
    "Produtos em metal sob medida. Orçamento rápido pelo WhatsApp.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const showFloatingCart = siteSettings?.showFloatingCartButton !== false;
  const showConstructorNudge = siteSettings?.showConstructorNudge !== false;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <div className="forgeBg_v1">
          <div className="forgeVignette_v1" />
          <canvas id="spark-canvas" />

          <ThemeAutoStyle />
          <BuilderRegistryInit />

          <SiteHeader />
          <div className="tune-root">{children}</div>

          {showConstructorNudge && <ConstructorNudge />}
          <ChatVendedor />
          <AIChatVendedor />
          <FloatingWhatsApp />
          <FloatingOfertaConstrutor />
          {showFloatingCart && <FloatingCartButton />}

          <DevTools />
          <ThemeBanner />
        </div>
      </body>
    </html>
  );
}






