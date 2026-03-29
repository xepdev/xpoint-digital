import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import HakkimizdaContent from '@/components/HakkimizdaContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const seo = data.seo?.sayfalar?.hakkimizda || {};
  return { title: seo.title, description: seo.desc };
}

export default async function HakkimizdaPage() {
  const data = await getSiteData();
  return (
    <HakkimizdaContent 
      ekip={data.ekip || []} 
      hakkimizda={data.hakkimizda} 
      stats={data.stats || []} 
    />
  );
}
