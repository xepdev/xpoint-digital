'use client';

import React from 'react';
import { useLang, t } from '@/lib/i18n';
import styles from './HakkimizdaContent.module.css';
import { TeamMember, AboutPageData, Stat } from '@/lib/db';

interface HakkimizdaContentProps {
  ekip: TeamMember[];
  hakkimizda: AboutPageData;
  stats: Stat[];
}

export default function HakkimizdaContent({ ekip, hakkimizda, stats }: HakkimizdaContentProps) {
  const { lang } = useLang();

  return (
    <div className={styles.page}>
      <div className={styles.heroBg} />
      
      <div className="container">
        {/* ABOUT HERO & STATS */}
        <div className={styles.aboutHero}>
          <div className={styles.heroLeft}>
            <div className="section-tag">✨ {t('Hakkımızda', 'About Us', lang)}</div>
            <h1 className="section-title">
              {lang === 'tr' ? hakkimizda.titleTR : hakkimizda.titleEN}
              <span className="gradient-text">{lang === 'tr' ? hakkimizda.subtitleTR : hakkimizda.subtitleEN}</span>
            </h1>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              {lang === 'tr' ? hakkimizda.descriptionTR : hakkimizda.descriptionEN}
            </p>
          </div>
          
          <div className={styles.heroRight}>
            <div className={styles.statsBox}>
              {(stats || []).map((s, i) => (
                <div key={i} className={styles.statItem}>
                  <div style={{fontSize: '1.5rem', marginBottom: '5px'}}>{s.icon}</div>
                  <span className={styles.statNum}>{s.value}</span>
                  <span className={styles.statLabel}>{lang === 'tr' ? s.labelTR : s.labelEN}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div className={styles.valuesSection}>
          <div className={styles.sectionHdr}>
             <h2 className="section-title">{lang === 'tr' ? hakkimizda.valuesTitleTR : hakkimizda.valuesTitleEN}</h2>
             <p className="section-subtitle">{lang === 'tr' ? hakkimizda.valuesSubtitleTR : hakkimizda.valuesSubtitleEN}</p>
          </div>
          <div className={styles.valuesGrid}>
            {(hakkimizda.values || []).map((v, i) => (
               <div key={i} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{lang === 'tr' ? v.titleTR : v.titleEN}</h3>
                <p className={styles.valueDesc}>{lang === 'tr' ? v.descTR : v.descEN}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM */}
        <div className={styles.teamSection}>
          <div className={styles.sectionHdr} style={{textAlign: 'center'}}>
            <h2 className="section-title">{t('Uzman Ekibimiz', 'Our Expert Team', lang)}</h2>
            <p className="section-subtitle" style={{margin: '0 auto'}}>{t('Başarılarınızın arkasındaki yetenekli profesyoneller.', 'The talented professionals behind your success.', lang)}</p>
          </div>
          
          <div className={styles.teamGrid}>
            {ekip.map((m, i) => (
              <div key={i} className={styles.teamCard} style={{ '--member-color': i % 2 === 0 ? '#6C63FF' : '#00D4FF' } as React.CSSProperties}>
                <div className={styles.memberPhoto}>
                  <div className={styles.memberEmoji}>{m.icon || '👨‍💼'}</div>
                </div>
                <h3 className={styles.memberName}>{m.name}</h3>
                <div className={styles.memberRole} style={{color: i % 2 === 0 ? '#6C63FF' : '#00D4FF'}}>{lang === 'tr' ? m.roleTR : m.roleEN}</div>
                <p className={styles.memberDesc}>{lang === 'tr' ? (m.bioTR || '') : (m.bioEN || '')}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
