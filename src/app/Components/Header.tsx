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
          title: "Projects",
          route: "/projects",
        },
        {
          title: "Settings",
          route: "/settings",
        },
        {
            title: "Log Out",
            route: "/logout",
          },
      ],
    },
];

export default function Header() {
  return (
      <div className="flex gap-8 items-center h-96 rounded-l-lg text-black bg-zinc-400">
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