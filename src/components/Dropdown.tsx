'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuItem } from './Header';

interface Props {
    item: MenuItem;
}

export default function Dropdown(props: Props) {
    const { item } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuItems = item?.children ? item.children : [];
    const router = useRouter();

    const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

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

        return (
            <>
                
                {
                    isOpen
                        ?
                        <div className="relative flex flex-row items-center w-48 h-full" onMouseLeave={mouseLeave}>
                            <div className='flex justify-center w-1/4'><img src='https://cdn-icons-png.flaticon.com/512/271/271220.png' className='w-8'/></div>
                            
                            <div className={`w-3/4 flex flex-col items-center py-4 rounded-md text-lg`}>
                            {
                                menuItems.map(item =>
                                    <Link
                                        key={item.route}
                                        className=" hover:text-blue-300  px-4 my-2"
                                        href={item?.route || ''}
                                    >{item.title}</Link>
                                )                                
                            }
                            <button onClick={handleLogout} className="hover:text-blue-300  px-4 my-2">Logout</button>
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
        )
}