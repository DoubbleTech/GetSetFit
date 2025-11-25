import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_JOBS, MOCK_CANDIDATES } from '../constants';
import { rankCandidates, generateOfferLetterDraft } from '../services/geminiService';
import type { Application, Candidate, AISuggestion } from '../types';
import { ApplicationStatus } from '../types';
import { CandidateCard } from './CandidateCard';
import { ResumePreviewModal } from './ResumePreviewModal';
import { ConfirmationModal } from './ConfirmationModal';

const MOCK_JOB = MOCK_JOBS[0]; // Use the first job for the applications view for now.

export const ApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(
    MOCK_CANDIDATES.map(c => ({ candidateId: c.id, status: ApplicationStatus.NEW }))
  );
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState(3);

  const [previewContent, setPreviewContent] = useState<{ content: string, title: string } | null>(null);
  const [hiringCandidate, setHiringCandidate] = useState<Candidate | null>(null);
  const [offerMessage, setOfferMessage] = useState('');

  const getAiSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rankedCandidates = await rankCandidates(MOCK_JOB, MOCK_CANDIDATES);
      setAiSuggestions(rankedCandidates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAiSuggestions();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShortlist = (candidateId: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.candidateId === candidateId ? { ...app, status: ApplicationStatus.SHORTLISTED } : app
      )
    );
  };
  
  const handleHire = async (candidateId: number) => {
    const candidate = MOCK_CANDIDATES.find(c => c.id === candidateId);
    if (candidate) {
        setIsLoading(true);
        try {
            const draft = await generateOfferLetterDraft(MOCK_JOB, candidate);
            setOfferMessage(draft);
            setHiringCandidate(candidate);
        } catch(err) {
            setError(err instanceof Error ? err.message : "Couldn't generate offer message");
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleSendOffer = (message: string) => {
    if (!hiringCandidate) return;
    console.log(`Sending offer to ${hiringCandidate.name}:`, message);
    setApplications(prev =>
      prev.map(app =>
        app.candidateId === hiringCandidate.id ? { ...app, status: ApplicationStatus.HIRED } : app
      )
    );
    setHiringCandidate(null);
  };

  const handleViewResume = (content: string, title: string) => {
    setPreviewContent({ content, title });
  };

  const columns = useMemo(() => {
    const newApps = MOCK_CANDIDATES.filter(c => applications.find(a => a.candidateId === c.id)?.status === ApplicationStatus.NEW);
    const suggested = MOCK_CANDIDATES.filter(c => aiSuggestions.slice(0, topN).some(s => s.candidateId === c.id));
    const shortlisted = MOCK_CANDIDATES.filter(c => applications.find(a => a.candidateId === c.id)?.status === ApplicationStatus.SHORTLISTED);
    const hired = MOCK_CANDIDATES.filter(c => applications.find(a => a.candidateId === c.id)?.status === ApplicationStatus.HIRED);

    return {
      [ApplicationStatus.NEW]: newApps,
      [ApplicationStatus.SUGGESTED]: suggested,
      [ApplicationStatus.SHORTLISTED]: shortlisted,
      [ApplicationStatus.HIRED]: hired,
    }
  }, [applications, aiSuggestions, topN]);


  return (
    <>
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Applications</h1>
          <p className="text-slate-600 mt-1">
            Viewing candidates for: <span className="font-semibold text-indigo-600">{MOCK_JOB.title}</span>
          </p>
      </div>
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="topN" className="font-semibold text-slate-700">Show Top</label>
          <input
            id="topN"
            type="number"
            value={topN}
            onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value, 10)))}
            className="w-20 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            min="1"
            max={MOCK_CANDIDATES.length}
          />
          <span className="text-slate-700">AI Suggested Candidates</span>
          <button onClick={getAiSuggestions} disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-slate-400 flex items-center transition-colors">
            {isLoading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>}
            Refresh Suggestions
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Object.keys(columns) as (keyof typeof columns)[]).map(status => (
          <div key={status} className="bg-gray-100 rounded-lg">
            <h2 className="text-lg font-bold text-slate-700 mb-4 p-4 border-b-2 border-slate-300">
              {status} <span className="text-sm font-normal text-slate-500">({columns[status].length})</span>
            </h2>
            <div className="h-[calc(100vh-420px)] overflow-y-auto p-4 space-y-4">
              {isLoading && status === ApplicationStatus.SUGGESTED ? (
                 <div className="flex justify-center items-center h-full">
                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                 </div>
              ) : (
                  columns[status].map(candidate => {
                  const app = applications.find(a => a.candidateId === candidate.id)!;
                  const suggestion = aiSuggestions.find(s => s.candidateId === candidate.id);
                  return (
                      <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      status={app.status}
                      aiReasoning={suggestion?.reasoning}
                      onViewResume={handleViewResume}
                      onShortlist={handleShortlist}
                      onHire={handleHire}
                      />
                  );
                  })
              )}
               {columns[status].length === 0 && !isLoading && <p className="text-center text-slate-500 mt-8 px-4">No candidates in this stage.</p>}
            </div>
          </div>
        ))}
      </div>

      {previewContent && (
        <ResumePreviewModal
          content={previewContent.content}
          title={previewContent.title}
          onClose={() => setPreviewContent(null)}
        />
      )}

      {hiringCandidate && (
        <ConfirmationModal
            candidate={hiringCandidate}
            initialMessage={offerMessage}
            onClose={() => setHiringCandidate(null)}
            onSend={handleSendOffer}
        />
      )}

      {isLoading && !hiringCandidate && (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  <span className="text-lg font-semibold text-slate-700">Processing...</span>
              </div>
          </div>
      )}
    </>
  );
};