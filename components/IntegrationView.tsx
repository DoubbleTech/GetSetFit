
import React, { useState, useEffect, useRef } from 'react';
import { JobPortal } from '../types';
import { PlusIcon, XIcon, CheckCircleIcon, LinkedInIcon, CogIcon } from './Icons';
import { verifyCompanyIntegration } from '../services/geminiService';

interface IntegrationViewProps {
    portals: JobPortal[];
    togglePortalConnection: (portalName: string) => void;
    addPortal: (name: string, email?: string) => void;
    updatePortal: (portal: JobPortal) => void;
}

const SUGGESTED_PORTALS = [
    'Rozee.pk', 
    'LinkedIn', 
    'Indeed', 
    'Mustakbil', 
    'BrightSpyre', 
    'Bamboo HR', 
    'Glassdoor', 
    'Guru', 
    'Flexjobs', 
    'Bayt'
];

// Direct Connection Log Component
const ConnectionLog: React.FC<{ logs: string[], isSuccess: boolean, isError?: boolean }> = ({ logs, isSuccess, isError }) => {
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, isSuccess, isError]);

    return (
        <div className="bg-gray-900 rounded-md p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto border border-gray-700 shadow-inner">
            {logs.map((log, index) => (
                <div key={index} className={`mb-1 animate-fade-in ${log.includes('FAILED') || log.includes('Error') ? 'text-red-400' : ''}`}>
                    <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                </div>
            ))}
            {isSuccess && (
                 <div className="mt-2 text-green-300 font-bold border-t border-gray-700 pt-2">
                    SUCCESS: Secure connection established.
                </div>
            )}
            {isError && (
                 <div className="mt-2 text-red-400 font-bold border-t border-gray-700 pt-2">
                    ERROR: Authentication failed. Invalid credentials provided.
                </div>
            )}
            <div ref={endRef} />
        </div>
    );
};

const PortalDetailsModal: React.FC<{ 
    portal: JobPortal, 
    onClose: () => void, 
    onUpdate: (portal: JobPortal) => void,
    onToggleConnection: () => void 
}> = ({ portal, onClose, onUpdate, onToggleConnection }) => {
    const [formData, setFormData] = useState({ ...portal });
    const [viewState, setViewState] = useState<'details' | 'connect'>('details');
    
    // Connection State
    const [creds, setCreds] = useState({ username: '', password: '', apiKey: '' });
    const [isConnecting, setIsConnecting] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [connectionSuccess, setConnectionSuccess] = useState(false);
    const [connectionFailed, setConnectionFailed] = useState(false);

    // Testing State
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        onUpdate(formData);
        onClose();
    };

    const simulateConnection = async () => {
        setIsConnecting(true);
        setLogs(['Initializing handshake...']);
        setConnectionSuccess(false);
        setConnectionFailed(false);

        // Mock Validation: Fail if password is short or contains "fail"/"error"
        const shouldFail = creds.password.length < 6 || creds.password.toLowerCase().includes('fail') || creds.password.toLowerCase().includes('error');

        const steps = [
            `Resolving ${portal.name.toLowerCase().replace(/\s/g, '')}.com...`,
            `Sending authentication packet...`,
            `Verifying credentials for ${creds.username || 'User'}...`,
        ];

        for (const step of steps) {
            await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
            setLogs(prev => [...prev, `> ${step}`]);
        }
        
        if (shouldFail) {
            setLogs(prev => [...prev, `> Verifying credentials... FAILED (401 Unauthorized)`]);
            setConnectionFailed(true);
            setIsConnecting(false);
            return;
        }

        const successSteps = [
            `Requesting 'jobs.post' scope...`,
            `Requesting 'applicants.read' scope...`,
            `Token received: ********************`,
            `Verifying write access...`
        ];

        for (const step of successSteps) {
            await new Promise(r => setTimeout(r, 400));
            setLogs(prev => [...prev, `> ${step}`]);
        }
        
        setLogs(prev => [...prev, `> Integration verified.`]);
        setConnectionSuccess(true);
        
        setTimeout(() => {
            setIsConnecting(false);
            onToggleConnection();
            if (!formData.email) onUpdate({ ...formData, email: creds.username || 'recruiter@company.com', isConnected: true });
            onClose();
        }, 1500);
    };

    const handleConnectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        simulateConnection();
    };

    const handleTestConnection = () => {
        setTestStatus('testing');
        setTimeout(() => {
            setTestStatus('success');
            setTimeout(() => setTestStatus('idle'), 3000);
        }, 1500);
    };

    const handleRetry = () => {
        setConnectionFailed(false);
        setLogs([]);
        setCreds(prev => ({ ...prev, password: '' }));
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className="text-indigo-600 w-8 h-8">{portal.icon}</div>
                         <h2 className="text-xl font-bold text-gray-800">{portal.name} {viewState === 'connect' ? 'Setup' : 'Details'}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>
                
                {viewState === 'connect' ? (
                    <div className="p-6 space-y-4">
                        {!isConnecting && !connectionSuccess && !connectionFailed ? (
                             <form onSubmit={handleConnectSubmit} className="space-y-4">
                                <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
                                    Enter your credentials to establish a direct connection with {portal.name}.
                                    <br/><span className="text-xs text-blue-600 opacity-75">(Use password 'fail' to test error handling)</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email / Username</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={creds.username}
                                        onChange={e => setCreds({...creds, username: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password / API Key</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={creds.password}
                                        onChange={e => setCreds({...creds, password: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setViewState('details')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Authenticate</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                    {isConnecting ? 'Establishing Connection...' : connectionSuccess ? 'Connection Established' : 'Connection Failed'}
                                </div>
                                <ConnectionLog logs={logs} isSuccess={connectionSuccess} isError={connectionFailed} />
                                {connectionFailed && (
                                    <button 
                                        onClick={handleRetry}
                                        className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className={`p-4 rounded-md flex justify-between items-center ${portal.isConnected ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${portal.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className={`font-semibold ${portal.isConnected ? 'text-green-800' : 'text-gray-600'}`}>
                                    {portal.isConnected ? 'Connected' : 'Not Connected'}
                                </span>
                            </div>
                            {portal.isConnected && (
                                 <button onClick={handleTestConnection} disabled={testStatus !== 'idle'} className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1 rounded hover:bg-green-50 transition-colors flex items-center gap-1">
                                     {testStatus === 'testing' ? 'Verifying...' : testStatus === 'success' ? 'Verified ✓' : 'Test Connection'}
                                 </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Portal Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Recruiter Email</label>
                                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Enter email used for login" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Profile Link</label>
                                <input type="url" name="websiteUrl" value={formData.websiteUrl || ''} onChange={handleChange} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            
                             <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center">
                                    <input
                                        id="autoPost"
                                        name="autoPost"
                                        type="checkbox"
                                        checked={formData.autoPost !== false} 
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="autoPost" className="ml-2 block text-sm text-gray-900">
                                        Auto-post new jobs to this portal
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {viewState === 'details' && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center rounded-b-lg">
                         {portal.isConnected ? <button onClick={() => {if(confirm('Disconnect?')) {onToggleConnection(); onClose();}}} className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2">Disconnect Portal</button> : <div></div>}
                         <div className="flex gap-3">
                            <button onClick={handleSave} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Save Changes</button>
                            {!portal.isConnected && (
                                <button onClick={() => setViewState('connect')} className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none flex items-center">
                                    Connect Account
                                </button>
                            )}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddPortalModal: React.FC<{ onClose: () => void, onAdd: (name: string, email?: string) => void }> = ({ onClose, onAdd }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [query, setQuery] = useState('');
    const [selectedPortal, setSelectedPortal] = useState('');
    const [creds, setCreds] = useState({ email: '', password: '' });
    const [isConnecting, setIsConnecting] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [connectionSuccess, setConnectionSuccess] = useState(false);
    const [connectionFailed, setConnectionFailed] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    const filteredSuggestions = SUGGESTED_PORTALS.filter(p => 
        p.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelectPortal = (name: string) => {
        setSelectedPortal(name);
        setQuery(name);
        setStep(2);
    };

    const handleCredentialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!creds.email || !creds.password) return;

        setIsConnecting(true);
        setLogs(['Starting integration sequence...']);
        setConnectionSuccess(false);
        setConnectionFailed(false);

        // Mock Validation: Fail if password is short or contains "fail"/"error"
        const shouldFail = creds.password.length < 6 || creds.password.toLowerCase().includes('fail') || creds.password.toLowerCase().includes('error');

        const steps = [
            `Ping ${selectedPortal.toLowerCase().replace(/\s/g, '')}.com... OK (45ms)`,
            `Validating user ${creds.email}...`
        ];

        for (const step of steps) {
             await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
             setLogs(prev => [...prev, `> ${step}`]);
        }

        if (shouldFail) {
             setLogs(prev => [...prev, `> Credentials Rejected: Invalid password or API key.`]);
             setConnectionFailed(true);
             setIsConnecting(false);
             return;
        }

        const successSteps = [
            `Credentials accepted.`,
            `Retrieving organization ID...`,
            `Syncing job posting configurations...`
        ];
        
        for (const step of successSteps) {
             await new Promise(r => setTimeout(r, 500));
             setLogs(prev => [...prev, `> ${step}`]);
        }

        setLogs(prev => [...prev, `> ${selectedPortal} connected successfully.`]);
        setConnectionSuccess(true);
        
        setTimeout(() => {
            setIsConnecting(false);
            onAdd(selectedPortal, creds.email);
            onClose();
        }, 1500);
    };

    const handleRetry = () => {
        setConnectionFailed(false);
        setLogs([]);
        setCreds(prev => ({ ...prev, password: '' }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Handle click outside logic if needed
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h2 className="text-lg font-bold text-gray-800">
                        {step === 1 ? 'Add Integration' : `Connect to ${selectedPortal}`}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>
                
                <div className="p-6">
                    {step === 1 ? (
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Portal</label>
                            <input 
                                type="text" 
                                value={query} 
                                onChange={e => setQuery(e.target.value)} 
                                placeholder="Start typing (e.g., Rozee.pk, LinkedIn...)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                autoFocus
                            />
                            {query && filteredSuggestions.length > 0 && (
                                <ul ref={dropdownRef} className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {filteredSuggestions.map((portal) => (
                                        <li 
                                            key={portal}
                                            onClick={() => handleSelectPortal(portal)}
                                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 text-gray-900"
                                        >
                                            {portal}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {query && filteredSuggestions.length === 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Portal not in our suggested list?</p>
                                    <button 
                                        onClick={() => handleSelectPortal(query)}
                                        className="mt-2 text-indigo-600 font-medium hover:text-indigo-800 text-sm"
                                    >
                                        Add "{query}" manually
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        !isConnecting && !connectionSuccess && !connectionFailed ? (
                            <form onSubmit={handleCredentialSubmit} className="space-y-4">
                                <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-800">
                                    Enter your {selectedPortal} credentials to authorize AI Recruit to post jobs on your behalf.
                                    <br/><span className="text-xs text-blue-600 opacity-75">(Use password 'fail' to test error handling)</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email / Username</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={creds.email}
                                        onChange={e => setCreds({...creds, email: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={creds.password}
                                        onChange={e => setCreds({...creds, password: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 text-sm">Back</button>
                                    <button 
                                        type="submit" 
                                        className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                    >
                                        Connect & Save
                                    </button>
                                </div>
                            </form>
                        ) : (
                             <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                    {isConnecting ? 'Establishing Connection...' : connectionSuccess ? 'Connection Established' : 'Connection Failed'}
                                </div>
                                <ConnectionLog logs={logs} isSuccess={connectionSuccess} isError={connectionFailed} />
                                {connectionFailed && (
                                    <button 
                                        onClick={handleRetry}
                                        className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const LinkedInCompanyIntegration: React.FC = () => {
    const [companyPageUrl, setCompanyPageUrl] = useState('');
    const [isLinked, setIsLinked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<string>('');
    const [sources, setSources] = useState<any[]>([]);
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [testResult, setTestResult] = useState<'success' | null>(null);

    const handleLink = async () => {
        if (!companyPageUrl) return;
        
        setIsLoading(true);
        setVerificationResult('');
        setSources([]);
        
        try {
            const { text, groundingChunks } = await verifyCompanyIntegration(companyPageUrl);
            setVerificationResult(text);
            setSources(groundingChunks);
            
            if (text.toLowerCase().includes("verified")) {
                setIsLinked(true);
            }
        } catch (error) {
            setVerificationResult("Error connecting to AI service. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestPost = () => {
        setIsTestLoading(true);
        setTestResult(null);
        setTimeout(() => {
            setIsTestLoading(false);
            setTestResult('success');
        }, 2000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex items-center mb-4 space-x-2">
                <div className="text-blue-600"><LinkedInIcon /></div>
                <h2 className="text-xl font-bold text-gray-800">LinkedIn Company Page Integration</h2>
            </div>
            
            {!isLinked ? (
                <div className="space-y-4">
                    <p className="text-gray-600">Link your company page to post jobs directly and track analytics.</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={companyPageUrl}
                            onChange={(e) => setCompanyPageUrl(e.target.value)}
                            placeholder="https://www.linkedin.com/company/your-company"
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button 
                            onClick={handleLink}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold disabled:bg-blue-400 flex items-center whitespace-nowrap"
                        >
                             {isLoading ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                    Verifying...
                                </>
                            ) : 'Link Page'}
                        </button>
                    </div>
                    
                     {verificationResult && (
                        <div className={`p-4 rounded-md text-sm ${verificationResult.includes('Verified') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            <p className="font-semibold whitespace-pre-wrap">{verificationResult}</p>
                            {sources.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200/50">
                                    <p className="text-xs text-gray-500 mb-1">Verified via:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {sources.map((chunk, i) => (
                                            <li key={i}>
                                                <a href={chunk.web?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {chunk.web?.title || 'Source Link'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col space-y-2 p-4 bg-green-50 text-green-800 rounded-md">
                        <div className="flex items-center">
                            <CheckCircleIcon className="mr-2 flex-shrink-0" />
                            <span className="font-semibold">Company Page Linked Successfully</span>
                        </div>
                        <div className="text-sm ml-7">
                             <p>{verificationResult}</p>
                             <a href={companyPageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-1 inline-block">Visit Page</a>
                        </div>
                        <button onClick={() => setIsLinked(false)} className="ml-auto text-sm underline text-green-800 hover:text-green-900 font-semibold mt-2">Disconnect Page</button>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Integration Status</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <span className="text-xs text-gray-500">Status</span>
                                <p className="font-semibold text-green-600">Active & Monitoring</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <span className="text-xs text-gray-500">Last Sync</span>
                                <p className="font-semibold text-gray-700">Just now</p>
                            </div>
                        </div>
                        
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Actions</h4>
                        <div className="flex flex-wrap gap-3">
                             <button 
                                onClick={handleTestPost}
                                disabled={isTestLoading || testResult === 'success'}
                                className={`flex items-center px-4 py-2 rounded-md font-medium text-white transition-colors ${testResult === 'success' ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-900'}`}
                            >
                                {isTestLoading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                        Posting Test Job...
                                    </>
                                ) : testResult === 'success' ? (
                                    <>
                                        <CheckCircleIcon className="mr-2" />
                                        Test Job Posted
                                    </>
                                ) : (
                                    'Post Test Job'
                                )}
                            </button>
                        </div>
                        
                        {testResult === 'success' && (
                            <p className="mt-2 text-sm text-green-600">
                                Great! We've simulated posting a test job. In a live production environment with valid OAuth keys, this would appear on your LinkedIn feed.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const IntegrationView: React.FC<IntegrationViewProps> = ({ portals, togglePortalConnection, addPortal, updatePortal }) => {
    const [selectedPortal, setSelectedPortal] = useState<JobPortal | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Integrations</h1>
            <p className="text-gray-600 mb-6">Manage your connections with external job portals and recruitment platforms.</p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Connected Portals</h2>
                    <button onClick={() => setIsAddModalOpen(true)} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center">
                        <PlusIcon /> <span className="ml-1">Add Portal</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portals.map(portal => (
                        <div 
                            key={portal.name} 
                            onClick={() => setSelectedPortal(portal)}
                            className="cursor-pointer border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-lg hover:border-indigo-200 transition-all group bg-white"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="text-gray-600 w-8 h-8 flex justify-center items-center group-hover:text-indigo-600 transition-colors">{portal.icon}</div>
                                    <span className="font-bold text-gray-700">{portal.name}</span>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${portal.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {portal.isConnected 
                                        ? `Syncing active. ${portal.applications} applications received.` 
                                        : "Not connected. Click to configure."}
                                </p>
                                {portal.isConnected && portal.email && (
                                     <p className="text-xs text-gray-400 mt-1 truncate">{portal.email}</p>
                                )}
                                {portal.isConnected && portal.autoPost !== false && (
                                    <p className="text-xs text-green-600 mt-1 font-medium">Auto-Post Active</p>
                                )}
                            </div>
                            <button 
                                className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${
                                    portal.isConnected 
                                    ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                                    : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                                }`}
                            >
                                {portal.isConnected ? 'Manage' : 'Setup Integration'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <LinkedInCompanyIntegration />

            {selectedPortal && (
                <PortalDetailsModal 
                    portal={selectedPortal} 
                    onClose={() => setSelectedPortal(null)} 
                    onUpdate={updatePortal}
                    onToggleConnection={() => togglePortalConnection(selectedPortal.name)}
                />
            )}

            {isAddModalOpen && (
                <AddPortalModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onAdd={addPortal} 
                />
            )}
        </div>
    );
};
