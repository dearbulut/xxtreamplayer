import { decrypt } from "./cryptography";

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