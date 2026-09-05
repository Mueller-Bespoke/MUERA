import type { Metadata } from "next";
import React from "react";
import SessionHandler from "@/components/SessionHandler";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/Footer";
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "de" | "en" | "fr" | "it")) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: {
      default: t("title"),
      template: "%s | MUERA",
    },
    description: t("description"),
    keywords: [
      "made-to-measure suits",
      "bespoke suits",
      "custom suits",
      "Mueller Bespoke",
      "MUERA",
      "luxury menswear",
      "Switzerland",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://muera.ch",
      siteName: "MUERA",
      locale: locale === "de" ? "de_CH" : locale === "fr" ? "fr_CH" : locale === "it" ? "it_CH" : "en_CH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "MUERA — Made-to-Measure Suits",
      description: "Perfect fit. Without complexity.",
    },
    robots: { index: true, follow: true },
    metadataBase: new URL("https://muera.ch"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "de" | "en" | "fr" | "it")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <React.Suspense fallback={null}>
              <SessionHandler />
            </React.Suspense>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
