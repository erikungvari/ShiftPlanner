import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  (await cookies()).set('auth_token', '', { expires: new Date(0) });

  return NextResponse.json({ message: 'Logged out successfully.' });
}
