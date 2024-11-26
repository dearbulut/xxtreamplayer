import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

if (!process.env.NEXT_PUBLIC_IPTV_BASE_URL || !process.env.NEXT_PUBLIC_IPTV_USERNAME || !process.env.NEXT_PUBLIC_IPTV_PASSWORD) {
  throw new Error('Missing IPTV configuration in environment variables')
}

const IPTV_BASE_URL = process.env.NEXT_PUBLIC_IPTV_BASE_URL
const IPTV_USERNAME = process.env.NEXT_PUBLIC_IPTV_USERNAME
const IPTV_PASSWORD = process.env.NEXT_PUBLIC_IPTV_PASSWORD

export async function fetchFromApi(action: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams({
    username: IPTV_USERNAME,
    password: IPTV_PASSWORD,
    action,
    ...params
  });
  const response = await fetch(`${IPTV_BASE_URL}/player_api.php?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

export async function getStreamUrl(type: 'live' | 'movie' | 'series', id: number) {
  const url = `${process.env.NEXT_PUBLIC_IPTV_BASE_URL}/${type}/${process.env.NEXT_PUBLIC_IPTV_USERNAME}/${process.env.NEXT_PUBLIC_IPTV_PASSWORD}/${id}.m3u8`;
  if (type === 'live') {
    return url;
  }
  const proxyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/stream?url=${url}`;
  
  const response = await fetch(proxyUrl);
  const data = await response.json();
  return data.url;
}

export async function getStreamUrlServer(movieId: string): Promise<string> {
  const response = await fetchFromApi(`/movie/${movieId}/play`);
  return response.url;
}

export async function getEPGData() {
  const epgUrl = `${process.env.NEXT_PUBLIC_IPTV_BASE_URL}/xmltv.php?username=${process.env.NEXT_PUBLIC_IPTV_USERNAME}&password=${process.env.NEXT_PUBLIC_IPTV_PASSWORD}`;
  const proxyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/epg`;
  const response = await fetch(proxyUrl);
  const data = await response.json();
  return data;
}