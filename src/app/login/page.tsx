'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@/components/MenuItems';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials.');
      }

      router.push('/dashboard'); // Redirect after login
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid e-mail or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Menu />
      <div className="fixed left-1/3 top-0 flex items-center justify-center w-4/12 min-h-screen bg-gray-100">
        <form className="bg-white p-6 rounded-xl shadow-lg w-[40rem] space-y-10" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold my-4 text-center">Login</h2>
          {error && <p className="text-red-500 my-2">{error}</p>}
          <input name="email" type="email" placeholder="Email" className="my-2 p-6 border rounded-2xl w-full h-14" onChange={handleChange} value={form.email} />
          <div className="relative mb-2">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="p-6 border rounded-2xl w-full h-14"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-4 text-gray-500 h-14" onClick={togglePasswordVisibility}>
              {showPassword ? '👁️' : '🔒'}
            </button>
          </div>          
          <p className='text-md leading-6'>Don&apos;t have an account? <a href='/register' className='text-blue-500'>Register now!</a></p>
          <button type="submit" className="w-full bg-zinc-500 text-white my-2 p-2 rounded-2xl h-14" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>

  );
}
