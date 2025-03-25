"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/MenuItems";

const HOURS = Array.from({ length: 12 }, (_, i) => `${i+6}:00 - ${i + 7}:00`);
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

export default function CalendarDashboard() {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedHours, setSelectedHours] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();

        if (!response.ok || !data.isLoggedIn) {
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    async function fetchUser() {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUser(data);
      }
      fetchUser();

    // Load saved selections
    const savedHours = localStorage.getItem("selectedHours");
    if (savedHours) {
      setSelectedHours(JSON.parse(savedHours));
    }
  }, [router]);

  // Toggle hour selection
  const toggleHour = (dayIndex: number, hourIndex: number) => {
    const key = `week${weekOffset}-day${dayIndex}-hour${hourIndex}`;
    setSelectedHours((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("selectedHours", JSON.stringify(updated));
      return updated;
    });
  };

  const nextWeek = () => setWeekOffset((prev) => prev + 7);
  const prevWeek = () => setWeekOffset((prev) => prev - 7);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-600">{user.bio || "No qualifications added yet"}</p>

          <div className="mt-4 space-x-4">
            <button onClick={prevWeek} className="p-2 bg-gray-500 text-white rounded">
              Previous Week
            </button>
            <button onClick={nextWeek} className="p-2 bg-blue-500 text-white rounded">
              Next Week
            </button>
          </div>

          {/* Grid Layout: Days on Left, Hours on Right */}
          <div className=" mt-6 w-[90%]">
            <div className="grid grid-cols-[150px_repeat(12,_1fr)] border border-gray-300">
              {/* Header Row */}
              <div className="p-2 border font-bold bg-gray-100">Days</div>
              {HOURS.map((hour) => (
                <div key={hour} className="p-2 border font-bold bg-gray-100 text-center">
                  {hour}
                </div>
              ))}

              {/* Rows for Days */}
              {DAYS.map((day, dayIndex) => (
                <React.Fragment key={day}>
                  <div className="p-2 border font-semibold bg-gray-200">{day}</div>
                  {HOURS.map((_, hourIndex) => {
                    const key = `week${weekOffset}-day${dayIndex}-hour${hourIndex}`;
                    return (
                      <div
                        key={key}
                        className={`p-2 border cursor-pointer text-center ${
                          selectedHours[key] ? "bg-blue-300" : ""
                        }`}
                        onClick={() => toggleHour(dayIndex, hourIndex)}
                      >
                        {selectedHours[key] ? "✔" : ""}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Redirecting to login...</p>
      )}
      <Menu/>
    </div>
  );
}
