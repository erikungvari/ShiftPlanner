'use client'

import React, { useState } from "react";
import Link from "next/link";
import Dropdown from "./Dropdown";

export interface MenuItem {
  title?: String;
  route?: string;
  children?: MenuItem[];
}
const menuItems: MenuItem[] = [
    {
      children: [
        {
          title: "Profile",
          route: "/profile",
        },
        {
          title: "Dashboard",
          route: "/dashboard",
        },
        {
          title: "Settings",
          route: "/settings",
        },
        {
          title: "Log In",
          route: "/login",
        },
        {
          title: "Register",
          route: "/register",
        },
      ],
    },
];

export default function Header() {
  return (
      <div className="flex gap-8 items-center h-3/5 rounded-l-3xl text-white bg-zinc-500">
        {menuItems.map((item) => {
          return item.hasOwnProperty("children") ? (
            <Dropdown item={item} />
          ) : (
            <Link className="hover:text-blue-500" href={item?.route || ""}>
              {item.title}
            </Link>
          );
        })}
      </div>
  );
}