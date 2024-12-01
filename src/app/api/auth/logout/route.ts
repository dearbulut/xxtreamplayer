import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the server-side cookie
  cookieStore.delete('token');
  
  return NextResponse.json(
    { message: 'Logged out successfully' },
    {
      status: 200,
      headers: {
        'Set-Cookie': `token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
      }
    }
  );
}
