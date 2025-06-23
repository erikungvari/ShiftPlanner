'use client';

import Menu from "@/components/MenuItems";
import React, { useState, useEffect } from "react";

async function fetchCompanyHours(weekStart: Date, companyId: string): Promise<{ [hour: string]: boolean }> {
    const res = await fetch(`/api/company/${companyId}/hours?weekStart=${weekStart.toISOString()}`);
    if (!res.ok) throw new Error("Failed to fetch company hours");
    const data = await res.json();
    const hours: { [hour: string]: boolean } = {};
    data.hours.forEach((iso: string) => {
        hours[iso] = true;
    });
    return hours;
}

async function assignUserHours(selected: string[]): Promise<void> {
  const res = await fetch('/api/user/hours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hours: selected })
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to assign hours');
  }
}


function getWeekStart(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function CalendarPage() {
    const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
    const [companyHours, setCompanyHours] = useState<{ [hour: string]: boolean }>({});
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState<string | null>(null);

    useEffect(() => {
        const loadUserAndCompanyHours = async () => {
            try {
                const userRes = await fetch('/api/user');
                if (!userRes.ok) throw new Error("Not authenticated");

                const user = await userRes.json();
                if (!user.companyId) throw new Error("No company ID");

                setCompanyId(user.companyId);

                const hours = await fetchCompanyHours(weekStart, user.companyId);
                setCompanyHours(hours);
            } catch (err) {
                console.error(err);
            }
        };

        loadUserAndCompanyHours();
        setSelected(new Set());
    }, [weekStart]);

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    function toggleHour(iso: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(iso)) next.delete(iso);
            else next.add(iso);
            return next;
        });
    }

    async function handleAssign() {
        if (!companyId) return;
        setLoading(true);
        try {
            await assignUserHours(Array.from(selected));
            setSelected(new Set());
            alert("Hours assigned successfully");
        } catch (err) {
            alert("Failed to assign hours");
        } finally {
            setLoading(false);
        }
    }

    function prevWeek() {
        setWeekStart((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return getWeekStart(d);
        });
    }

    function nextWeek() {
        setWeekStart((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return getWeekStart(d);
        });
    }

    if (!companyId || Object.keys(companyHours).length === 0) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 mr-20">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <button onClick={prevWeek} className="p-2 bg-gray-500 text-white rounded mr-2">
                        Previous Week
                    </button>
                    <button onClick={nextWeek} className="p-2 bg-blue-500 text-white rounded">
                        Next Week
                    </button>
                </div>
                <button
                    onClick={handleAssign}
                    className="p-2 bg-green-600 text-white rounded"
                    disabled={loading || selected.size === 0}
                >
                    {loading ? "Assigning..." : "Assign Selected Hours"}
                </button>
            </div>
            <div className="overflow-x-auto">
                <div className="grid grid-cols-[120px_repeat(24,_minmax(40px,_1fr))] border border-gray-300">
                    <div className="p-2 border font-bold bg-gray-100">Day</div>
                    {HOURS.map((hour) => (
                        <div key={hour} className="p-2 border font-bold bg-gray-100 text-center">
                            {hour}:00
                        </div>
                    ))}
                    {days.map((date) => (
                        <React.Fragment key={date.toDateString()}>
                            <div className="p-2 border font-semibold bg-gray-200">
                                {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                            </div>
                            {HOURS.map((hour) => {
                                const cellDate = new Date(date);
                                cellDate.setHours(hour, 0, 0, 0);
                                const iso = cellDate.toISOString();
                                const available = companyHours[iso];
                                const isSelected = selected.has(iso);
                                return (
                                    <div
                                        key={iso}
                                        className={`p-2 border text-center cursor-pointer select-none
                                            ${!available ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                                            ${isSelected ? "bg-blue-400 text-white" : ""}
                                        `}
                                        onClick={() => available && toggleHour(iso)}
                                    >
                                        {isSelected ? "✔" : ""}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <Menu />
        </div>
    );
}
