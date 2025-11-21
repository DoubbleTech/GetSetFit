
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_CANDIDATES } from '../constants';
import { rankCandidates, generateOfferLetterDraft, generateInterviewQuestions } from '../services/geminiService';
import type { Application, Candidate, AISuggestion, Job } from '../types';
import { ApplicationStatus } from '../types';
import { ResumePreviewModal } from './ResumePreviewModal';
import { ConfirmationModal } from './ConfirmationModal';
import { InterviewQuestionsModal } from './InterviewQuestionsModal';
import { SearchIcon, ReplyIcon, EyeIcon, LightBulbIcon } from './Icons';

interface ApplicationsViewProps {
    jobs: Job[];
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>(
    MOCK_CANDIDATES.map(c => ({ candidateId: c.id, status: ApplicationStatus.NEW }))
  );
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detail View Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | ApplicationStatus>('All');
  const [sortBy, setSortBy] = useState<'date' | 'relevance' | 'name'>('date');

  const [previewContent, setPreviewContent] = useState<{ content: string, title: string } | null>(null);
  const [hiringCandidate, setHiringCandidate] = useState<Candidate | null>(null);
  const [offerMessage, setOfferMessage] = useState('');
  
  // Interview Questions State
  const [interviewData, setInterviewData] = useState<any | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState<Candidate | null>(null);

  // AI Ranking Trigger
  const getAiSuggestions = useCallback(async (job: Job) => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, we would filter candidates by job ID here
      const rankedCandidates = await rankCandidates(job, MOCK_CANDIDATES);
      setAiSuggestions(rankedCandidates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedJob) {
        getAiSuggestions(selectedJob);
    }
  }, [selectedJob, getAiSuggestions]);

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
            const draft = await generateOfferLetterDraft(selectedJob!, candidate);
            setOfferMessage(draft);
            setHiringCandidate(candidate);
        } catch(err) {
            setError(err instanceof Error ? err.message : "Couldn't generate offer message");
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleGenerateQuestions = async (candidate: Candidate) => {
      if (!selectedJob) return;
      setIsGeneratingQuestions(true);
      setInterviewCandidate(candidate);
      try {
          const data = await generateInterviewQuestions(selectedJob, candidate);
          setInterviewData(data);
      } catch (err) {
          setError("Failed to generate interview questions.");
          setInterviewCandidate(null);
      } finally {
          setIsGeneratingQuestions(false);
      }
  };

  const handleSendOffer = (message: string) => {
    if (!hiringCandidate) return;
    setApplications(prev =>
      prev.map(app =>
        app.candidateId === hiringCandidate.id ? { ...app, status: ApplicationStatus.HIRED } : app
      )
    );
    setHiringCandidate(null);
  };

  const processedCandidates = useMemo(() => {
      if (!selectedJob) return [];
      
      let result = [...MOCK_CANDIDATES];

      // Filter by Search
      if (searchQuery) {
          const lowerQ = searchQuery.toLowerCase();
          result = result.filter(c => 
              c.name.toLowerCase().includes(lowerQ) || 
              c.portal.toLowerCase().includes(lowerQ)
          );
      }

      // Filter by Status
      if (filterStatus !== 'All') {
          result = result.filter(c => {
              const app = applications.find(a => a.candidateId === c.id);
              return app?.status === filterStatus;
          });
      }

      // Sorting
      result.sort((a, b) => {
          if (sortBy === 'date') {
              return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
          } else if (sortBy === 'name') {
              return a.name.localeCompare(b.name);
          } else if (sortBy === 'relevance') {
              const scoreA = aiSuggestions.find(s => s.candidateId === a.id)?.relevanceScore || 0;
              const scoreB = aiSuggestions.find(s => s.candidateId === b.id)?.relevanceScore || 0;
              return scoreB - scoreA;
          }
          return 0;
      });

      return result;
  }, [selectedJob, searchQuery, filterStatus, sortBy, applications, aiSuggestions]);


  // Render: Jobs Summary Table
  if (!selectedJob) {
      return (
          <div className="space-y-6">
              <div>
                  <h1 className="text-3xl font-bold text-gray-800">Applications Overview</h1>
                  <p className="text-gray-600 mt-1">Select a job position to view detailed application data.</p>
              </div>

              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Position</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications Received</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Recommended</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortlisted</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {jobs.map((job) => {
                              // Mocking AI Recommended count for summary view (approx 30% of applications)
                              const aiRecCount = Math.floor(job.applications * 0.3); 
                              return (
                                  <tr 
                                    key={job.id} 
                                    onClick={() => setSelectedJob(job)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                          <div className="text-xs text-gray-500">{job.location}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{job.applications}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">{aiRecCount}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">{job.shortlisted}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{job.hired}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              job.status === 'Open' ? 'bg-green-100 text-green-800' : 
                                              job.status === 'Closed' ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'
                                          }`}>
                                              {job.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          <button className="text-indigo-600 hover:text-indigo-900">View Details &rarr;</button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  }

  // Render: Detailed Job Applications View
  const aiRecommendedCount = aiSuggestions.filter(s => s.relevanceScore > 70).length;
  const shortlistedCount = applications.filter(a => a.status === ApplicationStatus.SHORTLISTED).length;
  const hiredCount = applications.filter(a => a.status === ApplicationStatus.HIRED).length;

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
          <div>
              <button onClick={() => setSelectedJob(null)} className="text-sm text-gray-500 hover:text-gray-800 flex items-center mb-2">
                  <ReplyIcon /> <span className="ml-1">Back to All Jobs</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{selectedJob.location}</span>
                  <span>•</span>
                  <span className={`font-medium ${selectedJob.status === 'Open' ? 'text-green-600' : 'text-gray-600'}`}>{selectedJob.status}</span>
              </div>
          </div>
      </div>

      {/* Stats Summary for Selected Job */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-bold">Total Applications</p>
              <p className="text-2xl font-bold text-gray-800">{selectedJob.applications}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-indigo-500">
              <p className="text-xs text-indigo-600 uppercase font-bold">AI Recommended</p>
              <p className="text-2xl font-bold text-indigo-700">{aiRecommendedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-yellow-400">
              <p className="text-xs text-yellow-600 uppercase font-bold">Shortlisted</p>
              <p className="text-2xl font-bold text-yellow-700">{shortlistedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
              <p className="text-xs text-green-600 uppercase font-bold">Hired</p>
              <p className="text-2xl font-bold text-green-700">{hiredCount}</p>
          </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
                <div className="relative max-w-xs w-full">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search name or source..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
                <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border border-gray-300 rounded-md text-sm p-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="All">All Statuses</option>
                    {Object.values(ApplicationStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                 <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-md text-sm p-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="date">Sort by Date</option>
                    <option value="relevance">Sort by Relevance</option>
                    <option value="name">Sort by Name</option>
                </select>
            </div>
            <div className="flex items-center">
                <button onClick={() => getAiSuggestions(selectedJob)} disabled={isLoading} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 disabled:opacity-50 flex items-center transition-colors text-sm font-medium">
                    {isLoading ? 'Analyzing Candidates...' : 'Refresh AI Analysis'}
                </button>
            </div>
      </div>

      {/* Detailed Applications Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cover Letter</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Match</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {processedCandidates.map((candidate) => {
                      const app = applications.find(a => a.candidateId === candidate.id)!;
                      const suggestion = aiSuggestions.find(s => s.candidateId === candidate.id);
                      const score = suggestion?.relevanceScore || 0;
                      
                      return (
                          <tr key={candidate.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                          <img className="h-10 w-10 rounded-full object-cover" src={candidate.avatarUrl} alt="" />
                                      </div>
                                      <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button 
                                    onClick={() => setPreviewContent({ content: candidate.resume, title: `${candidate.name}'s Resume` })}
                                    className="text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                    title="View Resume"
                                  >
                                      <EyeIcon className="h-5 w-5" />
                                  </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {candidate.coverLetter ? (
                                    <button 
                                        onClick={() => setPreviewContent({ content: candidate.coverLetter, title: `${candidate.name}'s Cover Letter` })}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                        title="View Cover Letter"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(candidate.appliedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                      {candidate.portal}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  {score > 0 ? (
                                      <div className="flex items-center">
                                          <div className={`w-10 text-right text-sm font-bold mr-2 ${score > 75 ? 'text-green-600' : score > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                              {score}%
                                          </div>
                                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                              <div 
                                                className={`h-full ${score > 75 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                style={{ width: `${score}%` }}
                                              ></div>
                                          </div>
                                      </div>
                                  ) : (
                                      <span className="text-xs text-gray-400">Pending AI</span>
                                  )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      app.status === 'Hired' ? 'bg-green-100 text-green-800' :
                                      app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-800' :
                                      app.status === 'AI Suggested' ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-gray-100 text-gray-800'
                                  }`}>
                                      {app.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex items-center justify-end">
                                  <button 
                                      onClick={() => handleGenerateQuestions(candidate)}
                                      className="text-gray-500 hover:text-indigo-600 p-1 rounded"
                                      title="Generate Interview Questions"
                                  >
                                      {isGeneratingQuestions && interviewCandidate?.id === candidate.id ? (
                                          <span className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent block"></span>
                                      ) : (
                                          <LightBulbIcon className="h-5 w-5" />
                                      )}
                                  </button>
                                  
                                  {app.status !== 'Hired' && app.status !== 'Shortlisted' && (
                                      <button onClick={() => handleShortlist(candidate.id)} className="text-yellow-600 hover:text-yellow-900 ml-2">Shortlist</button>
                                  )}
                                  {app.status === 'Shortlisted' && (
                                      <button onClick={() => handleHire(candidate.id)} className="text-green-600 hover:text-green-900 ml-2">Hire</button>
                                  )}
                              </td>
                          </tr>
                      );
                  })}
                  {processedCandidates.length === 0 && (
                      <tr>
                          <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                              No candidates found matching your filters.
                          </td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>

      {previewContent && (
        <ResumePreviewModal
          content={previewContent.content}
          title={previewContent.title}
          onClose={() => setPreviewContent(null)}
        />
      )}
      
      {interviewData && interviewCandidate && (
          <InterviewQuestionsModal
              data={interviewData}
              candidateName={interviewCandidate.name}
              jobTitle={selectedJob.title}
              onClose={() => setInterviewData(null)}
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
      
      {error && <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">{error}</div>}
    </div>
  );
};
