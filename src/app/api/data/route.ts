import { NextResponse } from 'next/server';
import { getSiteData, saveSiteData } from '@/lib/db';

const ADMIN_PASSWORD = 'admin'; 

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { data, password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Yetkisiz erişim!' }, { status: 403 });
    }

    const success = await saveSiteData(data);
    if (success) {
      return NextResponse.json({ success: true, message: 'Veriler başarıyla kaydedildi!' });
    } else {
      return NextResponse.json({ success: false, message: 'Veri yazma hatası!' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Geçersiz veri formatı!' }, { status: 400 });
  }
}
