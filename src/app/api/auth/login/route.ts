import { db } from '@/db';
import { users } from '@/db/schema';
import { encrypt } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || user.password !== password) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = await encrypt({ id: user.id, email: user.email });
  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return new Response(JSON.stringify({ success: true }));
}