'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLang, t } from '@/components/LanguageProvider';
import styles from '@/app/page.module.css';

interface HomeContentProps {
  hizmetler: any[];
  paketler: any[];
  ekip: any[];
  referanslar: any[];
  yorumlar: any[];
  genel: any;
  stats: any[];
}

export default function HomeContent({ hizmetler, paketler, ekip, referanslar, yorumlar, genel, stats }: HomeContentProps) {
  const { lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Interactive Canvas Animation (from original premium design)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawIcon = (ctx: CanvasRenderingContext2D, icon: string, x: number, y: number, size: number, opacity: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.font = `${size * 2}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, 0, 0);
      ctx.restore();
    };

    const particles = Array.from({ length: 30 }, (_, i) => {
      const randomService = hizmetler[i % hizmetler.length] || { icon: '✨' };
      const depth = Math.random();
      // Vary sizes more significantly: some small (background), some large (foreground)
      const baseSize = depth > 0.8 ? (Math.random() * 20 + 30) : (Math.random() * 8 + 6);
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: baseSize,
        depth: depth * 0.6 + 0.4,
        icon: randomService.icon,
        opacity: 0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250;
          p.x -= dx * force * 0.015;
          p.y -= dy * force * 0.015;
        }
        p.x += p.vx * p.depth;
        p.y += p.vy * p.depth;
        p.rotation += p.rotationSpeed;
        if (p.x < -100) p.x = canvas.width + 100;
        if (p.x > canvas.width + 100) p.x = -100;
        if (p.y < -100) p.y = canvas.height + 100;
        if (p.y > canvas.height + 100) p.y = -100;
        if (p.opacity < p.depth * 0.3) p.opacity += 0.005;
        drawIcon(ctx, p.icon, p.x, p.y, p.r, p.opacity, p.rotation);
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { 
      cancelAnimationFrame(animId); 
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.page}>
      
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>✦ {t('Performans Odaklı Dijital Ajans', 'Performance Driven Digital Agency', lang)}</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>XPOINT</span> 
            <span className={styles.heroTitleLine2}>DIGITAL</span>
          </h1>
          <p className={styles.heroDesc}>
            {t(
              'Markanızı dijital dünyada güçlendiriyor, yaratıcı içeriklerden veri odaklı reklamlara kadar uçtan uca çözümler sunuyoruz.', 
              'We empower your brand in the digital world, providing end-to-end solutions from creative content to data-driven ads.', 
              lang
            )}
          </p>
          <div className={styles.heroCtas}>
            <Link href="/paketler" className="btn-primary">{t('Paketleri İncele', 'View Packages', lang)}</Link>
            <Link href="/iletisim" className="btn-outline">{t('İletişime Geç', 'Get in Touch', lang)}</Link>
          </div>
        </div>
        
        <div className={styles.heroScroll}>
          {t('Aşağı Kaydır', 'Scroll Down', lang)}
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {(stats || []).map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{s.icon}</div>
                <div className={styles.statNum}>{s.value}</div>
                <div className={styles.statLabel}>{lang === 'tr' ? s.labelTR : s.labelEN}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className={`${styles.servicesSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-tag">✦ {t('Neler Yapıyoruz?', 'What We Do', lang)}</div>
            <h2 className="section-title">
              {t('Size Nasıl ', 'How Can We ', lang)} 
              <span className="gradient-text">{t('Yardımcı Olabiliriz?', 'Help You?', lang)}</span>
            </h2>
          </div>
          <div className={styles.servicesGrid}>
            {hizmetler.map((s, i) => (
              <Link key={i} href={`/hizmetler/${s.slug}`} className={`glass-card ${styles.serviceCard}`}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{lang === 'tr' ? s.titleTR : s.titleEN}</h3>
                <p className={styles.serviceDesc}>{lang === 'tr' ? s.descTR : s.descEN}</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA BAND */}
      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>{t('Büyümeye Hazır Mısınız?', 'Ready to Grow?', lang)}</h2>
              <p className={styles.ctaDesc}>
                {t('Hemen bizimle iletişime geçin ve markanız için özel bir strateji oluşturalım.', 'Contact us today and let\'s build a custom strategy for your brand.', lang)}
              </p>
            </div>
            <Link href="/iletisim" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {t('Ücretsiz Analiz Alın', 'Get a Free Analysis', lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. LOCATIONS / MAP SECTION */}
      <section className={`${styles.mapSection} section`}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <div className="section-tag">📍 {t('Lokasyon', 'Location', lang)}</div>
              <h2 className="section-title">{t('Bizi Ziyaret Edin', 'Visit Us', lang)}</h2>
              <p className="section-subtitle" style={{ marginBottom: '32px' }}>
                {t('Size bir kahve ikram edip projelerinizi konuşmaktan mutluluk duyarız.', 'We would love to offer you a coffee and discuss your projects.', lang)}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                   <span style={{ fontSize: '24px' }}>🗺️</span>
                   <div>
                     <h4 style={{ color: 'white', marginBottom: '4px' }}>{t('Adres', 'Address', lang)}</h4>
                     <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>{genel.adres}</p>
                   </div>
                 </div>
                 <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                   <span style={{ fontSize: '24px' }}>📧</span>
                   <div>
                     <h4 style={{ color: 'white', marginBottom: '4px' }}>{t('İletişim', 'Contact', lang)}</h4>
                     <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>{genel.telefon} <br/> {genel.eposta}</p>
                   </div>
                 </div>
                 <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                   <span style={{ fontSize: '24px' }}>🕒</span>
                   <div>
                     <h4 style={{ color: 'white', marginBottom: '4px' }}>{t('Çalışma Saatleri', 'Business Hours', lang)}</h4>
                     <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>{lang === 'tr' ? genel.calismaSaatleriTR : genel.calismaSaatleriEN}</p>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className={styles.mapWrapper}>
              <iframe 
                src={genel.mapUrl} 
                width="100%" 
                height="450" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
