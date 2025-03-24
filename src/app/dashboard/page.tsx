import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import Menu from '@/components/MenuItems';

const SECRET = process.env.JWT_SECRET || '922d966e88425a8e692762c95d1da273f75d707aa1b6204eea069282f8344d7f';

export default async function Dashboard() {
    // ✅ Fix: Await cookies() since it's a promise
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        jwt.verify(token, SECRET);
    } catch (error) {
        console.error('Invalid token:', error);
        redirect('/login'); // Redirect on invalid token
    }

    return (
        <div>
            <Menu />
            <h1>Dashboard</h1>
            <p>Welcome! You are logged in.</p>
        </div>
    );
}
