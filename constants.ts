import React from 'react';
import type { Job, Candidate, JobPortal } from './types';
import { LinkedInIcon, BriefcaseIcon } from './components/Icons';

// A simple Icon for Indeed as it wasn't in the original set
// FIX: Rewrote component using React.createElement to avoid JSX in a .ts file.
const IndeedIcon = () => React.createElement(
    'svg',
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true" },
    React.createElement('path', { d: "M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM9.05 18.33h-3V8.98h3v9.35zm-1.5-10.4c-1.04 0-1.88-.84-1.88-1.88s.84-1.88 1.88-1.88 1.88.84 1.88 1.88-.84 1.88-1.88 1.88zm10.45 10.4h-3v-4.5c0-1.07-.02-2.45-1.5-2.45s-1.73 1.17-1.73 2.38v4.57h-3V8.98h2.88v1.32h.04c.4-.76 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6v5.33z" })
);


export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend React Engineer',
    description: `We are seeking a highly skilled Senior Frontend React Engineer with over 5 years of experience in building modern, responsive, and scalable web applications. The ideal candidate will have a deep understanding of React.js and its core principles, experience with popular React.js workflows (such as Redux or MobX), and a knack for creating beautiful, user-friendly interfaces with CSS-in-JS or utility-first CSS frameworks like Tailwind CSS. Responsibilities include developing new user-facing features, building reusable components, and optimizing applications for maximum speed and scalability. Strong proficiency in TypeScript, RESTful APIs, and modern front-end build pipelines is required. Experience with Next.js and GraphQL is a major plus. The candidate must be based in San Francisco, CA.`,
    location: 'San Francisco, CA',
    type: 'Full-time',
    applications: 128,
    shortlisted: 12,
    hired: 1,
    status: 'Open'
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    description: 'Looking for a creative UI/UX designer to shape the user experience of our mobile and web products.',
    location: 'New York, NY',
    type: 'Full-time',
    applications: 75,
    shortlisted: 8,
    hired: 1,
    status: 'Open'
  },
  {
    id: 3,
    title: 'Digital Marketing Executive',
    description: 'Join our marketing team to run innovative campaigns and grow our digital presence.',
    location: 'Remote',
    type: 'Remote',
    applications: 215,
    shortlisted: 15,
    hired: 0,
    status: 'Open'
  },
   {
    id: 6,
    title: 'Data Scientist (Draft)',
    description: 'Analyze large datasets to extract meaningful insights.',
    location: 'Boston, MA',
    type: 'Full-time',
    applications: 0,
    shortlisted: 0,
    hired: 0,
    status: 'Draft'
  },
  {
    id: 4,
    title: 'Backend Go Developer',
    description: 'Experienced Go developer needed to build and maintain our microservices architecture.',
    location: 'Austin, TX',
    type: 'Full-time',
    applications: 45,
    shortlisted: 5,
    hired: 0,
    status: 'Closed'
  },
   {
    id: 5,
    title: 'Finance Officer',
    description: 'A detail-oriented Finance Officer to manage our financial health and reporting.',
    location: 'London, UK',
    type: 'Part-time',
    applications: 88,
    shortlisted: 10,
    hired: 1,
    status: 'Open'
  },
];


export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 101,
    name: 'Alice Johnson',
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
    portal: 'LinkedIn',
    appliedAt: '2024-07-28T10:00:00Z',
    resume: `Alice Johnson - Senior Frontend Developer\n\nExperience:\n- Lead Frontend Engineer at TechSolutions Inc (2019-Present) - San Francisco, CA.\n  - Led the development of a major e-commerce platform using React, TypeScript, and Redux, resulting in a 30% increase in user engagement.\n  - Architected a reusable component library with Storybook, adopted across 5 teams.\n  - Mentored junior developers and conducted code reviews to maintain code quality.\n  - Optimized application performance, reducing load times by 40%.\n- Frontend Developer at WebInnovators (2016-2019) - Palo Alto, CA.\n  - Developed and maintained client-side features for a SaaS product using React and GraphQL.\n\nSkills: React, TypeScript, Redux, Next.js, GraphQL, Tailwind CSS, Web Performance, Jest, React Testing Library.`,
    coverLetter: 'I am excited to apply for the Senior Frontend role. My extensive experience in leading React development and passion for building high-quality user interfaces align perfectly with your requirements.'
  },
  {
    id: 102,
    name: 'Bob Williams',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
    portal: 'Indeed',
    appliedAt: '2024-07-28T11:30:00Z',
    resume: `Bob Williams - Frontend Engineer\n\nExperience:\n- Frontend Engineer at DataCorp (2020-Present) - Austin, TX.\n  - Built data visualization dashboards using React and D3.js.\n  - Collaborated with UX/UI designers to implement responsive designs.\n  - Wrote unit and integration tests using Jest and Cypress.\n\nSkills: React, JavaScript, CSS, D3.js, Jest, REST APIs. Currently learning TypeScript.`,
    coverLetter: 'My experience in building interactive UIs with React would make me a great asset to your team. I am eager to grow my skills in a senior role.'
  },
  {
    id: 103,
    name: 'Charlie Brown',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
    portal: 'Glassdoor',
    appliedAt: '2024-07-28T14:15:00Z',
    resume: `Charlie Brown - Full-Stack Developer\n\nExperience:\n- Full-Stack Developer at StartupX (2018-Present) - Remote.\n  - Developed both frontend (React, Vue.js) and backend (Node.js, Express) features for a CRM application.\n  - Managed AWS infrastructure and CI/CD pipelines.\n\nSkills: React, Vue.js, Node.js, Express, MongoDB, AWS, Docker.`,
    coverLetter: 'As a full-stack developer, I have a strong understanding of the entire web development process. I am proficient in React and believe my diverse skill set would be valuable.'
  },
  {
    id: 104,
    name: 'Diana Prince',
    avatarUrl: 'https://picsum.photos/seed/diana/100/100',
    portal: 'LinkedIn',
    appliedAt: '2024-07-29T09:00:00Z',
    resume: `Diana Prince - UI/UX Designer\n\nExperience:\n- Senior UI/UX Designer at CreativeMinds (2017-Present) - New York, NY.\n  - Designed user interfaces for mobile and web applications using Figma and Sketch.\n  - Conducted user research and usability testing.\n\nSkills: Figma, Sketch, Adobe XD, User Research, Prototyping. Basic knowledge of HTML/CSS.`,
    coverLetter: 'While my primary background is in design, I have a strong passion for frontend development and have been taking courses on React. I am looking for an opportunity to transition into a developer role.'
  },
  {
    id: 105,
    name: 'Ethan Hunt',
    avatarUrl: 'https://picsum.photos/seed/ethan/100/100',
    portal: 'AngelList',
    appliedAt: '2024-07-29T12:45:00Z',
    resume: `Ethan Hunt - React Developer\n\nExperience:\n- React Developer at CodeBase LLC (2021-Present) - San Francisco, CA.\n  - Developed client-facing features for a project management tool using React and TypeScript.\n  - Used Tailwind CSS to create responsive and modern UIs.\n  - Worked extensively with RESTful APIs.\n\nSkills: React, TypeScript, Tailwind CSS, JavaScript, REST APIs, Git.`,
    coverLetter: 'I am a dedicated React developer with 3 years of experience. My work at CodeBase has prepared me to take on new challenges and I am particularly interested in the senior-level responsibilities at your company.'
  }
];

// FIX: Replaced JSX with React.createElement to avoid syntax errors in a .ts file.
export const MOCK_PORTALS: JobPortal[] = [
    {
        name: 'LinkedIn',
        icon: React.createElement(LinkedInIcon),
        isConnected: true,
        views: 18400,
        applications: 352,
        color: 'bg-blue-600',
    },
    {
        name: 'Indeed',
        icon: React.createElement(IndeedIcon),
        isConnected: true,
        views: 25200,
        applications: 512,
        color: 'bg-indigo-500',
    },
    {
        name: 'Glassdoor',
        icon: React.createElement(BriefcaseIcon), // Placeholder
        isConnected: false,
        views: 0,
        applications: 0,
        color: 'bg-green-500',
    }
];