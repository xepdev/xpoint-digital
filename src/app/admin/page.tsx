'use client';
import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { SiteData, Service, Package, TeamMember, Reference, Testimonial } from '@/lib/db';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('genel');
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { const res = await fetch('/api/data'); const json = await res.json(); setData(json); setLoading(false); }
    catch (err) { console.error('Fetch error:', err); setLoading(false); }
  };

  const showStatus = (msg: string, type: 'success' | 'error' = 'success') => {
    setStatus({ message: msg, type });
    setTimeout(() => setStatus({ message: '', type: '' }), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') setIsAuthenticated(true);
    else alert('Hatalı şifre!');
  };

  const handleSave = async () => {
    if (!data) return;
    setStatus({ message: 'Kaydediliyor...', type: 'loading' });
    try {
      const res = await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data, password }) });
      const result = await res.json();
      if (result.success) showStatus('Başarıyla kaydedildi! ✅');
      else showStatus('Hata! ❌', 'error');
    } catch (err) { showStatus('Hata! ❌', 'error'); }
  };

  const updateField = (path: string, value: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    const parts = path.split('.');
    let current: any = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setData(newData);
  };

  const updateListItem = (listKey: keyof SiteData, index: number, field: string, value: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    newData[listKey][index][field] = value;
    setData(newData);
  };

  const addItem = (listKey: keyof SiteData, template: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    if (!Array.isArray(newData[listKey])) newData[listKey] = [];
    (newData[listKey] as any[]).push(template);
    setData(newData);
  };

  const removeItem = (listKey: keyof SiteData, index: number) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    newData[listKey].splice(index, 1);
    setData(newData);
  };

  const updateSubArray = (listKey: keyof SiteData, index: number, field: string, subIndex: number, value: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    newData[listKey][index][field][subIndex] = value;
    setData(newData);
  };

  if (loading) return <div className={styles.adminPage}><div className={styles.adminContainer}>Bekleyin...</div></div>;

  if (!isAuthenticated) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>XPOINT <span>DIGITAL</span></div>
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <input type="password" placeholder="Dashboard Şifresi" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.formGroup} style={{padding:'15px 20px', borderRadius:'12px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff'}} />
            <button type="submit" className={styles.saveBtn}>Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        <header className={styles.adminHeader}>
          <div className={styles.adminTitle}>XPOINT <span style={{color: '#6C63FF'}}>CMS</span></div>
          <div className={styles.adminActions}>
            <span className={status.type === 'error' ? styles.errorMsg : styles.successMsg}>{status.message}</span>
            <button onClick={handleSave} className={styles.saveBtn}>Kaydet</button>
          </div>
        </header>

        <nav className={styles.adminTabs}>
          {['genel', 'gorunum', 'stats', 'hakkimizda', 'seo', 'hizmetler', 'paketler', 'ekip', 'referanslar', 'mesajlar'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`${styles.tabBtn} ${activeTab === t ? styles.tabBtnActive : ''}`}>
              {t === 'gorunum' ? 'GÖRÜNÜM' : t === 'stats' ? 'İSTATİSTİKLER' : t === 'hakkimizda' ? 'HAKKIMIZDA' : t.toUpperCase()}
              {t === 'mesajlar' && (data?.mesajlar?.filter(m => !m.isRead).length || 0) > 0 && (
                <span className={styles.unreadBadge}>{data?.mesajlar?.filter(m => !m.isRead).length}</span>
              )}
            </button>
          ))}
        </nav>

        <main className={styles.adminCard}>
          {activeTab === 'genel' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>İletişim & Lokasyon</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Telefon</label><input value={data?.genel.telefon} onChange={(e) => updateField('genel.telefon', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>E-posta</label><input value={data?.genel.eposta} onChange={(e) => updateField('genel.eposta', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Adres</label><input value={data?.genel.adres} onChange={(e) => updateField('genel.adres', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Harita Embed (iframe src)</label><input value={data?.genel.mapUrl} onChange={(e) => updateField('genel.mapUrl', e.target.value)} /></div>
                </div>
              </div>
              <div className={styles.sectionGroup}>
                <h3>Sosyal Medya</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Instagram</label><input value={data?.genel?.sosyalMedya?.instagram || ''} onChange={(e) => updateField('genel.sosyalMedya.instagram', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Facebook</label><input value={data?.genel?.sosyalMedya?.facebook || ''} onChange={(e) => updateField('genel.sosyalMedya.facebook', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Linkedin</label><input value={data?.genel?.sosyalMedya?.linkedin || ''} onChange={(e) => updateField('genel.sosyalMedya.linkedin', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gorunum' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>Navbar Linkleri</h3>
                <div className={styles.itemGrid}>
                  {(data?.layout?.navbar || []).map((link, i) => (
                    <div key={i} className={styles.itemCard}>
                      <button className={styles.removeItemBtn} onClick={() => {
                        if (!data) return;
                        const nl = [...data.layout.navbar]; nl.splice(i, 1); updateField('layout.navbar', nl);
                      }}>✕</button>
                      <div className={styles.formGroup}>
                        <label>Label TR</label>
                        <input value={link.labelTR} onChange={(e) => {
                          if (!data) return;
                          const nl = [...data.layout.navbar]; nl[i].labelTR = e.target.value; updateField('layout.navbar', nl);
                        }} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>URL (href)</label>
                        <input value={link.href} onChange={(e) => {
                          if (!data) return;
                          const nl = [...data.layout.navbar]; nl[i].href = e.target.value; updateField('layout.navbar', nl);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className={styles.addItemBtn} onClick={() => {
                  const nl = [...(data?.layout?.navbar || [])]; nl.push({ href: '/', labelTR: 'Yeni Link', labelEN: 'New Link' }); updateField('layout.navbar', nl);
                }}>+ Link Ekle</button>
              </div>

              <div className={styles.sectionGroup}>
                <h3>Footer Bilgileri</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Hakkımızda Metni TR</label><textarea value={data?.layout?.footer?.aboutTR} onChange={(e) => updateField('layout.footer.aboutTR', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Copyright TR</label><input value={data?.layout?.footer?.copyrightTR} onChange={(e) => updateField('layout.footer.copyrightTR', e.target.value)} /></div>
                </div>
                
                <h4 style={{marginTop:'20px', color:'#fff'}}>Footer Sütunları</h4>
                <div className={styles.itemGrid} style={{marginTop:'15px'}}>
                   {(data?.layout?.footer?.columns || []).map((col, ci) => (
                     <div key={ci} className={styles.itemCard} style={{border:'1px dashed rgba(255,255,255,0.2)'}}>
                        <button className={styles.removeItemBtn} onClick={() => {
                          if (!data) return;
                          const nc = [...data.layout.footer.columns]; nc.splice(ci, 1); updateField('layout.footer.columns', nc);
                        }}>✕</button>
                        <div className={styles.formGroup}><label>Sütun Başlığı TR</label><input value={col.titleTR} onChange={(e) => {
                          if (!data) return;
                          const nc = [...data.layout.footer.columns]; nc[ci].titleTR = e.target.value; updateField('layout.footer.columns', nc);
                        }} /></div>
                        
                        <div style={{marginTop:'15px'}}>
                          <label style={{fontSize:'12px', opacity:0.5}}>Linkler</label>
                          {(col.links || []).map((link, li) => (
                            <div key={li} style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'5px', marginTop:'5px'}}>
                               <input placeholder="Label" value={link.labelTR} onChange={(e) => {
                                 if (!data) return;
                                 const nc = [...data.layout.footer.columns]; nc[ci].links[li].labelTR = e.target.value; updateField('layout.footer.columns', nc);
                               }} />
                               <input placeholder="URL" value={link.href} onChange={(e) => {
                                 if (!data) return;
                                 const nc = [...data.layout.footer.columns]; nc[ci].links[li].href = e.target.value; updateField('layout.footer.columns', nc);
                               }} />
                               <button onClick={() => {
                                 if (!data) return;
                                 const nc = [...data.layout.footer.columns]; nc[ci].links.splice(li, 1); updateField('layout.footer.columns', nc);
                               }} style={{background:'red', border:'none', borderRadius:'4px', color:'#fff', cursor:'pointer'}}>✕</button>
                            </div>
                          ))}
                          <button className={styles.addItemBtn} style={{padding:'5px', marginTop:'10px'}} onClick={() => {
                            if (!data) return;
                            const nc = [...data.layout.footer.columns]; nc[ci].links.push({ labelTR: 'Yeni Link', labelEN: 'New', href: '/' }); updateField('layout.footer.columns', nc);
                          }}>+ Link Ekle</button>
                        </div>
                     </div>
                   ))}
                </div>
                <button className={styles.addItemBtn} onClick={() => {
                  if (!data) return;
                  const nc = [...(data.layout.footer.columns || [])]; 
                  nc.push({ titleTR: 'Yeni Sütun', titleEN: 'New Column', links: [] }); 
                  updateField('layout.footer.columns', nc);
                }}>+ Sütun Ekle</button>
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
                 <h3>Sayfa Başı SEO Ayarları</h3>
                 <div className={styles.itemGrid}>
                   {Object.keys(data?.seo?.sayfalar || {}).map(p => (
                     <div key={p} className={styles.itemCard}>
                        <h4 style={{color:'#6C63FF', marginBottom:'10px'}}>{p.toUpperCase()}</h4>
                        <div className={styles.formGroup}><label>Title</label><input value={data?.seo?.sayfalar?.[p]?.title || ''} onChange={(e) => updateField(`seo.sayfalar.${p}.title`, e.target.value)} /></div>
                        <div className={styles.formGroup}><label>Description</label><textarea value={data?.seo?.sayfalar?.[p]?.desc || ''} onChange={(e) => updateField(`seo.sayfalar.${p}.desc`, e.target.value)} /></div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'hizmetler' && (
            <div className={styles.adminFormSection}>
              <div className={styles.itemGrid}>
                {(data?.hizmetler || []).map((h, i) => (
                  <div key={i} className={styles.itemCard}>
                    <button className={styles.removeItemBtn} onClick={() => removeItem('hizmetler', i)}>✕</button>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'20px'}}>
                      <div className={styles.formGroup}><label>İkon (Emoji)</label><input value={h.icon} onChange={(e) => updateListItem('hizmetler', i, 'icon', e.target.value)} /></div>
                      <div className={styles.formGroup}><label>Slug (URL)</label><input value={h.slug} onChange={(e) => updateListItem('hizmetler', i, 'slug', e.target.value)} /></div>
                    </div>
                    <div className={styles.formGroup}><label>Başlık TR</label><input value={h.titleTR} onChange={(e) => updateListItem('hizmetler', i, 'titleTR', e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Kısa Açıklama TR</label><textarea value={h.descTR} onChange={(e) => updateListItem('hizmetler', i, 'descTR', e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Detaylı İçerik TR (Sayfa İçin)</label><textarea style={{height:'120px'}} value={h.longDescTR} onChange={(e) => updateListItem('hizmetler', i, 'longDescTR', e.target.value)} /></div>
                  </div>
                ))}
              </div>
              <button className={styles.addItemBtn} onClick={() => addItem('hizmetler', { icon: '✨', slug:'yeni-hizmet', titleTR: 'Yeni Hizmet', titleEN: 'New Service', descTR: '...', descEN: '...', longDescTR: '', longDescEN: '' })}>+ Yeni Hizmet Ekle</button>
            </div>
          )}

          {activeTab === 'paketler' && (
            <div className={styles.adminFormSection}>
              <div className={styles.itemGrid}>
                {(data?.paketler || []).map((p, i) => (
                  <div key={i} className={styles.itemCard}>
                    <button className={styles.removeItemBtn} onClick={() => removeItem('paketler', i)}>✕</button>
                    <div className={styles.formGroup}><label>Paket Adı TR</label><input value={p.nameTR} onChange={(e) => updateListItem('paketler', i, 'nameTR', e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Fiyat TR</label><input value={p.priceTR} onChange={(e) => updateListItem('paketler', i, 'priceTR', e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Vurgu Rengi</label><input type="color" value={p.color} onChange={(e) => updateListItem('paketler', i, 'color', e.target.value)} /></div>
                    
                    <h5 style={{marginTop:'15px', fontSize:'11px', opacity:0.5}}>ÖZELLİKLER (TR)</h5>
                    <div className={styles.featureTagGrid}>
                      {(p.featuresTR || []).map((f:any, fi:number) => (
                        <div key={fi} className={styles.featureTag}>
                          <input value={f} onChange={(e) => updateSubArray('paketler', i, 'featuresTR', fi, e.target.value)} />
                          <button onClick={() => {
                            const nl = [...(p.featuresTR || [])]; nl.splice(fi,1); updateListItem('paketler', i, 'featuresTR', nl);
                          }}>✕</button>
                        </div>
                      ))}
                      <button className={styles.addItemBtn} style={{width:'auto', padding:'4px 10px'}} onClick={() => {
                        if (!data) return;
                        const nl = [...(p.featuresTR || [])]; nl.push('Yeni özellik'); updateListItem('paketler', i, 'featuresTR', nl);
                      }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.addItemBtn} onClick={() => addItem('paketler', { nameTR: 'YENİ', nameEN: 'NEW', priceTR: '0', priceEN:'0', color: '#6C63FF', featuresTR: [], featuresEN: [], popular: false })}>+ Yeni Paket</button>
            </div>
          )}

          {activeTab === 'ekip' && (
            <div className={styles.adminFormSection}>
              <div className={styles.itemGrid}>
                {(data?.ekip || []).map((e, i) => (
                  <div key={i} className={styles.itemCard}>
                    <button className={styles.removeItemBtn} onClick={() => removeItem('ekip', i)}>✕</button>
                    <div className={styles.formGroup}><label>İsim Soyisim</label><input value={e.name} onChange={(e) => updateListItem('ekip', i, 'name', e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Rol TR</label><input value={e.roleTR} onChange={(e) => updateListItem('ekip', i, 'roleTR', e.target.value)} /></div>
                  </div>
                ))}
              </div>
              <button className={styles.addItemBtn} onClick={() => addItem('ekip', { name: 'İsim', roleTR: 'Rol', roleEN: 'Role', bioTR: '', bioEN: '', icon: '👨‍💼' })}>+ Ekip Ekle</button>
            </div>
          )}
          {activeTab === 'referanslar' && (
            <div className={styles.adminFormSection}>
              <div className={styles.itemGrid}>
                {(data?.referanslar || []).map((r, i) => (
                  <div key={i} className={styles.itemCard}>
                    <button className={styles.removeItemBtn} onClick={() => removeItem('referanslar', i)}>✕</button>
                    <div className={styles.formGroup}><label>Marka</label><input value={r.name} onChange={(e) => updateListItem('referanslar', i, 'name', e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Sonuç TR</label><input value={r.resultTR} onChange={(e) => updateListItem('referanslar', i, 'resultTR', e.target.value)} /></div>
                  </div>
                ))}
              </div>
              <button className={styles.addItemBtn} onClick={() => addItem('referanslar', { name: 'Marka', industryTR: '', industryEN: '', resultTR: '', resultEN: '', icon: '🚀' })}>+ Referans Ekle</button>
            </div>
          )}

          {activeTab === 'mesajlar' && (
            <div className={styles.adminFormSection}>
              <div className={styles.sectionGroup}>
                <h3>Gelen Mesajlar</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {(!data?.mesajlar || data.mesajlar.length === 0) ? (
                    <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Henüz mesaj yok.</div>
                  ) : (
                    data.mesajlar.map((msg, i) => (
                      <div key={msg.id} className={styles.itemCard} style={{ borderLeft: msg.isRead ? '1px solid rgba(255,255,255,0.1)' : '4px solid #6C63FF' }}>
                        <button className={styles.removeItemBtn} onClick={() => removeItem('mesajlar', i)}>✕</button>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '16px' }}>{msg.firstName} {msg.lastName}</div>
                            <div style={{ fontSize: '13px', color: '#00D4FF', fontWeight: 600 }}>{msg.phone}</div>
                            <div style={{ fontSize: '12px', opacity: 0.6 }}>{msg.email}</div>
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.4 }}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString('tr-TR') : ''}
                          </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                          <div style={{ fontWeight: 700, color: '#00D4FF', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase' }}>{msg.topic}</div>
                          <div style={{ color: 'rgba(255,255,255,0.8)' }}>{msg.message}</div>
                        </div>
                        {!msg.isRead && (
                          <button 
                            onClick={() => updateListItem('mesajlar', i, 'isRead', true)}
                            style={{ marginTop: '15px', background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.2)', color: '#6C63FF', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Okundu Olarak İşaretle
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
