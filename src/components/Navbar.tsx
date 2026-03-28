'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang, t } from './LanguageProvider';
import styles from './Navbar.module.css';
import { NavbarLink } from '@/lib/db';

interface NavbarProps {
  data?: NavbarLink[];
  logoUrl?: string;
}

export default function Navbar({ data, logoUrl }: NavbarProps) {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = data && data.length > 0 ? data.map(l => ({
    href: l.href,
    label: lang === 'tr' ? l.labelTR : l.labelEN
  })) : [
    { href: '/',           label: t('Ana Sayfa', 'Home', lang) },
    { href: '/paketler',   label: t('Paketler', 'Packages', lang) },
    { href: '/referanslar',label: t('Referanslar', 'References', lang) },
    { href: '/hakkimizda', label: t('Biz Kimiz', 'About Us', lang) },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* LOGO */}
        <Link href="/" className={`${styles.logo} logo-glow`} onClick={() => setMenuOpen(false)}>
          {logoUrl ? (
            <img src={logoUrl} alt="XPOINT DIGITAL" className={styles.logoImg} />
          ) : (
            <>
              <span className={styles.logoX}>X</span>POINT
              <span className={styles.logoDigital}>DIGITAL</span>
            </>
          )}
        </Link>

        {/* LINKS */}
        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href}>
                <Link 
                  href={l.href} 
                  className={`${styles.link} ${isActive ? styles.activeLink : ''}`} 
                  onClick={() => setMenuOpen(false)}
                  style={isActive ? { color: '#fff', background: 'rgba(255,255,255,0.05)'} : {}}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          {/* Mobile Only CTA */}
          <li className={styles.mobileCtaLi} style={{display: 'none'}}>
            <Link href="/iletisim" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} onClick={() => setMenuOpen(false)}>
              {t('Teklif Al', 'Get a Quote', lang)}
            </Link>
          </li>
        </ul>

        {/* RIGHT CONTROLS */}
        <div className={styles.rightGroup}>
          <button
            className={styles.langToggle}
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            aria-label="Toggle language"
          >
            {lang === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
          </button>
          
          <div className={styles.desktopCtaWrapper}>
            <Link href="/iletisim" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px', whiteSpace: 'nowrap' }}>
              {t('Teklif Al', 'Get a Quote', lang)}
            </Link>
          </div>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
