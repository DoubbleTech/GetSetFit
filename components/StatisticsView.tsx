import React from 'react';
import { ArrowSmUpIcon, BriefcaseIcon, CalendarIcon, ChatAltIcon, EyeIcon, PhoneIcon, ReplyIcon, DotsVerticalIcon } from './Icons';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button className="text-gray-400 hover:text-gray-600">
            <DotsVerticalIcon />
        </button>
    </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; change?: string; changeType?: 'increase' | 'decrease'; action?: string; }> = ({ icon, title, value, change, changeType, action }) => (
    <Card>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            {change && changeType === 'increase' && (
                <span className="flex items-center text-green-500 mr-2">
                    <ArrowSmUpIcon /> {change}
                </span>
            )}
            <span className="text-gray-400">{action || (changeType === 'increase' ? 'than last month' : '')}</span>
        </div>
    </Card>
);

const ProfileStrengthChart = () => {
    const data = [
        { day: 'Sun', sent: 30, answered: 40, hired: 10, pending: 20 },
        { day: 'Mon', sent: 35, answered: 45, hired: 15, pending: 5 },
        { day: 'Tue', sent: 0, answered: 20, hired: 70, pending: 10 },
        { day: 'Wed', sent: 25, answered: 15, hired: 0, pending: 60 },
        { day: 'Thu', sent: 50, answered: 30, hired: 10, pending: 10 },
        { day: 'Fri', sent: 10, answered: 30, hired: 60, pending: 0 },
        { day: 'Sat', sent: 30, answered: 10, hired: 0, pending: 60 },
    ];
    const legend = [
        { label: 'Application Sent', color: 'bg-green-400', value: '30%' },
        { label: 'Application Answered', color: 'bg-orange-400', value: '46%' },
        { label: 'Hired', color: 'bg-blue-500', value: '14%' },
        { label: 'Pending', color: 'bg-gray-300', value: '10%' },
    ];

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader title="Profile Strength" />
            <div className="flex items-end">
                <div className="flex-1 flex justify-between items-end h-48 pr-8">
                    {data.map(d => (
                        <div key={d.day} className="w-8 flex flex-col-reverse items-center">
                            <span className="text-xs text-gray-500 mt-2">{d.day}</span>
                            <div className="w-full bg-gray-200 rounded-t-md overflow-hidden flex flex-col-reverse" style={{ height: '100%' }}>
                                <div className="bg-green-400" style={{ height: `${d.sent}%` }}></div>
                                <div className="bg-orange-400" style={{ height: `${d.answered}%` }}></div>
                                <div className="bg-blue-500" style={{ height: `${d.hired}%` }}></div>
                                <div className="bg-gray-300" style={{ height: `${d.pending}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-3">
                    <p className="font-semibold text-gray-600 text-sm">Legend</p>
                    {legend.map(item => (
                        <div key={item.label} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                            <div>
                                <p className="font-bold text-gray-800">{item.value}</p>
                                <p className="text-xs text-gray-500">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const VisitorGraph = () => (
    <Card className="col-span-1 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Visitor Graph</h2>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Show Details</span>
                <div className="w-10 h-5 bg-gray-200 rounded-full p-1 flex items-center cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
                <select className="border-gray-200 rounded-md text-sm">
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>
        </div>
        <div className="h-56 relative">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M0,120 L50,100 L100,110 L150,80 L200,90 L250,60 L300,80 L350,70 L400,90 L450,90" fill="none" stroke="#4F46E5" strokeWidth="2" />
                <path d="M0,180 L50,170 L100,175 L150,160 L200,165 L250,160 L300,162 L350,155 L400,160 L450,160" fill="none" stroke="#60A5FA" strokeWidth="2" />
            </svg>
        </div>
        <div className="flex items-center space-x-6 text-sm mt-2">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>View Profile</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>Hire</div>
        </div>
    </Card>
);

const CircularProgress: React.FC<{ percentage: number; color: string; size?: number; strokeWidth?: number }> = ({ percentage, color, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} className="text-gray-200" fill="transparent" stroke="currentColor" />
            <circle
                cx={size/2}
                cy={size/2}
                r={radius}
                strokeWidth={strokeWidth}
                className={color}
                fill="transparent"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

const NetworkChart = () => (
    <Card>
        <CardHeader title="Network" />
        <div className="flex items-center justify-around">
             <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-yellow-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-indigo-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="23, 100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">23%</span>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                    <div>
                        <p className="text-xs text-gray-500">Following</p>
                        <p className="font-bold text-gray-800">567 Companies</p>
                    </div>
                </div>
                 <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div>
                        <p className="text-xs text-gray-500">Followers</p>
                        <p className="font-bold text-gray-800">8,334 Person</p>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

const JobTrends = () => {
    const trends = [
        { name: 'Engineer', value: 66, vacancy: '5,050', color: 'text-indigo-600' },
        { name: 'Designer', value: 31, vacancy: '10,524', color: 'text-indigo-600' },
        { name: 'Manager', value: 75, vacancy: '621', color: 'text-indigo-600' },
        { name: 'Programmer', value: 62, vacancy: '9,662', color: 'text-indigo-600' },
    ];
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader title="Job Trends" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {trends.map(trend => (
                    <div key={trend.name} className="flex flex-col items-center">
                        <div className="relative">
                            <CircularProgress percentage={trend.value} color={trend.color} />
                            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">{trend.value}%</span>
                        </div>
                        <p className="font-semibold text-gray-800 mt-3">{trend.name}</p>
                        <p className="text-xs text-gray-500">{trend.vacancy} Vacancy</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};


export const StatisticsView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-3 xl:col-span-4">
                <ProfileStrengthChart />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:col-span-4 lg:col-span-3 gap-6">
                <StatCard icon={<EyeIcon />} title="Profile Viewed" value="456k" change="+24%" changeType="increase" />
                <StatCard icon={<ChatAltIcon />} title="Unread Messages" value="28" action="Go to Message" />
                <StatCard icon={<BriefcaseIcon />} title="Application Sent" value="651" />
                <StatCard icon={<ReplyIcon />} title="App. Answered" value="24" />
                <StatCard icon={<CalendarIcon />} title="Interviewed" value="261" />
                <StatCard icon={<PhoneIcon />} title="Hired" value="69" />
            </div>
            <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <VisitorGraph />
                <NetworkChart />
                <JobTrends />
            </div>
        </div>
    );
};
