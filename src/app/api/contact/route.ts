import { NextResponse } from 'next/server';
import { getSiteData, saveSiteData, ContactMessage } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, topic, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json({ success: false, message: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 });
    }

    const data = getSiteData();
    
    const newMessage: ContactMessage = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phone,
      topic,
      message,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    if (!data.mesajlar) data.mesajlar = [];
    data.mesajlar.unshift(newMessage); // En yeni mesaj en üstte

    saveSiteData(data);

    return NextResponse.json({ success: true, message: 'Mesajınız başarıyla iletildi.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
