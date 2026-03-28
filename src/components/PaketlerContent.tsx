'use client';
import Link from 'next/link';
import { useLang, t } from '@/components/LanguageProvider';
import styles from '@/app/paketler/page.module.css';

interface PaketlerContentProps {
  paketler: any[];
}

export default function PaketlerContent({ paketler }: PaketlerContentProps) {
  const { lang } = useLang();

  return (
    <div className={styles.page}>
      <div className={styles.heroBg} />
      
      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">💎 {t('Paketler', 'Packages', lang)}</div>
          <h1 className="section-title">
            {t('İhtiyacınıza Uygun ', 'Flexible ', lang)}
            <span className="gradient-text">{t('Çözümler', 'Pricing', lang)}</span>
          </h1>
          <p className="section-subtitle">
            {t(
              'Markanızın büyüklüğüne ve hedeflerine göre özelleştirilmiş sosyal medya ve dijital reklam paketlerimizi inceleyin.',
              'Explore our social media and digital advertising packages customized for your brand size and goals.',
              lang
            )}
          </p>
        </div>

        <div className={styles.grid}>
          {paketler.map((pkg, i) => (
            <div 
              key={i} 
              className={`${styles.card} ${pkg.popular ? styles.popular : ''}`}
              style={{ '--card-color': pkg.color } as React.CSSProperties}
            >
              {pkg.popular && <div className={styles.popularBadge}>{t('EN POPÜLER', 'MOST POPULAR', lang)}</div>}
              
              <div className={styles.cardTop}>
                <h3 className={styles.cardName}>{lang === 'tr' ? pkg.nameTR : pkg.nameEN}</h3>
                <div className={styles.price}>
                  <span className={styles.priceAmt}>{lang === 'tr' ? pkg.priceTR : pkg.priceEN}</span>
                  <span className={styles.pricePeriod}>/ {t('ay', 'month', lang)}</span>
                </div>
              </div>

              <div className={styles.divider}></div>

              <ul className={styles.featureList}>
                {(lang === 'tr' ? pkg.featuresTR : pkg.featuresEN).map((feature: string, j: number) => (
                  <li key={j} className={styles.featureItem}>
                    <div className={styles.checkIcon}>✓</div>
                    <span>{feature}</span>
                  </li>
                ))}

                {(lang === 'tr' ? (pkg.notIncludedTR || []) : (pkg.notIncludedEN || [])).map((feature: string, j: number) => (
                  <li key={j} className={`${styles.featureItem} ${styles.notIncluded}`}>
                    <div className={styles.xIcon}>✕</div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/iletisim" className={styles.cardBtn}>
                {t('Hemen Başlayın', 'Get Started', lang)}
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.customBanner}>
          <div className={styles.customIcon}>🚀</div>
          <div>
            <h3>{t('Özel Bir Çözüm mü Arıyorsunuz?', 'Looking for a Custom Solution?', lang)}</h3>
            <p>{t('İşletmenizin ihtiyaçlarına göre tamamen özelleştirilmiş bir strateji için bizimle iletişime geçin.', 'Contact us for a fully customized strategy based on your business needs.', lang)}</p>
          </div>
          <Link href="/iletisim" className="btn-primary">{t('Teklif Al', 'Get a Quote', lang)}</Link>
        </div>
      </div>
    </div>
  );
}
