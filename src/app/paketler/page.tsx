import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import PaketlerContent from '@/components/PaketlerContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = getSiteData();
  const seo = data.seo?.sayfalar?.paketler || {};
  return { title: seo.title, description: seo.desc };
}

export default function PaketlerPage() {
  const data = getSiteData();
  return <PaketlerContent paketler={data.paketler || []} />;
}
