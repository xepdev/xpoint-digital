import { MetadataRoute } from 'next';
export default async function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: '/admin' }, sitemap: 'https://xpointdigital.com/sitemap.xml' }
}
