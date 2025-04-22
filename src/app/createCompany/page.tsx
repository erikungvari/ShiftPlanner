'use client'

import Menu from '@/components/MenuItems';
import React, { useState } from 'react';

export default function CreateCompanyForm() {
    const [form, setForm] = useState({
        companyName: '',
        industry: '',
        website: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCompanySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        if (!form.companyName || !form.industry) {
          setError('Company name and industry are required.');
          return;
        }
    
        setLoading(true);
    
        try {
          const res = await fetch('/api/createCompany', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyName: form.companyName,
              industry: form.industry,
              website: form.website,
              description: form.description
            }),
          });
    
          const data = await res.json();
    
          if (!res.ok) {
            throw new Error(data.message || 'Something went wrong.');
          }
    
          setSuccess('Registration successful!');
          setForm({ companyName: '', industry: '', website: '', description: '' });
        } catch (error) {
          console.error('Register error:', error);
          setError('Register failed');
        } finally {
          setLoading(false);
        }
      };

    return (
        <div>
            <div className="fixed left-1/3 top-0 flex items-center justify-center w-4/12 min-h-screen bg-gray-100">
                <form className="bg-white p-6 rounded-xl shadow-lg w-[40rem] space-y-10" onSubmit={handleCompanySubmit}>
                    <h2 className="text-xl font-bold my-4 text-center">Create a Company</h2>

                    {error && <p className="text-red-500 my-2">{error}</p>}
                    {success && <p className="text-green-500 my-2">{success}</p>}

                    <input
                        name="companyName"
                        placeholder="Company Name"
                        className="p-6 border rounded-2xl w-full h-14"
                        onChange={handleChange}
                        value={form.companyName}
                    />

                    <input
                        name="industry"
                        placeholder="Industry"
                        className="p-6 border rounded-2xl w-full h-14"
                        onChange={handleChange}
                        value={form.industry}
                    />

                    <input
                        name="website"
                        type="url"
                        placeholder="Website"
                        className="p-6 border rounded-2xl w-full h-14"
                        onChange={handleChange}
                        value={form.website}
                    />

                    <textarea
                        name="description"
                        placeholder="Company Description"
                        rows={3}
                        className="p-6 border rounded-2xl w-full"
                        onChange={handleChange}
                        value={form.description}
                    />

                    <button
                        type="submit"
                        className="w-full bg-zinc-500 text-white my-2 p-2 rounded-2xl h-14"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Company'}
                    </button>
                </form>
            </div>
            <Menu />
        </div>

    );
};

