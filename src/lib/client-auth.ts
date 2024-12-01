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
    const session = await decrypt(token);
    console.log(session);
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

export async function setActiveProfile(profileId: number) {
  try {
    const response = await fetch('/api/profiles/setActive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to set active profile');
    }

    // Get updated session token from response cookies
    const data = await response.json();
    if (data.token) {
      setClientSession(data.token);
    }

    return true;
  } catch (error) {
    console.error('Error setting active profile:', error);
    return false;
  }
}