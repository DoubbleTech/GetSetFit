import React from 'react';
import { HomeIcon, BriefcaseIcon, ClipboardListIcon, ChatIcon, ChartBarIcon, NewspaperIcon } from './Icons';

export type Page = 'Dashboard' | 'Jobs' | 'Applications' | 'Message' | 'Statistics' | 'News';

const navItems: { name: Page; icon: React.ReactNode }[] = [
    { name: 'Dashboard', icon: <HomeIcon /> },
    { name: 'Jobs', icon: <BriefcaseIcon /> },
    { name: 'Applications', icon: <ClipboardListIcon /> },
    { name: 'Message', icon: <ChatIcon /> },
    { name: 'Statistics', icon: <ChartBarIcon /> },
    { name: 'News', icon: <NewspaperIcon /> },
];

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen }) => {
    const baseClasses = "flex items-center px-6 py-3 my-1 font-medium rounded-lg transition-colors";
    const activeClasses = "bg-white/10 text-white";
    const inactiveClasses = "text-indigo-100 hover:bg-white/5";

    return (
        <aside className={`bg-indigo-900 text-white flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="flex items-center justify-center h-16 border-b border-white/10 space-x-2">
                <img src="/media/logo.png" alt="Recruite Tree" className="w-8 h-8 object-contain" />
                <h1 className="text-xl font-bold">Recruite Tree</h1>
            </div>
            <nav className="mt-6 px-4">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setActivePage(item.name)}
                        className={`${baseClasses} ${activePage === item.name ? activeClasses : inactiveClasses} w-full text-left`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </button>
                ))}
            </nav>
        </aside>
    );
};