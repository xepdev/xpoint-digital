import { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/hakkimizda', '/paketler', '/referanslar', '/iletisim'];
  return routes.map((route) => ({
    url: `https://xpointdigital.com${route}`,
    lastModified: new Date(),
  }));
}
