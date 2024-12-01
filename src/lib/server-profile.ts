import { cookies } from 'next/headers';
import { ActiveProfile } from './client-profile';
import { Profile } from '@/db/schema';

export async function setServerActiveProfile(profile: Profile) {
  const cookieStore = await cookies();
  cookieStore.set('activeProfile', JSON.stringify({
    ...profile,
    lastUpdated: Date.now()
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600 // 1 hour
  });
}

export async function getServerActiveProfile(): Promise<ActiveProfile | null> {
  try {
    const cookieStore = await cookies();
    const profileStr = cookieStore.get('activeProfile')?.value;
    
    if (!profileStr) return null;
    
    const profile = JSON.parse(profileStr) as ActiveProfile;
    // Check if profile data is stale
    const isStale = Date.now() - profile.lastUpdated > 3600000;
    if (isStale) {
      await clearServerActiveProfile();
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Error reading server active profile:', error);
    return null;
  }
}

export async function clearServerActiveProfile() {
  const cookieStore = await cookies();
  cookieStore.delete('activeProfile');
}
