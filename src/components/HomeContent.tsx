'use client';

import React from 'react';
import { useLang, t } from '@/components/LanguageProvider';
import styles from '@/app/page.module.css';
import { Stat, Service, Package, TeamMember, Reference, Testimonial } from '@/lib/db';
import HeroCanvas from './HeroCanvas';
import Link from 'next/link';

interface HomeContentProps {
  hizmetler: Service[];
  paketler: Package[];
  ekip: TeamMember[];
  referanslar: Reference[];
  yorumlar: Testimonial[];
  genel: any;
  stats: Stat[];
}

export default function HomeContent({ 
  hizmetler, 
  paketler, 
  ekip, 
  referanslar, 
  yorumlar, 
  genel, 
  stats 
}: HomeContentProps) {
  const { lang } = useLang();

  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroCanvasContainer}>
          <HeroCanvas hizmetler={hizmetler} />
        </div>
        
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>{t('Geleceği Şekillendirin', 'Shape the Future', lang)}</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine1}>{t('Dijital', 'Digital', lang)}</span>
              <span className={styles.heroTitleLine2}>{t('İmzanız Olsun', 'Be Your Signature', lang)}</span>
            </h1>
            <p className={styles.heroDesc}>
              {t(
                'Markanızı modern stratejiler, yaratıcı içerikler ve veriye dayalı büyüme ile zirveye taşıyoruz.',
                'We take your brand to the top with modern strategies, creative content, and data-driven growth.',
                lang
              )}
            </p>
            <div className={styles.heroCtas}>
              <Link href="/iletisim" className="btn-primary">{t('Hemen Başlayın', 'Get Started', lang)}</Link>
              <Link href="/hizmetler" className="btn-secondary">{t('Hizmetlerimiz', 'Our Services', lang)}</Link>
            </div>
          </div>
        </div>

        <div className={styles.heroScroll}>
          <span>SCROLL</span>
          <div className={styles.scrollLine}></div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {(stats || []).map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statNum}>{stat.value}</div>
                <div className={styles.statLabel}>{lang === 'tr' ? stat.labelTR : stat.labelEN}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className={styles.servicesSection + " section-padding"}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-tag">{t('Hizmetlerimiz', 'Our Services', lang)}</div>
            <h2 className="section-title">{t('Neler Yapıyoruz?', 'What We Do?', lang)}</h2>
          </div>
          <div className={styles.servicesGrid}>
            {hizmetler.slice(0, 4).map((service, i) => (
              <Link href={`/hizmetler/${service.slug}`} key={i} className={styles.serviceCard}>
                <span className={styles.serviceIcon}>{service.icon}</span>
                <h3 className={styles.serviceTitle}>{lang === 'tr' ? service.titleTR : service.titleEN}</h3>
                <p className={styles.serviceDesc}>{lang === 'tr' ? service.descTR : service.descEN}</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className={styles.pricingSection + " section-padding"}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-tag">{t('Paketler', 'Packages', lang)}</div>
            <h2 className="section-title">{t('Size Uygun Çözümler', 'Solutions for You', lang)}</h2>
          </div>
          <div className={styles.pricingGrid}>
            {(paketler || []).slice(0, 3).map((pkg, i) => (
              <div key={i} className={`${styles.priceCard} ${pkg.popular ? styles.popular : ''}`}>
                {pkg.popular && <div className={styles.popularBadge}>{t('En Popüler', 'Most Popular', lang)}</div>}
                <h3>{lang === 'tr' ? pkg.nameTR : pkg.nameEN}</h3>
                <div className={styles.priceAmount}>
                  {lang === 'tr' ? pkg.priceTR : pkg.priceEN}
                </div>
                <ul className={styles.priceFeatures}>
                  {(lang === 'tr' ? pkg.featuresTR : pkg.featuresEN).map((f, fi) => (
                    <li key={fi}>✓ {f}</li>
                  ))}
                </ul>
                <Link href="/iletisim" className={pkg.popular ? "btn-primary" : "btn-secondary"}>
                  {t('Teklif Al', 'Get a Quote', lang)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className={styles.teamSection + " section-padding"}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-tag">{t('Ekibimiz', 'Our Team', lang)}</div>
            <h2 className="section-title">{t('Uzman Kadro', 'Expert Staff', lang)}</h2>
          </div>
          <div className={styles.teamGrid}>
            {(ekip || []).slice(0, 4).map((member, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamIcon}>{member.icon}</div>
                <h3>{member.name}</h3>
                <span>{lang === 'tr' ? member.roleTR : member.roleEN}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={styles.testimonialsSection + " section-padding"}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-tag">{t('Yorumlar', 'Testimonials', lang)}</div>
            <h2 className="section-title">{t('Müşterilerimiz Ne Diyor?', 'What Customers Say?', lang)}</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {(yorumlar || []).slice(0, 3).map((item, i) => (
              <div key={i} className={styles.testimonialCard}>
                <p>"{lang === 'tr' ? item.textTR : item.textEN}"</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{item.name}</strong>
                  <span>{lang === 'tr' ? item.roleTR : item.roleEN}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>{t('Projenizi Başlatın', 'Start Your Project', lang)}</h2>
              <p className={styles.ctaDesc}>{t('Hemen bizimle iletişime geçin ve dijital dönüşümü başlatın.', 'Contact us now and start the digital transformation.', lang)}</p>
            </div>
            <Link href="/iletisim" className="btn-primary">{t('İletişime Geç', 'Contact Us', lang)}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
