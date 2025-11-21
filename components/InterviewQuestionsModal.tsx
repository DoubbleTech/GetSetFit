
import React from 'react';
import { LightBulbIcon } from './Icons';

interface Question {
    question: string;
    signal: string;
}

interface InterviewData {
    technicalQuestions: Question[];
    behavioralQuestions: Question[];
}

interface InterviewQuestionsModalProps {
    data: InterviewData;
    candidateName: string;
    jobTitle: string;
    onClose: () => void;
}

export const InterviewQuestionsModal: React.FC<InterviewQuestionsModalProps> = ({ data, candidateName, jobTitle, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-indigo-50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                            <LightBulbIcon />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">AI Interview Prep</h2>
                            <p className="text-xs text-gray-600">Tailored questions for {candidateName} ({jobTitle})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-md font-bold text-indigo-700 mb-3 uppercase tracking-wide border-b border-indigo-100 pb-2">Technical Assessment</h3>
                        <div className="space-y-4">
                            {data.technicalQuestions.map((q, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <p className="font-semibold text-gray-800 mb-2">Q{idx + 1}: {q.question}</p>
                                    <p className="text-sm text-gray-600 italic flex items-start">
                                        <span className="font-bold text-indigo-500 mr-2">Signal:</span> {q.signal}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-md font-bold text-green-700 mb-3 uppercase tracking-wide border-b border-green-100 pb-2">Behavioral Assessment</h3>
                        <div className="space-y-4">
                            {data.behavioralQuestions.map((q, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <p className="font-semibold text-gray-800 mb-2">Q{idx + 1}: {q.question}</p>
                                    <p className="text-sm text-gray-600 italic flex items-start">
                                        <span className="font-bold text-green-500 mr-2">Signal:</span> {q.signal}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-end">
                    <button onClick={onClose} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">Close</button>
                </div>
            </div>
        </div>
    );
};
