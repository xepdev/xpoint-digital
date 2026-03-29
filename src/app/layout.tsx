import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getSiteData } from '@/lib/db';
import LanguageProvider from '@/components/LanguageProvider';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  return {
    title: { default: data.seo?.global?.siteTitle || 'XPOINT DIGITAL', template: `%s | ${data.seo?.global?.siteTitle}` },
    description: data.seo?.global?.siteDesc,
    keywords: data.seo?.global?.keywords,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await getSiteData();
  return (
    <html lang="tr">
      <body>
        <LanguageProvider>
          <Navbar data={data.layout.navbar} logoUrl={data.genel.logoUrl} />
          <main>{children}</main>
          <Footer data={data.layout.footer} genel={data.genel} />
          <WhatsAppButton phone={data.genel.telefon} />
        </LanguageProvider>
      </body>
    </html>
  );
}
