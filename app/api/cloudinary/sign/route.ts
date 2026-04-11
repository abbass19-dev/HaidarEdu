import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const secret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (!secret || !apiKey) {
      return NextResponse.json({ error: 'Missing Cloudinary credentials in .env' }, { status: 500 });
    }

    const str = `timestamp=${timestamp}${secret}`;
    const signature = crypto.createHash('sha1').update(str).digest('hex');

    return NextResponse.json({ signature, timestamp, apiKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
