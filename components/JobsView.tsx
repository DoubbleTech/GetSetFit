
import React, { useState, useMemo } from 'react';
import type { Job } from '../types';
import { SearchIcon, ViewGridIcon, ViewListIcon, PlusIcon } from './Icons';
import { CreateJobModal } from './CreateJobModal';

const HeartIcon = ({ filled, onClick }: { filled?: boolean; onClick: (e: React.MouseEvent) => void }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 cursor-pointer transition-colors ${filled ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const JobCard: React.FC<{ job: Job; onEdit: (job: Job) => void; onToggleFavorite: (id: number) => void }> = ({ job, onEdit, onToggleFavorite }) => {
    const statusStyles = {
        Open: 'bg-green-100 text-green-800',
        Closed: 'bg-red-100 text-red-800',
        Draft: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col relative">
            <div className="absolute top-4 right-4">
                <HeartIcon filled={job.isFavorite} onClick={(e) => { e.stopPropagation(); onToggleFavorite(job.id); }} />
            </div>
            <div className="flex-grow pr-8">
                <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{job.location} • {job.type}</p>
                 {job.closingDate && <p className="text-xs text-red-500 mt-2 font-medium">Closes: {job.closingDate}</p>}
                <div className="mt-4 flex justify-between text-center">
                    <div>
                        <p className="text-xl font-bold text-indigo-600">{job.applications}</p>
                        <p className="text-xs text-gray-500">Applications</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-yellow-500">{job.shortlisted}</p>
                        <p className="text-xs text-gray-500">Shortlisted</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-green-500">{job.hired}</p>
                        <p className="text-xs text-gray-500">Hired</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[job.status]}`}>{job.status}</span>
                <button onClick={() => onEdit(job)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Edit Details</button>
            </div>
        </div>
    );
};

const JobListItem: React.FC<{ job: Job; onEdit: (job: Job) => void; onToggleFavorite: (id: number) => void }> = ({ job, onEdit, onToggleFavorite }) => {
    const statusStyles = {
        Open: 'bg-green-100 text-green-800',
        Closed: 'bg-red-100 text-red-800',
        Draft: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <tr className="bg-white hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                 <HeartIcon filled={job.isFavorite} onClick={() => onToggleFavorite(job.id)} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {job.title}
                {job.closingDate && <div className="text-xs text-red-500 mt-1">Closes: {job.closingDate}</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applications}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.shortlisted}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.hired}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[job.status]}`}>{job.status}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(job)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
            </td>
        </tr>
    );
};

interface JobsViewProps {
    jobs: Job[];
    addJob: (newJob: Omit<Job, 'id'>) => void;
    updateJob: (updatedJob: Job) => void;
    toggleFavorite: (id: number) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ jobs, addJob, updateJob, toggleFavorite }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Closed' | 'Draft'>('All');
    const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

    const filteredJobs = useMemo(() =>
        jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'All' || job.status === filterStatus;
            return matchesSearch && matchesFilter;
        }), [searchQuery, jobs, filterStatus]
    );

    const handleCreateOrUpdateJob = (jobData: any, action: 'draft' | 'post') => {
        const newJobData: any = {
            title: jobData.title,
            description: jobData.description,
            location: jobData.location,
            type: 'Full-time', 
            status: action === 'draft' ? 'Draft' : 'Open',
            closingDate: jobData.lastDate,
            experience: jobData.experience,
            ageGroup: jobData.ageGroup,
            additionalMessage: jobData.additionalMessage,
            email: jobData.email,
            gender: jobData.gender,
            salaryAndPerks: jobData.salaryAndPerks,
            mediaUrl: jobData.mediaUrl,
            mediaType: jobData.mediaType,
        };

        if (jobToEdit) {
            const updatedJob: Job = {
                ...jobToEdit,
                ...newJobData,
            };
            updateJob(updatedJob);
        } else {
            addJob({
                ...newJobData,
                applications: 0,
                shortlisted: 0,
                hired: 0,
                isFavorite: false,
            });
        }
        
        if (action === 'post') {
            console.log(`Simulating: Posting "${newJobData.title}" to connected job portals...`);
        }

        setIsModalOpen(false);
        setJobToEdit(null);
    };

    const openEditModal = (job: Job) => {
        setJobToEdit(job);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setJobToEdit(null);
        setIsModalOpen(true);
    };

    return (
        <>
            <div>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Jobs</h1>
                        <p className="text-gray-600 mt-1">Manage your organization's job postings.</p>
                    </div>
                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors">
                        <PlusIcon />
                        Create New
                    </button>
                </div>

                <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2 order-2 md:order-1">
                        {['All', 'Open', 'Closed', 'Draft'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    filterStatus === status
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow flex items-center gap-4 order-1 md:order-2 w-full md:w-auto">
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <ViewGridIcon />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <ViewListIcon />
                            </button>
                        </div>
                    </div>
                </div>
                
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredJobs.map(job => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                onEdit={openEditModal} 
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="shadow border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 w-10"></th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortlisted</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredJobs.map(job => (
                                        <JobListItem 
                                            key={job.id} 
                                            job={job} 
                                            onEdit={openEditModal} 
                                            onToggleFavorite={toggleFavorite}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {filteredJobs.length === 0 && <p className="text-center text-gray-500 mt-8">No jobs found matching your search.</p>}
            </div>
            
            <CreateJobModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setJobToEdit(null); }}
                onSubmit={handleCreateOrUpdateJob}
                jobToEdit={jobToEdit}
            />
        </>
    );
};
