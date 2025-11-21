import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, MenuIcon, UserCircleIcon, CogIcon, LogoutIcon } from './Icons';

interface HeaderProps {
    pageTitle: string;
    onMenuClick: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick, onLogout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="text-gray-500 mr-4 focus:outline-none lg:hidden">
                            <MenuIcon />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">{pageTitle}</h1>
                    </div>
                    
                    <div className="flex-1 max-w-xs mx-4">
                        <div className="relative">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                placeholder="Search something here..."
                                className="w-full pl-4 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <BellIcon />
                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">12</span>
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 cursor-pointer p-1 rounded-md hover:bg-gray-100">
                                <img className="h-9 w-9 rounded-full object-cover" src="https://picsum.photos/seed/admin/100/100" alt="User avatar" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 text-left">Oda Dink</p>
                                    <p className="text-xs text-gray-500">Super Admin</p>
                                </div>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <UserCircleIcon /> <span className="ml-2">View Profile</span>
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <CogIcon /> <span className="ml-2">Settings</span>
                                    </a>
                                    <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <LogoutIcon /> <span className="ml-2">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};