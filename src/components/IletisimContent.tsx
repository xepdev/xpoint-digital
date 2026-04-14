'use client';
import { useState } from 'react';
import { useLang, t } from '@/components/LanguageProvider';
import styles from '@/app/iletisim/page.module.css';

interface IletisimContentProps {
  genel: any;
  ekip: any[];
  konular: string[];
}

export default function IletisimContent({ genel, ekip, konular }: IletisimContentProps) {
  const { lang } = useLang();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.success) {
        setSent(true);
      } else {
        alert(result.message || 'Bir hata oluştu.');
      }
    } catch (err) {
      alert('Bağlantı hatası oluştu.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.heroBg} />
      <div className={styles.glow} />

      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">📞 {t('İletişim', 'Contact', lang)}</div>
          <h1 className="section-title">
            {t('Bizimle ', "Let's ", lang)}
            <span className="gradient-text">{t('İletişime Geçin', 'Talk', lang)}</span>
          </h1>
          <p className="section-subtitle">
            {t(
              'Projeniz hakkında konuşmak, fiyat teklifi almak veya herhangi bir sorunuz için aşağıdaki formu doldurun.',
              'Fill in the form below to talk about your project, get a quote, or for any questions.',
              lang
            )}
          </p>
        </div>

        <div className={styles.layout}>
          {/* FORM AREA */}
          <div className={styles.formWrapper}>
            {sent ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✅</div>
                <h3>{t('Mesajınız İletildi!', 'Message Sent!', lang)}</h3>
                <p>{t('En kısa sürede size geri döneceğiz.', "We'll get back to you as soon as possible.", lang)}</p>
                <button className="btn-primary" onClick={() => setSent(false)}>
                  {t('Yeni Mesaj Gönder', 'Send Another Message', lang)}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('Ad', 'First Name', lang)}</label>
                    <input className={styles.input} name="firstName" value={form.firstName} onChange={handleChange} required placeholder={t('Adınız', 'First Name', lang)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('Soyad', 'Last Name', lang)}</label>
                    <input className={styles.input} name="lastName" value={form.lastName} onChange={handleChange} required placeholder={t('Soyadınız', 'Last Name', lang)} />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('Telefon', 'Phone', lang)}</label>
                    <input className={styles.input} name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+90" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('E-posta', 'Email', lang)}</label>
                    <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="ornek@email.com" />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('Konu', 'Topic', lang)}</label>
                  <select className={styles.select} name="topic" value={form.topic} onChange={handleChange} required>
                    <option value="">{t('Bir konu seçin...', 'Select a topic...', lang)}</option>
                    {konular.map((topic, i) => <option key={i} value={topic}>{topic}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('Mesaj', 'Message', lang)}</label>
                  <textarea className={styles.textarea} name="message" value={form.message} onChange={handleChange} required placeholder={t('Projeniz hakkında bilgi verin...', 'Tell us about your project...', lang)} />
                </div>
                
                <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={sending}>
                  {sending ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    t('Mesaj Gönder', 'Send Message', lang)
                  )}
                </button>
              </form>
            )}
          </div>

          {/* INFO SIDEBAR */}
          <div className={styles.infoPanel}>
            
            {/* Team Mini */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>{t('Uzman Ekibimiz', 'Our Expert Team', lang)}</h3>
              <div className={styles.teamList}>
                {ekip.slice(0, 3).map((m, i) => (
                  <div key={i} className={styles.teamMini}>
                    <div className={styles.teamMiniPhoto}>
                      {m.image ? (
                        <img src={m.image} alt={m.name} className={styles.teamMiniImage} />
                      ) : (
                        <div className={styles.teamMiniEmoji}>{m.icon}</div>
                      )}
                    </div>
                    <div>
                      <div className={styles.teamMiniName}>{m.name}</div>
                      <div className={styles.teamMiniRole} style={{ color: 'rgba(255,255,255,0.5)' }}>{lang === 'tr' ? m.roleTR : m.roleEN}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>{t('İletişim Bilgileri', 'Contact Details', lang)}</h3>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconBox}>📞</div>
                  <div>
                    <div className={styles.contactItemLabel}>{t('Telefon', 'Phone', lang)}</div>
                    <div className={styles.contactItemVal}>{genel.telefon}</div>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconBox}>✉️</div>
                  <div>
                    <div className={styles.contactItemLabel}>{t('E-posta', 'Email', lang)}</div>
                    <div className={styles.contactItemVal}>{genel.eposta}</div>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconBox}>📍</div>
                  <div>
                    <div className={styles.contactItemLabel}>{t('Adres', 'Address', lang)}</div>
                    <div className={styles.contactItemVal}>{genel.adres}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className={styles.infoCard}>
               <h3 className={styles.infoTitle}>{t('Sosyal Medya', 'Social Media', lang)}</h3>
               <div className={styles.socialGrid}>
                 {Object.entries(genel.sosyalMedya).map(([key, href]: any) => {
                    if(!href) return null;
                    return (
                      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialPill}>
                        {key === 'instagram' && '📸'}
                        {key === 'facebook' && '📘'}
                        {key === 'youtube' && '▶️'}
                        {key === 'linkedin' && '💼'}
                        <span style={{textTransform:'capitalize'}}>{key}</span>
                      </a>
                    );
                 })}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
