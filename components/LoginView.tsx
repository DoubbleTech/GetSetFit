import React, { useState } from 'react';
import { FacebookIcon, TwitterIcon, LinkedInIcon } from './Icons';

interface LoginViewProps {
    onLogin: (password: string) => void;
}

const SignInForm: React.FC<{ onLogin: (password: string) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('');

    return (
        <>
            <h2 className="text-3xl font-bold">Welcome to Recruite Tree</h2>
            <p className="mt-2 text-violet-200">Sign in by entering information below</p>
            <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(password); }}>
                <div>
                    <label htmlFor="email-signin" className="text-sm font-bold text-violet-200">Email</label>
                    <input
                        id="email-signin"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white"
                    />
                </div>
                <div>
                    <label htmlFor="password-signin" className="text-sm font-bold text-violet-200">Password</label>
                    <input
                        id="password-signin"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-2 block w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-violet-400 bg-violet-500 border-transparent rounded focus:ring-violet-300" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-violet-200">Remember my preference</label>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-violet-600 bg-white hover:bg-violet-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </>
    );
};


export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-violet-900 text-gray-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-violet-700 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>
            <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl w-full mx-auto z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex">
                        {/* Left Panel */}
                        <div className="w-1/2 hidden lg:flex flex-col justify-between p-12 text-white relative">
                           <div>
                                <div className="flex items-center space-x-3">
                                    <img src="/media/logo.png" alt="Recruite Tree Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
                                    <h1 className="text-2xl font-bold">Recruite Tree</h1>
                                </div>
                                <h2 className="mt-12 text-3xl font-bold tracking-tight">Check the Status</h2>
                                <p className="mt-4 text-violet-200">
                                    Streamline your hiring process with our AI-powered recruitment hub. Analyze resumes, manage job postings, and find the best talent efficiently.
                                </p>
                                <div className="mt-6 flex space-x-4">
                                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><FacebookIcon /></a>
                                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><TwitterIcon /></a>
                                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><LinkedInIcon /></a>
                                </div>
                           </div>
                           <div className="mt-12 text-sm text-violet-300 flex items-center space-x-4">
                               <a href="#" className="hover:text-white">Privacy Policy</a>
                               <a href="#" className="hover:text-white">Contact</a>
                               <span>© 2025 Recruite Tree</span>
                           </div>
                           <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden opacity-50">
                                <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
                                    <path d="M-5.58,93.31 C150.31,180.33 349.20,-49.98 503.66,93.31 L500.00,150.00 L0.00,150.00 Z" style={{stroke: 'none', fill: 'rgba(124, 58, 237, 0.1)'}}></path>
                                    <path d="M-2.00,116.31 C150.31,130.33 282.02,100.02 505.66,120.31 L500.00,150.00 L0.00,150.00 Z" style={{stroke: 'none', fill: 'rgba(124, 58, 237, 0.2)'}}></path>
                                </svg>
                           </div>
                        </div>

                        {/* Right Panel */}
                        <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-violet-600/50 text-white relative">
                            <div className="relative z-10">
                               <SignInForm onLogin={onLogin} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};