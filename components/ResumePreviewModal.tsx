
import React from 'react';

interface ResumePreviewModalProps {
  content: string;
  title: string;
  onClose: () => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ content, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{content}</pre>
        </div>
        <div className="p-4 border-t border-slate-200 text-right">
          <button onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  );
};
