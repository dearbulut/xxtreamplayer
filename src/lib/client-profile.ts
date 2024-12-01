"use client";

import { Profile } from '@/db/schema'

export interface ActiveProfile extends Profile {
  lastUpdated: number;
}

export type ActiveProfileType = {
  id: string;
  iptvUrl: string;
  iptvUsername: string;
  iptvPassword: string;
};

const isClient = typeof window !== 'undefined';

export function setActiveProfile(profile: Profile) {
  if (!isClient) return;
  
  const activeProfile: ActiveProfile = {
    ...profile,
    lastUpdated: Date.now()
  };
  
  localStorage.setItem('activeProfile', JSON.stringify(activeProfile));
}

export function getActiveProfile(): ActiveProfile | null {
  if (!isClient) {
    return null;
  }

  try {
    
    const profileStr = localStorage.getItem('activeProfile');
    if (!profileStr) return null;
    
    const profile = JSON.parse(profileStr) as ActiveProfile;
    
    // Check if profile data is stale (older than 1 hour)
    const isStale = Date.now() - profile.lastUpdated > 3600000;
    if (isStale) {
      clearActiveProfile();
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Error reading active profile:', error);
    return null;
  }
}

export function clearActiveProfile() {
  if (!isClient) return;
  localStorage.removeItem('activeProfile');
  
  // Also clear on server
  fetch('/api/profiles/clearActive', {
    method: 'POST',
  }).catch(error => {
    console.error('Error clearing server active profile:', error);
  });
}

// Function to sync with server
export async function syncActiveProfile(): Promise<void> {
  try {
    const response = await fetch('/api/profiles/getActive');
    if (!response.ok) {
      throw new Error('Failed to fetch active profile');
    }
    
    const serverProfile = await response.json();
    if (serverProfile) {
      setActiveProfile(serverProfile);
    } else {
      clearActiveProfile();
    }
  } catch (error) {
    console.error('Error syncing active profile:', error);
  }
}
