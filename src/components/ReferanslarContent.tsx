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

        <div className={styles.logoGrid}>
          {brandReferences.map((brand) => (
            <div key={brand.name} className={styles.logoCard}>
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

        {/* Testimonials */}
        <div className={styles.testimonialSection}>
          <div className={styles.testimonialHeader} style={{textAlign: 'center'}}>
            <div className="section-tag">💬 {t('Müşteri Yorumları', 'Client Reviews', lang)}</div>
            <h2 className="section-title">
              {t('Onlar Ne Dedi?', 'What Did They Say?', lang)}
            </h2>
          </div>
          
          <div className={styles.testimonialGrid}>
            {yorumlar.map((test, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                </div>
                <p className={styles.testimonialText}>"{lang === 'tr' ? test.textTR : test.textEN}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>{(test.name || 'M')[0]}</div>
                  <div>
                    <div className={styles.authorName}>{test.name}</div>
                    <div className={styles.authorRole}>{lang === 'tr' ? test.roleTR : test.roleEN}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
