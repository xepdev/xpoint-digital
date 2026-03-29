import { Metadata } from 'next';
import { getSiteData } from '@/lib/db';
import IletisimContent from '@/components/IletisimContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const seo = data.seo?.sayfalar?.iletisim || {};
  return { title: seo.title, description: seo.desc };
}

export default async function IletisimPage() {
  const data = await getSiteData();
  return <IletisimContent genel={data.genel} ekip={data.ekip || []} konular={data.iletisimKonulariTR || []} />;
}
