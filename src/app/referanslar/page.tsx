import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import ReferanslarContent from '@/components/ReferanslarContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = getSiteData();
  const seo = data.seo?.sayfalar?.referanslar || {};
  return { title: seo.title, description: seo.desc };
}

export default function ReferanslarPage() {
  const data = getSiteData();
  return <ReferanslarContent referanslar={data.referanslar || []} yorumlar={data.yorumlar || []} />;
}
