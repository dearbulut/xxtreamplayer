
import { cookies } from 'next/headers';
import { decrypt } from './cryptography';


export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return null;
  }

  try {
    return await decrypt(token.value);
  } catch (error) {
    return null;
  }
}
