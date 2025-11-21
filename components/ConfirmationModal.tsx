
import React, { useState, useEffect } from 'react';
import type { Candidate } from '../types';

interface ConfirmationModalProps {
  candidate: Candidate;
  initialMessage: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ candidate, initialMessage, onClose, onSend }) => {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  const handleSend = () => {
    onSend(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Send Confirmation to {candidate.name}</h2>
        </div>
        <div className="p-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-64 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your confirmation message..."
          />
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end space-x-3">
          <button onClick={onClose} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-300">Cancel</button>
          <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Send Message</button>
        </div>
      </div>
    </div>
  );
};
