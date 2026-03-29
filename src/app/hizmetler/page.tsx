import { getSiteData } from '@/lib/db';
import Link from 'next/link';
import styles from './ServicesPage.module.css';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const data = await getSiteData();
  const { hizmetler } = data;

  return (
    <main className={styles.servicesPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Hizmetlerimiz</h1>
            <p>
              Dijital dünyadaki varlığınızı güçlendirmek için sunduğumuz profesyonel çözümleri keşfedin.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            {(hizmetler || []).map((s, i) => (
              <Link key={i} href={`/hizmetler/${s.slug}`} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.titleTR}</h3>
                <p className={styles.serviceDesc}>{s.descTR}</p>
                <div className={styles.serviceArrow}>Detayları Gör →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className={styles.ctaBand} style={{marginTop: '100px', textAlign: 'center'}}>
        <div className={styles.container}>
           <div style={{background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(0, 212, 255, 0.1))', padding: '60px', borderRadius: '40px', border: '1px solid rgba(108, 99, 255, 0.2)'}}>
             <h2 style={{fontSize: '32px', marginBottom: '15px'}}>Projenizi Birlikte Hayata Geçirelim</h2>
             <p style={{opacity: 0.7, marginBottom: '25px'}}>Ücretsiz ön analiz ve teklif için bizimle iletişime geçin.</p>
             <Link href="/iletisim" className="btn-primary">Teklif Alın</Link>
           </div>
        </div>
      </section>
    </main>
  );
}
