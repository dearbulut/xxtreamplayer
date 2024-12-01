import { SignJWT, jwtVerify } from 'jose';

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
    console.log(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ['HS256'],
  });
  return payload;
}