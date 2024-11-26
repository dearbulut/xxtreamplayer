import {  NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    
    const { searchParams } = new URL(req.url);
    const m3u8Url = searchParams.get('url') as string; // Pass the m3u8 URL as a query parameter
    const response = await axios.get(m3u8Url, { responseType: 'stream', maxRedirects: 5 });
    return NextResponse.json({ url: response.data?.responseUrl });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch the m3u8 file', { status: 500 });
  }
}
