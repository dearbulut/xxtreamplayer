import { decrypt } from "./cryptography";

export interface ClientSession {
  id: number;
  email: string;
  activeProfileId: number | null;
}

// Client-side session management
export async function getClientSession() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }
  
  try {
    return await decrypt(token);
  } catch (error) {
    return null;
  }
}

export function setClientSession(token: string) {
  localStorage.setItem('token', token);
}

export async function clearSession() {
  // Clear client-side storage
  localStorage.removeItem('token');
  
  // Clear server-side cookie
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function setActiveProfile(profileData: any) {
  try {
    // Update local storage with the active profile
    localStorage.setItem('activeProfile', JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error('Error setting active profile:', error);
    return false;
  }
}