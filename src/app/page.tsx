import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import HomeContent from '@/components/HomeContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const seo = data.seo?.sayfalar?.anaSayfa || {};
  return {
    title: seo.title || data.seo?.global?.siteTitle,
    description: seo.desc || data.seo?.global?.siteDesc,
  };
}

export default async function HomePage() {
  const data = await getSiteData();
  return (
    <HomeContent 
      hizmetler={data.hizmetler || []} 
      paketler={data.paketler || []}
      ekip={data.ekip || []}
      referanslar={data.referanslar || []}
      yorumlar={data.yorumlar || []}
      genel={data.genel || {}}
      stats={data.stats || []}
    />
  );
}
