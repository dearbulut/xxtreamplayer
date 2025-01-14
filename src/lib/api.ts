"use client";

import { getActiveProfile } from "./client-profile";

function getIPTVCredentials() {
  const activeProfile = getActiveProfile();
  if (activeProfile) {
    return {
      baseUrl: activeProfile.iptvUrl,
      username: activeProfile.iptvUsername,
      password: activeProfile.iptvPassword
    };
  }

  // Fallback to environment variables
  return {
    baseUrl: process.env.NEXT_PUBLIC_IPTV_BASE_URL,
    username: process.env.NEXT_PUBLIC_IPTV_USERNAME,
    password: process.env.NEXT_PUBLIC_IPTV_PASSWORD
  };
}

export async function fetchFromApi(action: string, params: Record<string, string> = {}) {
  const { baseUrl, username, password } = getIPTVCredentials();

  if (!baseUrl || !username || !password) {
    throw new Error('Missing IPTV credentials');
  }

  const searchParams = new URLSearchParams({
    username,
    password,
    ...params,
  });

  const response = await fetch(`${baseUrl}/player_api.php?action=${action}&${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getStreamUrl(streamId: number, streamType: 'live' | 'movie' | 'series') {
  const { baseUrl, username, password } = getIPTVCredentials();

  if (!baseUrl || !username || !password) {
    throw new Error('Missing IPTV credentials');
  }

  return `${baseUrl}/${streamType}/${username}/${password}/${streamId}.m3u8`;
}

export async function getSeriesInfo(seriesId: number) {
  return fetchFromApi('get_series_info', { series_id: seriesId.toString() });
}

export async function verifyIPTVCredentials(url: string, username: string, password: string) {
  try {
    const searchParams = new URLSearchParams({
      username,
      password,
    });

    const response = await fetch(`${url}/player_api.php?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Invalid IPTV credentials');
    }
    
    const data = await response.json();
    if (!data || data.user_info?.auth === 0) {
      throw new Error('Invalid IPTV credentials');
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying IPTV credentials:', error);
    return false;
  }
}
