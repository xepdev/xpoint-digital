import { getSiteData } from '@/lib/db';
import { notFound } from 'next/navigation';
import styles from './ServiceDetail.module.css';

interface ServicePageProps {
  params: { slug: string };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const data = await getSiteData();
  const service = data.hizmetler.find(h => h.slug === params.slug);

  if (!service) notFound();

  return (
    <main className={styles.detailPage}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.iconBox}>{service.icon}</div>
          <h1 className={styles.title}>{service.titleTR}</h1>
          <p className={styles.subtitle}>{service.descTR}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.textWrapper}>
              {service.longDescTR.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          
          <div className={styles.ctaBox}>
            <h2>{service.titleTR} Projeniz İçin Teklif Alın</h2>
            <p>Markanızı dijitalde beraber büyütelim. Ücretsiz ön analiz için bize ulaşın.</p>
            <a href="/iletisim" className="btn-primary" style={{marginTop:'20px'}}>Teklif Al</a>
          </div>
        </div>
      </section>
    </main>
  );
}
