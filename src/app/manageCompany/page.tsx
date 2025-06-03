'use client';

import Menu from '@/components/MenuItems';
import React, { useEffect, useState } from 'react';

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
    description?: string;
    website: string;
    bossId: string;
}

export default function manageCompany() {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBoss, setIsBoss] = useState(false);

    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [employees, setEmployees] = useState<User[]>([]);
    const [newEmployee, setNewEmployee] = useState<User | null>(null);

    const [editingCompany, setEditingCompany] = useState(false);
    const [editedCompany, setEditedCompany] = useState<Company | null>(null);

    const fetchEmployees = async (companyId: string) => {
        try {
            const response = await fetch(`/api/company/${companyId}/employees`, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const employeeList = await response.json();
            setEmployees(employeeList);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleAddEmployee = async () => {
        if (!newEmployee || !company) return;

        try {
            const response = await fetch(`/api/company/${company.id}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: newEmployee.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            setEmployees((prev) => [...prev, newEmployee]);
            setNewEmployee(null);
            setSearch('');
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee. Please try again.');
        }
    };

    const handleRemoveEmployee = async (employeeId: string) => {
        if (!company) return;

        try {
            const response = await fetch(`/api/company/${company.id}/employees/${employeeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove employee');
            }

            setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
        } catch (error) {
            console.error('Error removing employee:', error);
            alert('Failed to remove employee. Please try again.');
        }
    };

    const handleSaveCompanyInfo = async () => {
        if (!editedCompany) return;

        try {
            const response = await fetch(`/api/company/${editedCompany.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedCompany),
            });

            if (!response.ok) {
                throw new Error('Failed to update company info');
            }

            setCompany(editedCompany);
            setEditingCompany(false);
        } catch (error) {
            console.error('Error updating company info:', error);
            alert('Failed to update company info. Please try again.');
        }
    };

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
        const fetchUserAndCompany = async () => {
            try {
                const userRes = await fetch('/api/user');
                const userData = await userRes.json();
                setUser(userData);

                if (userData.companyId) {
                    const companyRes = await fetch(`/api/company/${userData.companyId}`);
                    const companyData = await companyRes.json();
                    setCompany(companyData);
                    setEditedCompany(companyData);
                    setIsBoss(companyData.bossId === userData.id);

                    await fetchEmployees(userData.companyId);
                }
            } catch (error) {
                console.error('Failed to fetch user or company data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAndCompany();
    }, []);

    return (
        <div>
            <div className="p-10 bg-gray-100 min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800 mb-10">Manage Company</h1>

                {isBoss && (
                    <section className="bg-white p-8 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Edit Company Info</h2>
                        {editingCompany ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedCompany?.name || ''}
                                    onChange={(e) =>
                                        setEditedCompany((prev) => prev && { ...prev, name: e.target.value })
                                    }
                                    placeholder="Company Name"
                                    className="border px-4 py-2 rounded w-full mb-4"
                                />
                                <textarea
                                    value={editedCompany?.description || ''}
                                    onChange={(e) =>
                                        setEditedCompany((prev) => prev && { ...prev, description: e.target.value })
                                    }
                                    placeholder="Company Description"
                                    className="border px-4 py-2 rounded w-full mb-4"
                                />
                                <input
                                    type="text"
                                    value={editedCompany?.website || ''}
                                    onChange={(e) =>
                                        setEditedCompany((prev) => prev && { ...prev, website: e.target.value })
                                    }
                                    placeholder="Company Website"
                                    className="border px-4 py-2 rounded w-full mb-4"
                                />
                                <button
                                    onClick={handleSaveCompanyInfo}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingCompany(false)}
                                    className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p><strong>Name:</strong> {company?.name}</p>
                                <p><strong>Description:</strong> {company?.description}</p>
                                <p><strong>Website:</strong> {company?.website}</p>
                                <button
                                    onClick={() => setEditingCompany(true)}
                                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </section>
                )}

                <section className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Manage Employees</h2>
                    <div className="relative py-4">
                        <input
                            type="text"
                            placeholder="Search users by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded w-full max-w-md mb-4"
                        />
                        {search && filteredUsers.length > 0 && (
                            <ul className="absolute z-10 bg-white border rounded shadow max-w-md w-full">
                                {filteredUsers.map((u) => (
                                    <li
                                        key={u.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setNewEmployee(u);
                                            setSearch(u.name);
                                            setFilteredUsers([]);
                                        }}
                                    >
                                        <div className="font-medium">{u.name}</div>
                                        <div className="text-sm text-gray-600">{u.email}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            onClick={handleAddEmployee}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="space-y-4">
                        {employees.map((employee) => (
                            <li
                                key={employee.id}
                                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
                            >
                                <span className="text-gray-700">{employee.name}</span>
                                <button
                                    onClick={() => handleRemoveEmployee(employee.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
            <Menu />
        </div>
    );
};
