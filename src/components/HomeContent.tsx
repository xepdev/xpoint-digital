'use client';

import React from 'react';
import { useLang, t } from '@/lib/i18n';
import styles from './HomeContent.module.css';
import { Stat, Service } from '@/lib/db';
import HeroCanvas from './HeroCanvas';
import Link from 'next/link';

interface HomeContentProps {
  stats: Stat[];
  services: Service[];
}

export default function HomeContent({ stats, services }: HomeContentProps) {
  const { lang } = useLang();

  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroCanvasContainer}>
          <HeroCanvas services={services} />
        </div>
        
        <div className="container">
          <div className={styles.heroContent}>
            <div className="section-tag">🚀 {t('Geleceği Şekillendirin', 'Shape the Future', lang)}</div>
            <h1 className={styles.heroTitle}>
              {t('Dijital Dünyada ', 'Your Signature in the ', lang)}
              <span className="gradient-text">{t('İmzanız Olsun', 'Digital World', lang)}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              {t(
                'Markanızı modern stratejiler, yaratıcı içerikler ve veriye dayalı büyüme ile zirveye taşıyoruz.',
                'We take your brand to the top with modern strategies, creative content, and data-driven growth.',
                lang
              )}
            </p>
            <div className={styles.heroBtns}>
              <Link href="/iletisim" className="btn-primary">{t('Hemen Başlayın', 'Get Started', lang)}</Link>
              <Link href="/hizmetler" className="btn-secondary">{t('Hizmetlerimiz', 'Our Services', lang)}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {(stats || []).map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{lang === 'tr' ? stat.labelTR : stat.labelEN}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className={styles.servicesPreview}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('Neler Yapıyoruz?', 'What We Do?', lang)}</h2>
            <p className="section-subtitle">{t('Markanızın ihtiyacı olan tüm dijital çözümler tek bir noktada.', 'All the digital solutions your brand needs in one place.', lang)}</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.slice(0, 3).map((service, i) => (
              <Link href={`/hizmetler/${service.slug}`} key={i} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3>{lang === 'tr' ? service.titleTR : service.titleEN}</h3>
                <p>{lang === 'tr' ? service.descTR : service.descEN}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
