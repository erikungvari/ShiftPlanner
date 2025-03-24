'use client';

import Menu from '@/components/MenuItems';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ nickname: '', email: '', password: '', passwordConfirm: '' });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1((prev) => !prev);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nickname || !form.email || !form.password || !form.passwordConfirm) {
      setError('All fields are required.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: form.nickname,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setSuccess('Registration successful!');
      setForm({ nickname: '', email: '', password: '', passwordConfirm: '' });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Menu/>
      <div className="fixed left-1/3 top-0 flex items-center justify-center w-4/12 min-h-screen bg-gray-100">
        <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
          {error && <p className="text-red-500 my-2">{error}</p>}
          {success && <p className="text-green-500 my-2">{success}</p>}
          <input name="nickname" placeholder="Nickname" className="my-2 p-2 border rounded w-full" onChange={handleChange} value={form.nickname} />
          <input name="email" type="email" placeholder="Email" className="my-2 p-2 border rounded w-full" onChange={handleChange} value={form.email} />
          <div className="relative mb-2">
            <input
              name="password"
              type={showPassword1 ? 'text' : 'password'}
              placeholder="Password"
              className="p-2 border rounded w-full"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={togglePasswordVisibility1}>
              {showPassword1 ? '👁️' : '🔒'}
            </button>
          </div>
          <div className="relative mb-2">
            <input
              name="passwordConfirm"
              type={showPassword2 ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="p-2 border rounded w-full"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={togglePasswordVisibility2}>
              {showPassword2 ? '👁️' : '🔒'}
            </button>
        </div>          <p className='text-sm leading-10'>Already have an account? <a href='/login' className='text-blue-500'>Log in here!</a></p>
          <button type="submit" className="w-full bg-zinc-500 text-white my-2 p-2 rounded" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
    
  );
}
