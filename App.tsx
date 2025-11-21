
import React, { useState, useEffect } from 'react';
import { Sidebar, Page } from './components/Sidebar';
import { Header } from './components/Header';
import { ApplicationsView } from './components/ApplicationsView';
import { StatisticsView } from './components/StatisticsView';
import { IntegrationView } from './components/IntegrationView';
import { LoginView } from './components/LoginView';
import { ResetPasswordView } from './components/ResetPasswordView';
import { JobsView } from './components/JobsView';
import { DashboardView } from './components/DashboardView';
import { MOCK_JOBS, MOCK_PORTALS } from './constants';
import type { Job, JobPortal } from './types';
import { BriefcaseIcon } from './components/Icons';


type AuthState = 'unauthenticated' | 'requiresPasswordReset' | 'authenticated';

const Placeholder = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600">This is a placeholder for the {title} page. Functionality for this view is not yet implemented.</p>
      <div className="mt-6 space-y-4">
        <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

interface MainLayoutProps {
    onLogout: () => void;
    jobs: Job[];
    addJob: (newJob: Omit<Job, 'id'>) => void;
    updateJob: (updatedJob: Job) => void;
    toggleFavorite: (id: number) => void;
    portals: JobPortal[];
    togglePortalConnection: (name: string) => void;
    addPortal: (name: string, email?: string) => void;
    updatePortal: (portal: JobPortal) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout, jobs, addJob, updateJob, toggleFavorite, portals, togglePortalConnection, addPortal, updatePortal }) => {
    const [activePage, setActivePage] = useState<Page>('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const renderContent = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardView portals={portals} togglePortalConnection={togglePortalConnection} addPortal={addPortal} />;
            case 'Jobs':
                return <JobsView jobs={jobs} addJob={addJob} updateJob={updateJob} toggleFavorite={toggleFavorite} portals={portals} />;
            case 'Applications':
                return <ApplicationsView jobs={jobs} />;
            case 'Integration':
                return <IntegrationView portals={portals} togglePortalConnection={togglePortalConnection} addPortal={addPortal} updatePortal={updatePortal} />;
            case 'Message':
            case 'News':
                return <Placeholder title={activePage} />;
            default:
                return <DashboardView portals={portals} togglePortalConnection={togglePortalConnection} addPortal={addPortal} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F9FAFB] text-gray-800">
            <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle={activePage} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} onLogout={onLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

const App: React.FC = () => {
    const [authState, setAuthState] = useState<AuthState>('unauthenticated');
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [portals, setPortals] = useState<JobPortal[]>(MOCK_PORTALS.map(p => ({
        ...p,
        email: p.isConnected ? 'recruiter@company.com' : '',
        websiteUrl: p.isConnected ? `https://www.${p.name.toLowerCase()}.com/company-profile` : '',
        autoPost: true
    })));

    // Simulate real-time data updates for connected portals
    useEffect(() => {
        const interval = setInterval(() => {
            setPortals(prevPortals => prevPortals.map(portal => {
                if (portal.isConnected) {
                    // Randomly increment views and occasionally applications
                    const newViews = portal.views + Math.floor(Math.random() * 10);
                    const newApplications = portal.applications + (Math.random() > 0.8 ? 1 : 0);
                    return { ...portal, views: newViews, applications: newApplications };
                }
                return portal;
            }));
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleLogin = (password: string) => {
        if (password === 'demo123') {
            setAuthState('requiresPasswordReset');
        } else if(password) {
            setAuthState('authenticated');
        }
    };
    
    const handlePasswordReset = () => {
        setAuthState('authenticated');
    };

    const handleLogout = () => {
        setAuthState('unauthenticated');
    };

    const addJob = (newJobData: Omit<Job, 'id'>) => {
        // Auto-generate mock links for connected portals if the status is 'Open'
        let postedLinks: { portal: string; url: string }[] = [];
        if (newJobData.status === 'Open') {
            postedLinks = portals
                .filter(p => p.isConnected && p.autoPost !== false)
                .map(p => ({
                    portal: p.name,
                    url: `https://www.${p.name.toLowerCase().replace(/\s/g, '')}.com/jobs/view/${Math.floor(Math.random() * 100000)}`
                }));
        }

        const newJob: Job = {
            id: Date.now(),
            ...newJobData,
            postedLinks
        };
        setJobs(prevJobs => [newJob, ...prevJobs]);
    };

    const updateJob = (updatedJob: Job) => {
        setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
    };

    const toggleFavorite = (id: number) => {
        setJobs(prevJobs => prevJobs.map(job => job.id === id ? { ...job, isFavorite: !job.isFavorite } : job));
    };

    const togglePortalConnection = (name: string) => {
        setPortals(prevPortals => prevPortals.map(p => p.name === name ? { 
            ...p, 
            isConnected: !p.isConnected,
            // If connecting, add default mock data if missing
            email: !p.isConnected && !p.email ? 'recruiter@company.com' : p.email,
            websiteUrl: !p.isConnected && !p.websiteUrl ? `https://www.${p.name.toLowerCase()}.com` : p.websiteUrl
        } : p));
    };

    const addPortal = (name: string, email?: string) => {
        const newPortal: JobPortal = {
            name,
            icon: <BriefcaseIcon />, // Default icon for new portals
            isConnected: !!email, // If email is provided, assume connected via Add Modal
            views: 0,
            applications: 0,
            color: 'bg-gray-500', 
            email: email || '',
            websiteUrl: '',
            autoPost: true
        };
        setPortals(prev => [...prev, newPortal]);
    };

    const updatePortal = (updatedPortal: JobPortal) => {
        setPortals(prev => prev.map(p => p.name === updatedPortal.name ? updatedPortal : p));
    };

    switch (authState) {
        case 'unauthenticated':
            return <LoginView onLogin={handleLogin} />;
        case 'requiresPasswordReset':
            return <ResetPasswordView onPasswordReset={handlePasswordReset} />;
        case 'authenticated':
            return (
                <MainLayout 
                    onLogout={handleLogout} 
                    jobs={jobs} 
                    addJob={addJob} 
                    updateJob={updateJob}
                    toggleFavorite={toggleFavorite}
                    portals={portals}
                    togglePortalConnection={togglePortalConnection}
                    addPortal={addPortal}
                    updatePortal={updatePortal}
                />
            );
        default:
             return <LoginView onLogin={handleLogin} />;
    }
};

export default App;
