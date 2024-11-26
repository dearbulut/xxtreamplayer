import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const IPTV_BASE_URL = '***REMOVED***'
export const IPTV_USERNAME = '***REMOVED***'
export const IPTV_PASSWORD = '***REMOVED***'

export async function fetchFromApi(action: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams({
    username: IPTV_USERNAME,
    password: IPTV_PASSWORD,
    action,
    ...params
  })
  console.log(IPTV_BASE_URL);
  const response = await fetch(`${IPTV_BASE_URL}/player_api.php?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

export async function getStreamUrl(type: 'live' | 'movie' | 'series', id: number) {
  const url = `${IPTV_BASE_URL}/${type}/${IPTV_USERNAME}/${IPTV_PASSWORD}/${id}.m3u8`;
  if (type === 'live') {
    return url;
  }
  const proxyUrl = `http://${process.env.SITE_URL}/api/stream?url=${url}`;
  
  const response = await fetch(proxyUrl);
  const data = await response.json();
  return data.url;
}

export async function getStreamUrlServer(movieId: string): Promise<string> {
  const response = await fetchFromApi(`/movie/${movieId}/play`);
  return response.url;
}

export async function getEPGData() {
  const epgUrl = `${IPTV_BASE_URL}/xmltv.php?username=${IPTV_USERNAME}&password=${IPTV_PASSWORD}`;
  const proxyUrl = `http://${process.env.SITE_URL}/api/epg`;
  const response = await fetch(proxyUrl);
  const data = await response.json();
  return data;
}