import { headers } from 'next/headers'

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
    ...params,
  })

  const response = await fetch(`${IPTV_BASE_URL}/player_api.php?action=${action}&${searchParams.toString()}`)
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getStreamUrl(streamId: number, streamType: 'live' | 'movie' | 'series') {
  const searchParams = new URLSearchParams({
    username: IPTV_USERNAME,
    password: IPTV_PASSWORD,
    stream_id: streamId.toString(),
    type: streamType,
  })

  return `${IPTV_BASE_URL}/${streamType}/${IPTV_USERNAME}/${IPTV_PASSWORD}/${streamId}.m3u8`
}
