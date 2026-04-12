'use client';
import { useLang, t } from '@/components/LanguageProvider';
import styles from '@/app/referanslar/page.module.css';
import Image from 'next/image';
import { brandReferences } from '@/data/brand-references';

interface ReferanslarContentProps {
  referanslar: any[];
  yorumlar: any[];
}

export default function ReferanslarContent({ referanslar, yorumlar }: ReferanslarContentProps) {
  const { lang } = useLang();
  const marqueeBrands = [...brandReferences, ...brandReferences];

  return (
    <div className={styles.page}>
      <div className={styles.heroBg} />
      
      <div className="container">
        
        <div className={styles.header}>
          <div className="section-tag">🏆 {t('Başarılarımız', 'Our Success', lang)}</div>
          <h1 className="section-title">
            {t('Güvenle Büyüttüğümüz ', 'Brands We ', lang)}
            <span className="gradient-text">{t('Markalar', 'Grow', lang)}</span>
          </h1>
          <p className="section-subtitle">
            {t(
              'Dünya genelinde bir çok işletmenin dijital büyümesine katkı sağladık. Sizin markanız için de buradayız.',
              'We have contributed to the digital growth of many businesses worldwide. We are here for your brand too.',
              lang
            )}
          </p>
        </div>

        <div className={styles.logoMarquee}>
          <div className={styles.logoTrack}>
            {marqueeBrands.map((brand, i) => (
              <div key={`${brand.name}-${i}`} className={styles.logoCard}>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={240}
                  height={130}
                  className={styles.logoImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Marquee contains all brands with the improved styling applied */}
      </div>
    </div>
  );
}
