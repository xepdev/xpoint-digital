'use client';
import { useLang, t } from './LanguageProvider';
export default function WhatsAppButton({ phone }: { phone: string }) {
  const { lang } = useLang();
  const cleanPhone = phone.replace(/\D/g, '');
  return (
    <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
       💬
    </a>
  );
}
