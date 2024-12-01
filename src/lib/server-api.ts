import axios from 'axios';
import { getServerActiveProfile } from './server-profile';

export async function fetchFromServerApi(action: string, params: Record<string, string> = {}) {
  const activeProfile = await getServerActiveProfile();
  
  if (!activeProfile) {
    // Fallback to environment variables
    const baseUrl = process.env.NEXT_PUBLIC_IPTV_BASE_URL;
    const username = process.env.NEXT_PUBLIC_IPTV_USERNAME;
    const password = process.env.NEXT_PUBLIC_IPTV_PASSWORD;

    if (!baseUrl || !username || !password) {
      throw new Error('No active profile and missing IPTV configuration in environment variables');
    }

    const searchParams = new URLSearchParams({
      username,
      password,
      ...params,
    });

    const response = await axios.get(`${baseUrl}/player_api.php?action=${action}&${searchParams}`);
    return response.data;
  }

  const searchParams = new URLSearchParams({
    username: activeProfile.iptvUsername,
    password: activeProfile.iptvPassword,
    ...params,
  });

  const response = await axios.get(`${activeProfile.iptvUrl}/player_api.php?action=${action}&${searchParams}`);
  return response.data;
}

export async function getServerStreamUrl(streamId: number, streamType: 'live' | 'movie' | 'series') {
  const activeProfile = await getServerActiveProfile();
  
  if (!activeProfile) {
    // Fallback to environment variables
    const baseUrl = process.env.NEXT_PUBLIC_IPTV_BASE_URL;
    const username = process.env.NEXT_PUBLIC_IPTV_USERNAME;
    const password = process.env.NEXT_PUBLIC_IPTV_PASSWORD;

    if (!baseUrl || !username || !password) {
      throw new Error('No active profile and missing IPTV configuration in environment variables');
    }

    return `${baseUrl}/${streamType}/${username}/${password}/${streamId}.m3u8`;
  }

  return `${activeProfile.iptvUrl}/${streamType}/${activeProfile.iptvUsername}/${activeProfile.iptvPassword}/${streamId}.m3u8`;
}
