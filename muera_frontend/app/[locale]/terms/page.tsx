import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegalContent } from "@/lib/legal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = getLegalContent("terms", locale);
  return { title: content.title, description: content.description };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LegalPage doc="terms" locale={locale} />;
}
