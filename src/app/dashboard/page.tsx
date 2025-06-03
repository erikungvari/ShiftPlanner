'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@/components/MenuItems';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  companyId?: string;
}

interface Company {
  id: string;
  name: string;
  bossId: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBoss, setIsBoss] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length === 0) return setFilteredUsers([]);
      const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`);
      const users = await res.json();
      setFilteredUsers(users);
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (!res.ok || !data.isLoggedIn) {
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUserAndCompany = async () => {
      try {
        const userRes = await fetch('/api/user');
        const userData = await userRes.json();
        setUser(userData);

        if (userData.companyId) {
          const companyRes = await fetch(`/api/company/${userData.companyId}`);
          const companyData = await companyRes.json();
          setCompany(companyData);
          setIsBoss(companyData.bossId === userData.id);
        }
      } catch (error) {
        console.error('Failed to fetch user or company data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCompany();
  }, []);
  

  const createCompany = () => router.push('/createCompany');
  const joinCompany = () => router.push('/joinCompany');
  const manageCompany = () => router.push('/manageCompany');
  const openCalendar = () => router.push('/calendar');
  const generateHours = async () => {
    try {
      const res = await fetch(`/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to generate company hours');
      }

      if (!company?.id) {
        throw new Error('Company ID is undefined. Cannot generate company hours.');
      }

      const initHoursRes = await fetch(`/api/createInitCompanyHours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId: company.id }),
      });

      if (!initHoursRes.ok) {
        const errorDetails = await initHoursRes.json();
        console.error('Error details:', errorDetails);
        throw new Error(`Failed to initialize company hours: ${errorDetails.message || 'Unknown error'}`);
      }

      alert('Company hours generated successfully!');
    } catch (error) {
      console.error('Error generating company hours:', error);
      alert('An error occurred while generating company hours.');
    }
  };


  if (isLoading) return <p>Loading dashboard...</p>;

  if (!user) return null;

  // User has no company
  if (!user.companyId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex space-x-36">
          <button onClick={joinCompany} className="h-[37rem] w-[27rem] bg-gray-200 rounded-3xl text-3xl font-semibold shadow-md hover:shadow-2xl hover:bg-gray-300 transition hover:-translate-y-8">
            Join a Company
          </button>
          <button onClick={createCompany} className="h-[37rem] w-[27rem] bg-gray-200 rounded-3xl text-3xl font-semibold shadow-md hover:shadow-2xl hover:bg-gray-300 transition hover:-translate-y-8">
            Create a Company
          </button>
        </div>
        <Menu />
      </div>
    );
  }

  // User is company boss
  if (isBoss) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-lg text-gray-600 mb-16">You are managing: {company?.name}</p>

        <div className="flex space-x-6 my-20">
          <button onClick={openCalendar} className="h-[20rem] w-[25rem] bg-gray-200 rounded-3xl text-2xl font-semibold shadow-md hover:shadow-2xl hover:bg-gray-300 transition hover:-translate-y-6">
            Calendar
          </button>
          <button disabled className="h-[20rem] w-[25rem] bg-gray-200 rounded-3xl text-gray-600 text-2xl font-semibold shadow-md cursor-not-allowed">
            Company Chat <br></br>
            (coming soon...)
          </button>
          <button disabled className="h-[20rem] w-[25rem] bg-gray-200 rounded-3xl text-gray-600 text-2xl font-semibold shadow-md cursor-not-allowed">
            Events <br></br>
            (coming soon...)
          </button>
        </div>

        {/* <div className="p-6">
          <input
            type="text"
            placeholder="Search users by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-full max-w-md mb-4"
          />
          {search && filteredUsers.length > 0 && (
            <ul className="bg-white border rounded shadow max-w-md w-full">
              {filteredUsers.map((u) => (
                <li
                  key={u.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => alert(`Selected: ${u.name}`)} // or navigate
                >
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div> */}



        {/* admin tools */}
        <div className="flex space-x-6 my-20">
          <button onClick={manageCompany} className="h-[10rem] w-[15rem] bg-blue-400 rounded-3xl text-xl font-semibold shadow-md hover:shadow-2xl hover:bg-blue-300 transition hover:-translate-y-6">
            Manage Company
          </button>
          <button onClick={generateHours} className="h-[10rem] w-[15rem] bg-green-400 rounded-3xl text-xl font-semibold shadow-md hover:shadow-2xl hover:bg-green-300 transition hover:-translate-y-6">
            Generate Company Hours
          </button>
        </div>
        <Menu />
      </div>
    );
  }

  // Regular employee
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-lg text-gray-600 mb-16">Company: {company?.name}</p>

      <div className="flex space-x-6 my-20">
          <button onClick={openCalendar} className="h-[20rem] w-[25rem] bg-gray-200 rounded-3xl text-2xl font-semibold shadow-md hover:shadow-2xl hover:bg-gray-300 transition hover:-translate-y-6">
            Calendar
          </button>
          <button disabled className="h-[20rem] w-[25rem] bg-gray-200 rounded-3xl text-gray-600 text-2xl font-semibold shadow-md cursor-not-allowed">
            Company Chat <br></br>
            (coming soon...)
          </button>
          <button disabled className="h-[20rem] w-[25rem] bg-gray-200 rounded-3xl text-gray-600 text-2xl font-semibold shadow-md cursor-not-allowed">
            Events <br></br>
            (coming soon...)
          </button>
        </div>
      <Menu />
    </div>
  );
}
