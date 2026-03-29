'use client';

import { useState, useEffect } from 'react';
import { getSiteData, SiteData, Stat } from '@/lib/db';
import styles from './admin.module.css';

export default function AdminPage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [activeTab, setActiveTab] = useState('genel');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const updateField = (path: string, value: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  const updateListItem = (listKey: keyof SiteData, index: number, field: string, value: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[listKey];
    if (Array.isArray(list) && list[index]) {
      (list[index] as any)[field] = value;
      setData(newData);
    }
  };

  const addItem = (listKey: keyof SiteData, newItem: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[listKey];
    if (Array.isArray(list)) {
      (list as any[]).push(newItem);
      setData(newData);
    }
  };

  const removeItem = (listKey: keyof SiteData, index: number) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const list = newData[listKey];
    if (Array.isArray(list)) {
      (list as any[]).splice(index, 1);
      setData(newData);
    }
  };

  if (!data) return <div className={styles.loading}>Yükleniyor...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <header className={styles.adminHeader}>
          <h1>XPOINT DIGITAL Panel</h1>
          <button className={styles.saveBtn} onClick={save} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Kaydediliyor...' : saveStatus === 'success' ? 'Başarıyla Kaydedildi ✅' : 'Değişiklikleri Kaydet'}
          </button>
        </header>

        <nav className={styles.adminTabs}>
          {['genel', 'gorunum', 'stats', 'hakkimizda', 'seo', 'hizmetler', 'paketler', 'ekip', 'referanslar', 'mesajlar'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`${styles.tabBtn} ${activeTab === t ? styles.tabBtnActive : ''}`}>
              {t === 'gorunum' ? 'GÖRÜNÜM' : t === 'stats' ? 'İSTATİSTİKLER' : t === 'hakkimizda' ? 'HAKKIMIZDA' : t.toUpperCase()}
              {t === 'mesajlar' && (data?.mesajlar?.filter(m => !m.isRead).length || 0) > 0 && (
                <span className={styles.unreadBadge}>{(data?.mesajlar?.filter(m => !m.isRead).length ?? 0)}</span>
              )}
            </button>
          ))}
        </nav>

        <main className={styles.adminContent}>
          {activeTab === 'genel' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>İletişim Bilgileri (Global)</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Telefon</label><input value={data.genel.telefon} onChange={(e) => updateField('genel.telefon', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>E-posta</label><input value={data.genel.eposta} onChange={(e) => updateField('genel.eposta', e.target.value)} /></div>
                </div>
                <div className={styles.formGroup}><label>Adres</label><input value={data.genel.adres} onChange={(e) => updateField('genel.adres', e.target.value)} /></div>
                <div className={styles.formGroup}><label>Google Maps Iframe URL (Sadece src kısmı)</label><textarea value={data.genel.mapUrl} onChange={(e) => updateField('genel.mapUrl', e.target.value)} /></div>
              </div>
              <p style={{color:'#666', fontSize:'0.8rem'}}>* Değişiklikler tüm sayfaları etkiler.</p>
            </div>
          )}

          {activeTab === 'gorunum' && (
            <div className={styles.adminFormSection}>
               <div className={styles.sectionGroup}>
                <h3>Logo & Favicon</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Site Logo URL</label><input value={data.genel.logoUrl} onChange={(e) => updateField('genel.logoUrl', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Favicon URL</label><input value={data.genel.favIcon} onChange={(e) => updateField('genel.favIcon', e.target.value)} /></div>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <h3>Footer Yönetimi (Sütunlar ve Linkler)</h3>
                <div className={styles.itemGrid}>
                  {(data?.layout?.footer?.columns || []).map((col, ci) => (
                    <div key={ci} className={styles.itemCard} style={{border: '1px solid #333', padding: '15px'}}>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Sütun Başlığı TR</label><input value={col.titleTR} onChange={(e) => {
                          const nc = [...data.layout.footer.columns]; nc[ci].titleTR = e.target.value; updateField('layout.footer.columns', nc);
                        }} /></div>
                        <div className={styles.formGroup}><label>Sütun Başlığı EN</label><input value={col.titleEN} onChange={(e) => {
                          const nc = [...data.layout.footer.columns]; nc[ci].titleEN = e.target.value; updateField('layout.footer.columns', nc);
                        }} /></div>
                      </div>
                      
                      <div style={{marginTop: '15px'}}>
                        <label style={{fontSize: '0.8rem', color: '#888'}}>Linkler</label>
                        {(col.links || []).map((link, li) => (
                          <div key={li} style={{display: 'flex', gap: '5px', marginBottom: '5px'}}>
                            <input placeholder="Etiket TR" value={link.labelTR} onChange={(e) => {
                              const nc = [...data.layout.footer.columns]; nc[ci].links[li].labelTR = e.target.value; updateField('layout.footer.columns', nc);
                            }} />
                            <input placeholder="URL" value={link.href} onChange={(e) => {
                              const nc = [...data.layout.footer.columns]; nc[ci].links[li].href = e.target.value; updateField('layout.footer.columns', nc);
                            }} />
                            <button onClick={() => {
                              const nc = [...data.layout.footer.columns]; nc[ci].links.splice(li, 1); updateField('layout.footer.columns', nc);
                            }} style={{background:'none', border:'none', color:'#ff4444', cursor:'pointer'}}>✕</button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const nc = [...data.layout.footer.columns]; 
                          if (!nc[ci].links) nc[ci].links = [];
                          nc[ci].links.push({ href: '#', labelTR: 'Yeni Link', labelEN: 'New' }); 
                          updateField('layout.footer.columns', nc);
                        }} className={styles.addItemBtn} style={{fontSize:'0.7rem', padding:'2px 8px'}}>+ Link Ekle</button>
                      </div>

                      <button onClick={() => {
                        const nc = [...data.layout.footer.columns]; nc.splice(ci, 1); updateField('layout.footer.columns', nc);
                      }} className={styles.removeItemBtn} style={{top:'5px', right:'5px'}}>✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  const nc = [...(data?.layout?.footer?.columns || [])];
                  nc.push({ titleTR: 'Başlık', titleEN: 'Title', links: [] });
                  updateField('layout.footer.columns', nc);
                }} className={styles.addItemBtn}>+ Sütun Ekle</button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>Ana Sayfa İstatistikleri</h3>
                <div className={styles.itemGrid}>
                  {(data?.stats || []).map((s, i) => (
                    <div key={i} className={styles.itemCard}>
                      <button className={styles.removeItemBtn} onClick={() => removeItem('stats', i)}>✕</button>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>İkon (Emoji)</label><input value={s.icon} onChange={(e) => updateListItem('stats', i, 'icon', e.target.value)} /></div>
                        <div className={styles.formGroup}><label>Değer (Örn: 150+)</label><input value={s.value} onChange={(e) => updateListItem('stats', i, 'value', e.target.value)} /></div>
                      </div>
                      <div className={styles.formGroup} style={{marginTop:'10px'}}><label>Etiket TR</label><input value={s.labelTR} onChange={(e) => updateListItem('stats', i, 'labelTR', e.target.value)} /></div>
                      <div className={styles.formGroup} style={{marginTop:'10px'}}><label>Etiket EN</label><input value={s.labelEN} onChange={(e) => updateListItem('stats', i, 'labelEN', e.target.value)} /></div>
                    </div>
                  ))}
                </div>
                <button className={styles.addItemBtn} onClick={() => addItem('stats', { icon: '✨', value: '10+', labelTR: 'Yeni Stat', labelEN: 'New Stat' })}>+ İstatistik Ekle</button>
              </div>
            </div>
          )}

          {activeTab === 'hakkimizda' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>Hakkımızda Sayfası Başlıkları</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Ana Başlık TR</label><input value={data?.hakkimizda?.titleTR} onChange={(e) => updateField('hakkimizda.titleTR', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Ana Başlık EN</label><input value={data?.hakkimizda?.titleEN} onChange={(e) => updateField('hakkimizda.titleEN', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Vurgulu Başlık TR</label><input value={data?.hakkimizda?.subtitleTR} onChange={(e) => updateField('hakkimizda.subtitleTR', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Vurgulu Başlık EN</label><input value={data?.hakkimizda?.subtitleEN} onChange={(e) => updateField('hakkimizda.subtitleEN', e.target.value)} /></div>
                </div>
                <div className={styles.formGroup} style={{marginTop:'15px'}}><label>Açıklama Metni TR</label><textarea value={data?.hakkimizda?.descriptionTR} onChange={(e) => updateField('hakkimizda.descriptionTR', e.target.value)} /></div>
                <div className={styles.formGroup} style={{marginTop:'15px'}}><label>Açıklama Metni EN</label><textarea value={data?.hakkimizda?.descriptionEN} onChange={(e) => updateField('hakkimizda.descriptionEN', e.target.value)} /></div>
              </div>

              <div className={styles.sectionGroup}>
                <h3>Değerlerimiz & Vizyonumuz Seksiyonu</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Seksiyon Başlığı TR</label><input value={data?.hakkimizda?.valuesTitleTR} onChange={(e) => updateField('hakkimizda.valuesTitleTR', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Seksiyon Başlığı EN</label><input value={data?.hakkimizda?.valuesTitleEN} onChange={(e) => updateField('hakkimizda.valuesTitleEN', e.target.value)} /></div>
                </div>
                <div className={styles.formGroup} style={{marginTop:'15px'}}><label>Seksiyon Alt Metni TR</label><input value={data?.hakkimizda?.valuesSubtitleTR} onChange={(e) => updateField('hakkimizda.valuesSubtitleTR', e.target.value)} /></div>
                <div className={styles.formGroup} style={{marginTop:'15px'}}><label>Seksiyon Alt Metni EN</label><input value={data?.hakkimizda?.valuesSubtitleEN} onChange={(e) => updateField('hakkimizda.valuesSubtitleEN', e.target.value)} /></div>
                
                <h4 style={{marginTop:'25px', color:'#fff'}}>Değer Kartları</h4>
                <div className={styles.itemGrid} style={{marginTop:'15px'}}>
                   {(data?.hakkimizda?.values || []).map((v, i) => (
                     <div key={i} className={styles.itemCard}>
                        <button className={styles.removeItemBtn} onClick={() => {
                          const nv = [...data.hakkimizda.values]; nv.splice(i, 1); updateField('hakkimizda.values', nv);
                        }}>✕</button>
                        <div className={styles.formGroup}><label>İkon (Emoji)</label><input value={v.icon} onChange={(e) => {
                          const nv = [...data.hakkimizda.values]; nv[i].icon = e.target.value; updateField('hakkimizda.values', nv);
                        }} /></div>
                        <div className={styles.formGroup} style={{marginTop:'10px'}}><label>Başlık TR</label><input value={v.titleTR} onChange={(e) => {
                          const nv = [...data.hakkimizda.values]; nv[i].titleTR = e.target.value; updateField('hakkimizda.values', nv);
                        }} /></div>
                        <div className={styles.formGroup} style={{marginTop:'10px'}}><label>Başlık EN</label><input value={v.titleEN} onChange={(e) => {
                          const nv = [...data.hakkimizda.values]; nv[i].titleEN = e.target.value; updateField('hakkimizda.values', nv);
                        }} /></div>
                        <div className={styles.formGroup} style={{marginTop:'10px'}}><label>Açıklama TR</label><textarea value={v.descTR} onChange={(e) => {
                          const nv = [...data.hakkimizda.values]; nv[i].descTR = e.target.value; updateField('hakkimizda.values', nv);
                        }} /></div>
                        <div className={styles.formGroup} style={{marginTop:'10px'}}><label>Açıklama EN</label><textarea value={v.descEN} onChange={(e) => {
                          const nv = [...data.hakkimizda.values]; nv[i].descEN = e.target.value; updateField('hakkimizda.values', nv);
                        }} /></div>
                     </div>
                   ))}
                </div>
                <button className={styles.addItemBtn} onClick={() => {
                   const nv = [...(data?.hakkimizda?.values || [])];
                   nv.push({ icon:'✨', titleTR:'Yeni Değer', titleEN:'New', descTR:'', descEN:'' });
                   updateField('hakkimizda.values', nv);
                }}>+ Kart Ekle</button>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>Global SEO Ayarları</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Site Başlığı</label><input value={data.seo.global.siteTitle} onChange={(e) => updateField('seo.global.siteTitle', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Site Açıklaması</label><textarea value={data.seo.global.siteDesc} onChange={(e) => updateField('seo.global.siteDesc', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mesajlar' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>Gelen Mesajlar</h3>
                <div className={styles.messageList}>
                  {(data?.mesajlar || []).length === 0 ? <p>Henüz mesaj yok.</p> : (data?.mesajlar || []).map((m: any, i: number) => (
                    <div key={m.id} className={`${styles.messageCard} ${!m.isRead ? styles.unread : ''}`}>
                      <div className={styles.msgHeader}>
                        <strong>{m.firstName} {m.lastName}</strong>
                        <span>{new Date(m.createdAt).toLocaleString()}</span>
                      </div>
                      <p><strong>Konu:</strong> {m.topic}</p>
                      <p><strong>E-posta:</strong> {m.email}</p>
                      <p><strong>Mesaj:</strong> {m.message}</p>
                      <div className={styles.msgActions}>
                        {!m.isRead && (
                          <button onClick={() => {
                             const nm = [...data.mesajlar]; nm[i].isRead = true; updateField('mesajlar', nm);
                          }}>Okundu Olarak İşaretle</button>
                        )}
                        <button className={styles.deleteBtn} onClick={() => removeItem('mesajlar', i)}>Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
