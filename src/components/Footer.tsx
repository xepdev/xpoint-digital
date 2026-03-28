'use client';
import Link from 'next/link';
import { useLang, t } from './LanguageProvider';
import styles from './Footer.module.css';

import { FooterColumn } from '@/lib/db';

interface FooterProps {
  data: {
    aboutTR: string;
    aboutEN: string;
    columns: FooterColumn[];
    copyrightTR: string;
    copyrightEN: string;
  };
  genel: any;
}

export default function Footer({ data, genel }: FooterProps) {
  const { lang } = useLang();

  // Custom SVG icon generator for socials
  const getSocialIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'instagram': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
      case 'facebook': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
      case 'youtube': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
      case 'linkedin': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
      default: return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      
      <div className="container">
        <div className={styles.top}>
          {/* Brand Col */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <img 
                src={genel.logoUrl || '/logo.png'} 
                alt="XPOINT DIGITAL" 
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.tagline}>
              {lang === 'tr' ? data?.aboutTR : data?.aboutEN}
            </p>
            <div className={styles.socials}>
              {Object.entries(genel?.sosyalMedya || {}).map(([key, href]: any) => {
                if (!href) return null;
                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={key}>
                    {getSocialIcon(key)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Nav Links */}
          {(data?.columns || []).map((col, i) => (
            <div key={i} className={styles.linksGroup}>
               <h4>{lang === 'tr' ? col.titleTR : col.titleEN}</h4>
               <ul>
                 {(col.links || []).map((link, li) => (
                   <li key={li}><Link href={link.href}>{lang === 'tr' ? link.labelTR : link.labelEN}</Link></li>
                 ))}
               </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div className={styles.linksGroup}>
             <h4>{t('Bize Ulaşın', 'Reach Us', lang)}</h4>
             <ul>
               <li><span style={{opacity:0.5}}>{t('Tel:', 'Phone:', lang)}</span> {genel?.telefon}</li>
               <li><span style={{opacity:0.5}}>{t('E-Posta:', 'Email:', lang)}</span> <a href={`mailto:${genel?.eposta}`} style={{color: '#6C63FF'}}>{genel?.eposta}</a></li>
               <li><span style={{opacity:0.5}}>{t('Adres:', 'Address:', lang)}</span><br/>{genel?.adres}</li>
             </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>{lang === 'tr' ? data?.copyrightTR : data?.copyrightEN}</div>
          <div>{t('İstanbul\'da tasarlandı ve geliştirildi.', 'Designed & developed in Istanbul.', lang)} ✨</div>
        </div>
      </div>
    </footer>
  );
}
