import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import HakkimizdaContent from '@/components/HakkimizdaContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = getSiteData();
  const seo = data.seo?.sayfalar?.hakkimizda || {};
  return { title: seo.title, description: seo.desc };
}

export default function HakkimizdaPage() {
  const data = getSiteData();
  return (
    <HakkimizdaContent 
      ekip={data.ekip || []} 
      hakkimizda={data.hakkimizda} 
      stats={data.stats || []} 
    />
  );
}
