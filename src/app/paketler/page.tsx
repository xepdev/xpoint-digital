import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import PaketlerContent from '@/components/PaketlerContent';
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const seo = data.seo?.sayfalar?.paketler || {};
  return { title: seo.title, description: seo.desc };
}

export default async function PaketlerPage() {
  const data = await getSiteData();
  return <PaketlerContent paketler={data.paketler || []} />;
}
