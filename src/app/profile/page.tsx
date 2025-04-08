"use client";

import Menu from "@/components/MenuItems";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  bio?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [formData, setFormData] = useState<User>({ name: "", email: "", bio: "" });
  const router = useRouter();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };  

    checkAuth();
  }, []);
  
  if(!isLoggedIn){
    router.push("/login");
  }

  // Fetch user data from API
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data);
      setFormData(data);
    }
    fetchUser();
  }, []);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited data
  const handleSave = async () => {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setUser(formData);
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone!')) return;

    const res = await fetch('/api/user/delete', {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Your account has been deleted.');
      router.push('/register'); // Redirect to register or homepage
    } else {
      alert('Failed to delete account.');
    }
  };

  return (
    <div>

      <div className="fixed h-[90%] top-[5%] w-[80%] left-[10%]  p-10 bg-white rounded-xl shadow-lg text-lg">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        {user ? (
          <div>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Bio"
                ></textarea>
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="ml-2 text-gray-500">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="py-2"><strong>Name:</strong> {user.name}</p>
                <p className="py-2"><strong>Email:</strong> {user.email}</p>
                <p className="py-2"><strong>Bio:</strong> {user.bio || "No bio available"}</p>
                <button onClick={() => setIsEditing(true)} className="bg-gray-300 mr-4 px-4 py-2 rounded-lg">
                  Edit Profile
                </button>
                <button onClick={handleDeleteAccount} className="bg-red-500 text-white mr-4 px-4 py-2 mt-4 rounded-lg">
                  Delete Account
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Menu />
    </div>

  );
}
