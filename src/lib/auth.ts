import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const key = { kty: 'oct', k: Buffer.from(secretKey).toString('base64') };

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession() {
  var cookies_data = await cookies();
  const token = cookies_data.get('token')?.value;
  if (!token) return null;
  try {
    return await decrypt(token);
  } catch (error) {
    return null;
  }
}