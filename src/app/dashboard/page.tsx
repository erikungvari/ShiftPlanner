import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import Menu from '@/components/MenuItems';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function Dashboard(){
    const token = (await cookies()).get('auth_token')?.value;

    if (!token || !jwt.verify(token, SECRET)) {
        redirect('/login');
    }

    return (
        <div>
            <Menu/>
            <div>
                Dashboard
            </div>
        </div>
    );
}