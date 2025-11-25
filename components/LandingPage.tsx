
import React from 'react';
import { CheckCircleIcon, ArrowSmUpIcon } from './Icons';

interface LandingPageProps {
  onLoginClick: () => void;
}

const StarRating = () => (
  <div className="flex space-x-1 text-yellow-400">
    {[1, 2, 3, 4, 5].map((_, i) => (
      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="bg-violet-600 p-2 rounded-lg">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">AI Recruit</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={onLoginClick} className="text-gray-900 font-semibold hover:text-violet-600 transition-colors">
                Log In
              </button>
              <button 
                onClick={onLoginClick}
                className="bg-violet-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-violet-900">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-violet-600/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-3xl opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-800/50 border border-violet-700 text-violet-200 text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                New: AI-Powered Job Description Generator
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
              Hire Top Talent <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">10x Faster with AI</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-violet-100 mb-10">
              Automate resume screening, rank candidates with precision, and post to multiple job boards instantly. The future of recruitment is here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button onClick={onLoginClick} className="px-8 py-4 bg-white text-violet-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Start Free Trial
              </button>
              <button onClick={onLoginClick} className="px-8 py-4 bg-transparent border-2 border-violet-400 text-white rounded-full font-bold text-lg hover:bg-violet-800/50 transition-all backdrop-blur-sm">
                Book a Demo
              </button>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="relative mx-auto max-w-5xl">
                <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-2 transform rotate-x-12 perspective-1000">
                    <div className="bg-white rounded-lg overflow-hidden shadow-inner">
                        {/* Fake Browser Header */}
                        <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        {/* Simplified UI Representation */}
                        <div className="flex h-[400px] md:h-[600px] bg-slate-50">
                            {/* Sidebar */}
                            <div className="w-16 md:w-64 bg-violet-900 p-4 hidden md:block">
                                <div className="h-8 w-32 bg-white/20 rounded mb-8"></div>
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-white/10 rounded"></div>
                                    <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                                    <div className="h-4 w-5/6 bg-white/10 rounded"></div>
                                </div>
                            </div>
                            {/* Main Content */}
                            <div className="flex-1 p-6 md:p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                                    <div className="h-10 w-32 bg-violet-600 rounded"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="h-32 bg-white rounded-lg shadow border border-gray-100 p-4">
                                         <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                                         <div className="h-8 w-16 bg-violet-100 rounded"></div>
                                    </div>
                                    <div className="h-32 bg-white rounded-lg shadow border border-gray-100 p-4">
                                        <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-8 w-16 bg-green-100 rounded"></div>
                                    </div>
                                    <div className="h-32 bg-white rounded-lg shadow border border-gray-100 p-4">
                                        <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-8 w-16 bg-blue-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow border border-gray-100 h-64 p-4">
                                     <div className="flex space-x-4 mb-4 border-b pb-2">
                                         <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                         <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                         <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                     </div>
                                     <div className="space-y-3">
                                         <div className="h-12 w-full bg-gray-50 rounded flex items-center px-4">
                                             <div className="h-8 w-8 rounded-full bg-gray-300 mr-4"></div>
                                             <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                                         </div>
                                         <div className="h-12 w-full bg-gray-50 rounded flex items-center px-4">
                                             <div className="h-8 w-8 rounded-full bg-gray-300 mr-4"></div>
                                             <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                                         </div>
                                         <div className="h-12 w-full bg-gray-50 rounded flex items-center px-4">
                                             <div className="h-8 w-8 rounded-full bg-gray-300 mr-4"></div>
                                             <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-6">Trusted by fast-growing teams</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Simple text placeholders for logos */}
                  <span className="text-2xl font-bold text-gray-800">Acme Corp</span>
                  <span className="text-2xl font-bold text-gray-800 italic">GlobalTech</span>
                  <span className="text-2xl font-bold text-gray-800">Nebula</span>
                  <span className="text-2xl font-bold text-gray-800">FoxRun</span>
                  <span className="text-2xl font-bold text-gray-800">Circle</span>
              </div>
          </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-violet-600 font-semibold tracking-wide uppercase mb-2">Powerful Features</h2>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to hire efficiently</h2>
            <p className="text-xl text-gray-600">
              Replace your messy spreadsheets and scattered emails with one centralized, AI-powered command center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI Resume Screening" 
              description="Instantly analyze thousands of resumes. Our AI ranks candidates based on job descriptions, saving you 40+ hours per hire."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <FeatureCard 
              title="Multi-Portal Sync" 
              description="Post a job once, and it appears on LinkedIn, Indeed, Glassdoor, and more. Manage all applications in one unified inbox."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
            />
            <FeatureCard 
              title="Smart Analytics" 
              description="Visualize your hiring pipeline. Track time-to-hire, source effectiveness, and candidate demographics with real-time charts."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
             <FeatureCard 
              title="AI Job Description Writer" 
              description="Struggling to write the perfect job post? Let our GenAI create professional, SEO-optimized descriptions in seconds."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
            />
             <FeatureCard 
              title="One-Click Offers" 
              description="Generate personalized offer letters instantly. Streamline the final mile of recruitment and secure top talent faster."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
             <FeatureCard 
              title="Team Collaboration" 
              description="Share candidate profiles, leave notes, and tag team members. Make hiring a collaborative team sport."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your hiring?</h2>
          <p className="text-xl text-violet-200 mb-10">Join 5,000+ recruiters who are finding better candidates, faster.</p>
          <button 
            onClick={onLoginClick}
            className="bg-white text-violet-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-2xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center space-x-2 mb-4">
              <div className="bg-violet-600 p-1.5 rounded-lg">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <span className="text-xl font-bold text-white">AI Recruit</span>
            </div>
            <p className="text-sm text-gray-400">Making recruitment intelligent, efficient, and human.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-violet-400">Features</a></li>
              <li><a href="#" className="hover:text-violet-400">Pricing</a></li>
              <li><a href="#" className="hover:text-violet-400">Integrations</a></li>
              <li><a href="#" className="hover:text-violet-400">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-violet-400">Blog</a></li>
              <li><a href="#" className="hover:text-violet-400">Community</a></li>
              <li><a href="#" className="hover:text-violet-400">Help Center</a></li>
              <li><a href="#" className="hover:text-violet-400">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-violet-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-violet-400">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; 2025 AI Recruit. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
