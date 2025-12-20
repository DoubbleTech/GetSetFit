import React, { useState } from 'react';
import { CheckCircleIcon, PlusIcon, XIcon, ArrowSmUpIcon } from './Icons';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LOGO_URL = "https://img.icons8.com/fluency/96/tree-structure.png";

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
      <div className="w-8 h-8">{icon}</div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-violet-600 text-white text-2xl font-bold flex items-center justify-center mb-6 shadow-lg shadow-violet-200">
            {number}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const PricingCard: React.FC<{ title: string; price: string; features: string[]; isPopular?: boolean; onLoginClick: () => void }> = ({ title, price, features, isPopular, onLoginClick }) => (
    <div className={`relative p-8 rounded-2xl border ${isPopular ? 'border-violet-600 shadow-2xl scale-105 bg-white z-10' : 'border-gray-200 bg-white shadow-lg'} flex flex-col h-full`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
            </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-baseline mb-6">
            <span className="text-4xl font-extrabold text-gray-900">{price}</span>
            <span className="text-gray-500 ml-1">/month</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                </li>
            ))}
        </ul>
        <button 
            onClick={onLoginClick}
            className={`w-full py-3 rounded-lg font-bold transition-colors ${isPopular ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'}`}
        >
            Choose {title}
        </button>
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button 
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900">{question}</span>
                <span className={`ml-6 text-violet-600 transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                    <PlusIcon />
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600">{answer}</p>
            </div>
        </div>
    );
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <img src={LOGO_URL} alt="Recruite Tree Logo" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Recruite Tree</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Stories</a>
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
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-violet-600/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-800/50 border border-violet-700 text-violet-200 text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                New: AI-Powered Job Description Generator
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
              Hire Top Talent <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">10x Faster with AI</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-violet-100 mb-10 leading-relaxed">
              Automate resume screening, rank candidates with precision, and post to multiple job boards instantly. The command center for modern recruitment teams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button onClick={onLoginClick} className="px-8 py-4 bg-white text-violet-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Start Free Trial
              </button>
              <button onClick={onLoginClick} className="px-8 py-4 bg-transparent border-2 border-violet-400 text-white rounded-full font-bold text-lg hover:bg-violet-800/50 transition-all backdrop-blur-sm">
                Book a Demo
              </button>
            </div>
        </div>
      </section>

      {/* Product View Preview Section */}
      <section className="relative -mt-16 lg:-mt-24 pb-24 px-4 sm:px-6 lg:px-8 z-20">
          <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-2 sm:p-4 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img 
                        src="/view.png" 
                        alt="Recruite Tree Dashboard Preview" 
                        className="w-full h-auto object-cover shadow-inner"
                        onError={(e) => {
                            // Fallback if image isn't available yet or path is wrong
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="h-64 sm:h-[600px] flex items-center justify-center bg-gray-100 text-gray-400 font-medium">Preview Image Loading...</div>';
                        }}
                      />
                  </div>
              </div>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                      <div className="text-3xl font-bold text-violet-900">98%</div>
                      <div className="text-sm text-gray-500 font-medium">Ranking Accuracy</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-violet-900">10k+</div>
                      <div className="text-sm text-gray-500 font-medium">Daily Applications</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-violet-900">60%</div>
                      <div className="text-sm text-gray-500 font-medium">Time Saved</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-violet-900">5/5</div>
                      <div className="text-sm text-gray-500 font-medium">G2 Rating</div>
                  </div>
              </div>
          </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 transform -translate-y-1/2 hidden md:block z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
                <h2 className="text-violet-600 font-semibold tracking-wide uppercase mb-2">Workflow</h2>
                <h2 className="text-4xl font-bold text-gray-900">How Recruite Tree Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StepCard 
                    number="1" 
                    title="Connect Portals" 
                    description="Link LinkedIn, Indeed, and other job boards in one click. Centralize your inbox instantly." 
                />
                <StepCard 
                    number="2" 
                    title="AI Job Creation" 
                    description="Enter a job title and let our GenAI write a perfect, SEO-optimized job description." 
                />
                <StepCard 
                    number="3" 
                    title="Auto-Screening" 
                    description="As resumes roll in, our AI parses, ranks, and scores candidates based on relevance." 
                />
                <StepCard 
                    number="4" 
                    title="Hire & Onboard" 
                    description="Send AI-generated offer letters and move candidates to 'Hired' with a single click." 
                />
            </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-violet-600 font-semibold tracking-wide uppercase mb-2">Pricing</h2>
                <h2 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-600 mt-4">Start for free, upgrade as you grow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                <PricingCard 
                    title="Starter" 
                    price="$0" 
                    features={["1 Active Job", "LinkedIn Integration", "Basic AI Ranking", "Email Support"]}
                    onLoginClick={onLoginClick}
                />
                <PricingCard 
                    title="Professional" 
                    price="$49" 
                    isPopular={true}
                    features={["10 Active Jobs", "All Portals (Indeed, etc.)", "Advanced AI Insights", "One-Click Offers", "Priority Support"]}
                    onLoginClick={onLoginClick}
                />
                <PricingCard 
                    title="Enterprise" 
                    price="$199" 
                    features={["Unlimited Jobs", "Custom API Access", "Dedicated Account Manager", "SSO & Advanced Security", "Team Training"]}
                    onLoginClick={onLoginClick}
                />
            </div>
          </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-2">
                  <FaqItem 
                      question="Is Recruite Tree compatible with my current ATS?" 
                      answer="Recruite Tree is designed to replace or work alongside standard ATS platforms. You can export data easily via CSV or API." 
                  />
                   <FaqItem 
                      question="Which job boards are supported?" 
                      answer="We currently support direct integrations with LinkedIn, Indeed, Glassdoor, ZipRecruiter, and Google Jobs." 
                  />
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-900 py-24 relative overflow-hidden text-white">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your hiring?</h2>
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
              <img src={LOGO_URL} alt="Recruite Tree Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-white">Recruite Tree</span>
            </div>
            <p className="text-sm text-gray-400">Making recruitment intelligent, efficient, and human.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; 2025 Recruite Tree. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};