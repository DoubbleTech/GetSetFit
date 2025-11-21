
import { ReactNode } from "react";

export enum ApplicationStatus {
  NEW = 'New Application',
  SUGGESTED = 'AI Suggested',
  SHORTLISTED = 'Shortlisted',
  HIRED = 'Hired',
}

export interface Candidate {
  id: number;
  name: string;
  avatarUrl: string;
  portal: string;
  appliedAt: string;
  resume: string;
  coverLetter: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote';
  applications: number;
  shortlisted: number;
  hired: number;
  status: 'Open' | 'Closed' | 'Draft';
  closingDate?: string;
  isFavorite?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  experience?: string;
  ageGroup?: string;
  additionalMessage?: string;
  email?: string;
  gender?: string;
  salaryAndPerks?: string;
  postedLinks?: { portal: string; url: string }[]; // New field for external job links
}

export interface AISuggestion {
  candidateId: number;
  reasoning: string;
  relevanceScore: number;
}

export interface Application {
  candidateId: number;
  status: ApplicationStatus;
}

export interface JobPortal {
    name: string;
    icon: ReactNode;
    isConnected: boolean;
    views: number;
    applications: number;
    color: string;
    email?: string;
    websiteUrl?: string;
    autoPost?: boolean; 
}
