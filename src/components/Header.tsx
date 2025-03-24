"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { useRouter } from "next/navigation";

export interface MenuItem {
  title?: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    router.push("/login");
  };

  const menuItems: MenuItem[] = [
    {
      children: isLoggedIn
        ? [
          {
            title: "Profile",
            route: "/profile",
            icon: "https://cdn-icons-png.flaticon.com/512/6522/6522516.png",
          },
          {
            title: "Dashboard",
            route: "/dashboard",
            icon: "https://png.pngtree.com/png-vector/20230302/ourmid/pngtree-dashboard-line-icon-vector-png-image_6626604.png",
          },
          {
            title: "Settings",
            route: "/settings",
            icon: "https://static.thenounproject.com/png/1324046-200.png",
          },
        ]
        : [
          {
            title: "Log In",
            route: "/login",
            icon: "https://icons.veryicon.com/png/o/miscellaneous/esgcc-basic-icon-library/1-login.png",
          },
          {
            title: "Register",
            route: "/register",
            icon: "https://icons.veryicon.com/png/o/commerce-shopping/three-shopping-mall/business-registration.png",
          },
        ],
    },
  ];

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`fixed top-0 right-0 h-screen flex flex-col items-start bg-zinc-200 border-zinc-400 border-l-[3px] transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-[11rem]"}`}
    >
      <div className="h-auto w-full">
        {menuItems.map((item, index) => (
          <Dropdown key={index} item={item} isOpen={isOpen} />
        ))}
      </div>

      <div
        className={`relative flex flex-col h-full w-48 bg-zinc-200 transition-transform duration-200 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="w-60 flex flex-col items-start pt-4 px-4 text-xl gap-y-4">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center w-full hover:text-gray-500 p-2"
            >
              <img src="https://icons.veryicon.com/png/o/commerce-shopping/three-shopping-mall/business-registration.png" className="h-8 w-8 mr-4 " />
              Log Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
