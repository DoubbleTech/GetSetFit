import React, { useState } from 'react';
import { JobPortal } from '../types';
import { XIcon, PlusIcon } from './Icons';

interface DashboardViewProps {
    portals: JobPortal[];
    togglePortalConnection: (portalName: string) => void;
    addPortal: (name: string) => void;
}

const PortalAuthModal: React.FC<{ portal: JobPortal, onClose: () => void, onConnect: () => void }> = ({ portal, onClose, onConnect }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onConnect();
            onClose();
        }, 1500);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Connect to {portal.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex justify-center mb-6 text-indigo-600">
                         {React.cloneElement(portal.icon as React.ReactElement, { className: "w-12 h-12" })}
                    </div>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Sign in to your {portal.name} account to integrate it with Recruite Tree.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Username / Email</label>
                            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                        >
                            {loading ? 'Connecting...' : 'Sign In & Connect'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const AddPortalModal: React.FC<{ onClose: () => void, onAdd: (name: string) => void }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            onClose();
        }
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Add New Integration</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Portal Name</label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder="e.g. Rozee.pk, BambooHR"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            Add Portal
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const PortalConnections: React.FC<{ portals: JobPortal[], onToggleConnection: (portalName: string) => void, onAddPortal: () => void }> = ({ portals, onToggleConnection, onAddPortal }) => {
    const [selectedPortal, setSelectedPortal] = useState<JobPortal | null>(null);

    const handleAction = (portal: JobPortal) => {
        if (portal.isConnected) {
            if(confirm(`Are you sure, this action will stop jobportal integration for ${portal.name}?`)) {
                onToggleConnection(portal.name);
            }
        } else {
            setSelectedPortal(portal);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Job Portal Integrations</h2>
                <button onClick={onAddPortal} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center">
                    <PlusIcon /> <span className="ml-1">Add Portal</span>
                </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {portals.map(portal => (
                    <div key={portal.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                            <div className="text-gray-600 w-6 h-6 flex justify-center items-center">{portal.icon}</div>
                            <span className="font-semibold text-gray-700">{portal.name}</span>
                        </div>
                        <button 
                            onClick={() => handleAction(portal)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                portal.isConnected 
                                ? 'text-green-800 bg-green-100 hover:bg-red-100 hover:text-red-800' 
                                : 'text-gray-800 bg-gray-200 hover:bg-indigo-100 hover:text-indigo-800'
                            }`}
                        >
                            {portal.isConnected ? 'Connected' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
             {selectedPortal && (
                <PortalAuthModal 
                    portal={selectedPortal} 
                    onClose={() => setSelectedPortal(null)} 
                    onConnect={() => onToggleConnection(selectedPortal.name)}
                />
            )}
        </div>
    );
};

const PortalPerformanceChart: React.FC<{ portals: JobPortal[] }> = ({ portals }) => {
    const connectedPortals = portals.filter(p => p.isConnected);
    const maxApplications = Math.max(...connectedPortals.map(p => p.applications), 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Applications by Portal <span className="text-xs font-normal text-green-600 ml-2 animate-pulse">(Live)</span></h2>
            <div className="space-y-4">
                {connectedPortals.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No portals connected. Connect a portal to see real-time data.</p>
                ) : (
                    connectedPortals.map(portal => (
                        <div key={portal.name} className="flex items-center">
                            <span className="w-24 text-sm font-medium text-gray-600">{portal.name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 mr-4 relative overflow-hidden">
                                <div
                                    className={`${portal.color} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-1000 ease-in-out`}
                                    style={{ width: `${maxApplications > 0 ? (portal.applications / maxApplications) * 100 : 0}%` }}
                                >
                                    <span className="text-white text-xs font-bold">{portal.applications}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string, value: string | number, portal: JobPortal }> = ({ title, value, portal }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 transition-all duration-500">
        <div className={`p-3 rounded-full ${portal.color} text-white`}>
            {portal.icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title} from {portal.name}</p>
            <p className="text-2xl font-bold text-gray-800">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
    </div>
);


export const DashboardView: React.FC<DashboardViewProps> = ({ portals, togglePortalConnection, addPortal }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const connectedPortals = portals.filter(p => p.isConnected);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="md:col-span-1 space-y-6">
                    <PortalConnections 
                        portals={portals} 
                        onToggleConnection={togglePortalConnection} 
                        onAddPortal={() => setIsAddModalOpen(true)}
                    />
                </div>
                
                {/* Right Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {connectedPortals.map(portal => (
                         <StatCard key={`${portal.name}-apps`} title="Applications" value={portal.applications} portal={portal} />
                       ))}
                       {connectedPortals.map(portal => (
                         <StatCard key={`${portal.name}-views`} title="Post Views" value={portal.views} portal={portal} />
                       ))}
                       {connectedPortals.length === 0 && (
                           <div className="col-span-2 bg-blue-50 border border-blue-100 p-6 rounded-lg text-center">
                               <p className="text-blue-800 font-semibold">Connect a job portal to view real-time statistics.</p>
                           </div>
                       )}
                    </div>
                     <PortalPerformanceChart portals={portals} />
                </div>
            </div>

            {isAddModalOpen && (
                <AddPortalModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onAdd={addPortal} 
                />
            )}
        </div>
    );
};