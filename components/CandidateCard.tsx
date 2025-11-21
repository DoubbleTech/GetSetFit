
import React from 'react';
import type { Candidate } from '../types';
import { ApplicationStatus } from '../types';
import { XIcon } from './Icons';

interface CandidateCardProps {
  candidate: Candidate;
  status: ApplicationStatus;
  aiReasoning?: string;
  relevanceScore?: number;
  onViewResume: (content: string, title: string) => void;
  onShortlist: (id: number) => void;
  onHire: (id: number) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
  onRateSuggestion?: (id: number, isPositive: boolean) => void;
  onDismissSuggestion?: (id: number) => void;
}

const TimeAgo = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return <>{Math.floor(interval)} years ago</>;
  interval = seconds / 2592000;
  if (interval > 1) return <>{Math.floor(interval)} months ago</>;
  interval = seconds / 86400;
  if (interval > 1) return <>{Math.floor(interval)} days ago</>;
  interval = seconds / 3600;
  if (interval > 1) return <>{Math.floor(interval)} hours ago</>;
  interval = seconds / 60;
  if (interval > 1) return <>{Math.floor(interval)} minutes ago</>;
  return <>{Math.floor(seconds)} seconds ago</>;
};

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  status, 
  aiReasoning, 
  relevanceScore,
  onViewResume, 
  onShortlist, 
  onHire,
  isSelected,
  onToggleSelect,
  onRateSuggestion,
  onDismissSuggestion
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 border transition-shadow hover:shadow-lg relative ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}>
      {onToggleSelect && (
        <div className="absolute top-4 left-4 z-10">
           <input 
             type="checkbox" 
             checked={isSelected} 
             onChange={() => onToggleSelect(candidate.id)}
             className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
           />
        </div>
      )}
      
      <div className={`flex items-start space-x-4 ${onToggleSelect ? 'pl-8' : ''}`}>
        <img src={candidate.avatarUrl} alt={candidate.name} className="w-16 h-16 rounded-full border-2 border-slate-200" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{candidate.name}</h3>
              <span className="text-xs font-semibold text-slate-500">{candidate.portal}</span>
            </div>
            {relevanceScore !== undefined && (
              <div className={`px-2 py-1 rounded text-xs font-bold ${relevanceScore > 80 ? 'bg-green-100 text-green-800' : relevanceScore > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {relevanceScore}% Match
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Applied <TimeAgo dateString={candidate.appliedAt} />
          </p>
        </div>
      </div>

      {aiReasoning && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md relative group">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-blue-800 pr-6">
              <span className="font-bold">AI Suggestion:</span> {aiReasoning}
            </p>
            {onDismissSuggestion && (
               <button onClick={() => onDismissSuggestion(candidate.id)} className="text-blue-400 hover:text-blue-600 absolute top-2 right-2">
                  <XIcon className="w-4 h-4" />
               </button>
            )}
          </div>
          {onRateSuggestion && (
            <div className="flex items-center space-x-2 mt-2 border-t border-blue-100 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onRateSuggestion(candidate.id, true)} className="text-xs text-blue-600 hover:bg-blue-100 px-2 py-1 rounded">
                👍 Helpful
              </button>
              <button onClick={() => onRateSuggestion(candidate.id, false)} className="text-xs text-blue-600 hover:bg-blue-100 px-2 py-1 rounded">
                👎 Not Helpful
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onViewResume(candidate.resume, `${candidate.name}'s Resume`)} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">View Resume</button>
        <button onClick={() => onViewResume(candidate.coverLetter, `${candidate.name}'s Cover Letter`)} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">Cover Letter</button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
        {status !== ApplicationStatus.SHORTLISTED && status !== ApplicationStatus.HIRED && (
          <button onClick={() => onShortlist(candidate.id)} className="text-sm bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition-colors font-semibold">Shortlist</button>
        )}
        {status === ApplicationStatus.SHORTLISTED && (
          <button onClick={() => onHire(candidate.id)} className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors font-semibold">Select for Role</button>
        )}
      </div>
    </div>
  );
};
