
import React from 'react';
import { JobPortal } from '../types';

interface DashboardViewProps {
    portals: JobPortal[];
    togglePortalConnection: (portalName: string) => void;
    addPortal: (name: string) => void;
}

const PortalPerformanceChart: React.FC<{ portals: JobPortal[] }> = ({ portals }) => {
    const connectedPortals = portals.filter(p => p.isConnected);
    const maxApplications = Math.max(...connectedPortals.map(p => p.applications), 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Applications by Portal <span className="text-xs font-normal text-green-600 ml-2 animate-pulse">(Live)</span></h2>
            <div className="space-y-4">
                {connectedPortals.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No portals connected. Go to Integrations to connect.</p>
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

export const DashboardView: React.FC<DashboardViewProps> = ({ portals }) => {
    const connectedPortals = portals.filter(p => p.isConnected);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Summary Stats */}
                <div className="md:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {connectedPortals.map(portal => (
                         <StatCard key={`${portal.name}-apps`} title="Applications" value={portal.applications} portal={portal} />
                       ))}
                       {connectedPortals.map(portal => (
                         <StatCard key={`${portal.name}-views`} title="Post Views" value={portal.views} portal={portal} />
                       ))}
                       {connectedPortals.length === 0 && (
                           <div className="col-span-3 bg-blue-50 border border-blue-100 p-6 rounded-lg text-center">
                               <p className="text-blue-800 font-semibold">Connect a job portal to view real-time statistics.</p>
                           </div>
                       )}
                    </div>
                     <PortalPerformanceChart portals={portals} />
                </div>
            </div>
        </div>
    );
};
