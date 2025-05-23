'use client';

import Menu from '@/components/MenuItems';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({name: '', email: '', password: '', passwordConfirm: '' });
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

    if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
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
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setSuccess('Registration successful!');
      setForm({ name: '', email: '', password: '', passwordConfirm: '' });
    } catch (error) {
      console.error('Register error:', error);
      setError('Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Menu/>
      <div className="fixed left-1/3 top-0 flex items-center justify-center w-4/12 min-h-screen bg-gray-100">
        <form className="bg-white p-6 rounded-xl shadow-lg w-[40rem] space-y-10" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
          {error && <p className="text-red-500 my-2">{error}</p>}
          {success && <p className="text-green-500 my-2">{success}</p>}
          <input name="name" placeholder="Name" className="my-2 p-6 border rounded-2xl w-full h-14" onChange={handleChange} value={form.name} />
          <input name="email" type="email" placeholder="Email" className="my-2 p-6 border rounded-2xl w-full h-14" onChange={handleChange} value={form.email} />
          <div className="relative mb-2">
            <input
              name="password"
              type={showPassword1 ? 'text' : 'password'}
              placeholder="Password"
              className="p-6 border rounded-2xl w-full h-14"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-4 text-gray-500 h-14" onClick={togglePasswordVisibility1}>
              {showPassword1 ? '👁️' : '🔒'}
            </button>
          </div>
          <div className="relative mb-2">
            <input
              name="passwordConfirm"
              type={showPassword2 ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="p-6 border rounded-2xl w-full h-14"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-4 text-gray-500 h-14" onClick={togglePasswordVisibility2}>
              {showPassword2 ? '👁️' : '🔒'}
            </button>
        </div>          <p className='text-md leading-6'>Already have an account? <a href='/login' className='text-blue-500'>Log in here!</a></p>
          <button type="submit" className="w-full h-14 bg-zinc-500 text-white my-2 p-2 rounded-2xl" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
    
  );
}
