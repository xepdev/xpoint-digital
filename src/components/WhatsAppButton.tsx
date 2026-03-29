'use client';
import { usePathname } from 'next/navigation';
import { useLang, t } from './LanguageProvider';

export default function WhatsAppButton({ phone }: { phone: string }) {
  const { lang } = useLang();
  const pathname = usePathname();
  const cleanPhone = phone.replace(/\D/g, '');

  if (pathname.startsWith('/admin')) return null;
  
  return (
    <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
       💬
    </a>
  );
}
