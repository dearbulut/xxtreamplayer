import { db } from '@/db';
import { users } from '@/db/schema';
import { encrypt } from '@/lib/cryptography';
import { checkPassword } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !checkPassword(password, user.password)) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = await encrypt({
    id: user.id,
    email: user.email,
  });

  // Set cookie
  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  // Return token for client-side storage
  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' },
  });
}