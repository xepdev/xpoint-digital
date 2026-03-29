const FIREBASE_URL = 'https://xpoint-d7584-default-rtdb.firebaseio.com/site-data.json';

export interface Service {
  icon: string;
  slug: string;
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
  longDescTR: string;
  longDescEN: string;
}

export interface Package {
  nameTR: string;
  nameEN: string;
  priceTR: string;
  priceEN: string;
  popular: boolean;
  color: string;
  featuresTR: string[];
  featuresEN: string[];
  notIncludedTR?: string[];
  notIncludedEN?: string[];
}

export interface TeamMember {
  name: string;
  roleTR: string;
  roleEN: string;
  bioTR: string;
  bioEN: string;
  icon: string;
}

export interface Reference {
  name: string;
  industryTR: string;
  industryEN: string;
  resultTR: string;
  resultEN: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  roleTR: string;
  roleEN: string;
  textTR: string;
  textEN: string;
}

export interface Stat {
  icon: string;
  value: string;
  labelTR: string;
  labelEN: string;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface NavbarLink {
  href: string;
  labelTR: string;
  labelEN: string;
}

export interface FooterColumn {
  titleTR: string;
  titleEN: string;
  links: { href: string; labelTR: string; labelEN: string; }[];
}

export interface AboutPageData {
  titleTR: string;
  titleEN: string;
  subtitleTR: string;
  subtitleEN: string;
  descriptionTR: string;
  descriptionEN: string;
  valuesTitleTR: string;
  valuesTitleEN: string;
  valuesSubtitleTR: string;
  valuesSubtitleEN: string;
  values: {
    icon: string;
    titleTR: string;
    titleEN: string;
    descTR: string;
    descEN: string;
  }[];
}

export interface SiteData {
  genel: {
    telefon: string;
    eposta: string;
    adres: string;
    calismaSaatleriTR: string;
    calismaSaatleriEN: string;
    favIcon: string;
    logoUrl: string;
    mapUrl: string;
    analyticsId: string;
    sosyalMedya: {
      instagram: string;
      facebook: string;
      youtube: string;
      linkedin: string;
    };
  };
  seo: {
    global: {
      siteTitle: string;
      siteDesc: string;
      keywords: string;
      ogImage: string;
    };
    sayfalar: {
      [key: string]: {
        title: string;
        desc: string;
      };
    };
  };
  hizmetler: Service[];
  paketler: Package[];
  ekip: TeamMember[];
  referanslar: Reference[];
  yorumlar: Testimonial[];
  mesajlar: ContactMessage[];
  iletisimKonulariTR: string[];
  iletisimKonulariEN: string[];
  stats: Stat[];
  layout: {
    navbar: NavbarLink[];
    footer: {
      aboutTR: string;
      aboutEN: string;
      columns: FooterColumn[];
      copyrightTR: string;
      copyrightEN: string;
    };
  };
  hakkimizda: AboutPageData;
}

const DEFAULT_DATA: SiteData = {
  genel: {
    telefon: '', eposta: '', adres: '',
    calismaSaatleriTR: '', calismaSaatleriEN: '',
    favIcon: '', logoUrl: '', mapUrl: '', analyticsId: '',
    sosyalMedya: { instagram: '', facebook: '', youtube: '', linkedin: '' },
  },
  seo: {
    global: { siteTitle: 'XPOINT DIGITAL', siteDesc: '', keywords: '', ogImage: '' },
    sayfalar: {},
  },
  hizmetler: [],
  paketler: [],
  ekip: [],
  referanslar: [],
  yorumlar: [],
  mesajlar: [],
  iletisimKonulariTR: [],
  iletisimKonulariEN: [],
  stats: [],
  layout: {
    navbar: [],
    footer: {
      aboutTR: '', aboutEN: '',
      columns: [],
      copyrightTR: '', copyrightEN: '',
    }
  },
  hakkimizda: {
    titleTR: '', titleEN: '',
    subtitleTR: '', subtitleEN: '',
    descriptionTR: '', descriptionEN: '',
    valuesTitleTR: '', valuesTitleEN: '',
    valuesSubtitleTR: '', valuesSubtitleEN: '',
    values: []
  }
};
export async function getSiteData(): Promise<SiteData> {
  try {
    const res = await fetch(FIREBASE_URL, { cache: 'no-store' }); // Always fetch latest
    if (!res.ok) throw new Error('Failed to fetch from Firebase');
    const saved = await res.json();
    
    // Deep merge: saved data overrides defaults, missing keys fall back to defaults
    return {
      ...DEFAULT_DATA,
      ...saved,
      genel: { ...DEFAULT_DATA.genel, ...saved?.genel, sosyalMedya: { ...DEFAULT_DATA.genel.sosyalMedya, ...(saved?.genel?.sosyalMedya || {}) } },
      seo: { ...DEFAULT_DATA.seo, ...saved?.seo, global: { ...DEFAULT_DATA.seo.global, ...(saved?.seo?.global || {}) }, sayfalar: { ...DEFAULT_DATA.seo.sayfalar, ...(saved?.seo?.sayfalar || {}) } },
      hizmetler: Array.isArray(saved?.hizmetler) ? saved.hizmetler : [],
      paketler: Array.isArray(saved?.paketler) ? saved.paketler : [],
      ekip: Array.isArray(saved?.ekip) ? saved.ekip : [],
      referanslar: Array.isArray(saved?.referanslar) ? saved.referanslar : [],
      yorumlar: Array.isArray(saved?.yorumlar) ? saved.yorumlar : [],
      mesajlar: Array.isArray(saved?.mesajlar) ? saved.mesajlar : [],
      iletisimKonulariTR: Array.isArray(saved?.iletisimKonulariTR) ? saved.iletisimKonulariTR : [],
      iletisimKonulariEN: Array.isArray(saved?.iletisimKonulariEN) ? saved.iletisimKonulariEN : [],
      layout: saved?.layout || DEFAULT_DATA.layout,
      hakkimizda: saved?.hakkimizda || DEFAULT_DATA.hakkimizda,
    };
  } catch (error) {
    console.error('Error reading site data from Firebase:', error);
    return DEFAULT_DATA;
  }
}

export async function saveSiteData(data: SiteData): Promise<boolean> {
  try {
    const res = await fetch(FIREBASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Error saving site data to Firebase:', error);
    return false;
  }
}
