import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    await db.insert(users).values({
      email,
      password, // In production, hash the password!
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response('Error creating user', { status: 500 });
  }
}