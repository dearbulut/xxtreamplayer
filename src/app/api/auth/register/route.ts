import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/utils';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const hashedPassword = hashPassword(password);
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response('Error creating user', { status: 500 });
  }
}