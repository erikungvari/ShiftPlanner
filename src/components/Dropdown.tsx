'use client';

import React from 'react';
import Link from 'next/link';
import { MenuItem } from './Header';

interface Props {
    item: MenuItem;
    isOpen: boolean;
}

export default function Dropdown({ item, isOpen }: Props) {
    const menuItems = item?.children || [];
    return (
        <div 
            className={`relative flex flex-col h-full bg-zinc-200 transition-transform duration-200 ${
                isOpen ? "translate-x-0" : "translate-x-[11rem]"
            }`}
        >
            <div className="w-60 flex flex-col items-start pt-4 px-4 text-xl gap-y-4">
                {menuItems.map((menuItem) => (
                    <Link
                        key={menuItem.route}
                        className="flex items-center w-full hover:text-gray-500 p-2"
                        href={menuItem?.route || ''}
                    >
                        <img src={menuItem.icon} className="h-8 w-8 mr-4" alt={menuItem.title} />
                        <span>{menuItem.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
