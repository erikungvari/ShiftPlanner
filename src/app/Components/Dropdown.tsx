'use client'

import React, { useState } from 'react'
import Link from 'next/link';

import { MenuItem } from './Header';

interface Props {
    item: MenuItem;
}

export default function Dropdown(props: Props) {
    const { item } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuItems = item?.children ? item.children : [];

    const mouseEnter = () => {
        setIsOpen(true);
    }
    const mouseLeave = () => {
        setIsOpen(false);
    }

    const transClass = isOpen
        ?
        "flex"
        :
        "hidden";

        /*return (
            <>
                
                {
                    isOpen
                        ?
                        <div className="relative flex flex-row items-center w-48 h-full" onMouseLeave={mouseLeave}>
                            <div className='flex justify-center w-1/4'><img src='https://cdn-icons-png.flaticon.com/512/271/271220.png' className='w-8'/></div>
                            
                            <div className={`w-3/4 flex flex-col items-center py-4 bg-zinc-400 rounded-md text-lg`}>
                            {
                                menuItems.map(item =>
                                    <Link
                                        key={item.route}
                                        className="hover:bg-zinc-300 hover:text-zinc-500 px-4 py-1"
                                        href={item?.route || ''}
                                    >{item.title}</Link>
                                )
                            }
                            </div>
                        </div>
                        :
                        <>
                        <div className="relative flex items-center justify-center w-12 h-full" onMouseEnter={mouseEnter}>
                            <img src='https://cdn-icons-png.flaticon.com/512/271/271220.png' className='w-8'/>
                        </div>
                        </>
                }
            </>
        )*/
            return (
                <div className="relative">
                {/* Dropdown Button */}
                <div
                    className="flex items-center justify-center w-12 h-full cursor-pointer"
                    onMouseEnter={mouseEnter}
                >
                    <img src="https://cdn-icons-png.flaticon.com/512/271/271220.png" className="w-8" />
                </div>
    
                {/* Animated Dropdown Menu */}
                <div
                    className={`absolute left-0 mt-2 w-48 bg-zinc-400 rounded-md text-lg overflow-hidden 
                    transition-all duration-300 ease-in-out transform origin-top
                    ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
                    onMouseLeave={mouseLeave}
                >
                    {menuItems.map((item) => (
                        <Link
                            key={item.route}
                            className="block px-4 py-2 hover:bg-zinc-300 hover:text-zinc-500"
                            href={item?.route || ""}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
            )
}