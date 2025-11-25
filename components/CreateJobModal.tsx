
import React, { useState, useRef, useEffect } from 'react';
import { XIcon, DotsVerticalIcon } from './Icons';
import { Job } from '../types';
import { generateJobDescription } from '../services/geminiService';

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jobData: any, action: 'draft' | 'post') => void;
    jobToEdit?: Job | null;
}

const initialFormState = {
    title: '',
    experience: '',
    location: '',
    description: '',
    ageGroup: '',
    additionalMessage: '',
    email: '',
    lastDate: '', // Maps to closingDate
    gender: 'Any',
    salaryAndPerks: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
};

const FormInput: React.FC<{ id: string, label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = 
({ id, label, type = 'text', value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

const FormTextarea: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number }> = 
({ id, label, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
            id={id}
            name={id}
            rows={rows}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSubmit, jobToEdit }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (jobToEdit) {
            setFormData({
                title: jobToEdit.title || '',
                experience: jobToEdit.experience || '',
                location: jobToEdit.location || '',
                description: jobToEdit.description || '',
                ageGroup: jobToEdit.ageGroup || '',
                additionalMessage: jobToEdit.additionalMessage || '',
                email: jobToEdit.email || '',
                lastDate: jobToEdit.closingDate || '',
                gender: jobToEdit.gender || 'Any',
                salaryAndPerks: jobToEdit.salaryAndPerks || '',
                mediaUrl: jobToEdit.mediaUrl || '',
                mediaType: jobToEdit.mediaType || 'image',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [jobToEdit, isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ 
                    ...prev, 
                    mediaUrl: reader.result as string, 
                    mediaType: file.type.startsWith('video') ? 'video' : 'image' 
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAiGenerate = async () => {
        if (!formData.title || !formData.experience || !formData.location) {
            alert("Please fill in Job Title, Experience, and Location to use AI generation.");
            return;
        }
        setIsGenerating(true);
        try {
            const description = await generateJobDescription(formData.title, formData.experience, formData.location);
            setFormData(prev => ({ ...prev, description }));
        } catch (error) {
            alert("Failed to generate description. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (action: 'draft' | 'post') => {
        onSubmit(formData, action);
        setFormData(initialFormState); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{jobToEdit ? 'Edit Job' : 'Create a New Job Posting'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="title" label="Job Position Title" value={formData.title} onChange={handleChange} />
                        <FormInput id="experience" label="Experience Required" value={formData.experience} onChange={handleChange} />
                    </div>
                    <FormInput id="location" label="Country and City" value={formData.location} onChange={handleChange} />
                    
                    {/* Description with AI Button */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                            <button 
                                type="button" 
                                onClick={handleAiGenerate} 
                                disabled={isGenerating}
                                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 flex items-center transition-colors disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Writing...
                                    </>
                                ) : '✨ Auto-Write with AI'}
                            </button>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    
                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Media (Image/Video)</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Choose File
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*,video/*" 
                                onChange={handleFileChange} 
                            />
                            {formData.mediaUrl && (
                                <div className="h-12 w-12 rounded overflow-hidden border border-gray-200">
                                    {formData.mediaType === 'video' ? (
                                        <video src={formData.mediaUrl} className="h-full w-full object-cover" />
                                    ) : (
                                        <img src={formData.mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                                    )}
                                </div>
                            )}
                             {formData.mediaUrl && <span className="text-xs text-green-600">File selected</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="ageGroup" label="Age Group" value={formData.ageGroup} onChange={handleChange} />
                         <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender Preferred</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option>Any</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                    </div>
                    <FormTextarea id="additionalMessage" label="Additional Message" value={formData.additionalMessage} onChange={handleChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="email" label="Email to send resume on" type="email" value={formData.email} onChange={handleChange} />
                        <FormInput id="lastDate" label="Closing Date" type="date" value={formData.lastDate} onChange={handleChange} />
                    </div>
                    <FormTextarea id="salaryAndPerks" label="Salary, Perks and Benefits" value={formData.salaryAndPerks} onChange={handleChange} />
                
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end items-center space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-semibold">
                        Cancel
                    </button>
                    <div className="flex rounded-md shadow-sm">
                        <button
                            type="button"
                            onClick={() => handleSubmit('draft')}
                            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-sm"
                        >
                            {jobToEdit ? 'Update as Draft' : 'Save as Draft'}
                        </button>
                        <div className="relative -ml-px block" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-indigo-600 text-white hover:bg-indigo-700"
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen}
                            >
                                <span className="sr-only">Open options</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="origin-top-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleSubmit('post');
                                                setDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                        >
                                            {jobToEdit ? 'Update and Post' : 'Save and Post Job'}
                                        </button>
                                         <p className="px-4 py-2 text-xs text-gray-500">
                                           This will post the job to all connected portals.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
