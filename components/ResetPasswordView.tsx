import React, { useState, useMemo } from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface ResetPasswordViewProps {
    onPasswordReset: () => void;
}

const TEMPORARY_PASSWORD = 'demo123';

const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <li className={`flex items-center text-sm ${isValid ? 'text-green-300' : 'text-violet-300'}`}>
        {isValid ? <CheckCircleIcon className="mr-2" /> : <XCircleIcon className="mr-2" />}
        {text}
    </li>
);

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onPasswordReset }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validations = useMemo(() => {
        const hasUpper = /[A-Z]/.test(newPassword);
        const hasLower = /[a-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword);
        const minLength = newPassword.length >= 8;
        return { hasUpper, hasLower, hasNumber, hasSpecial, minLength };
    }, [newPassword]);
    
    const passwordsMatch = useMemo(() => {
        return newPassword && newPassword === confirmPassword;
    }, [newPassword, confirmPassword]);

    const isFormValid = Object.values(validations).every(Boolean) && passwordsMatch;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword === TEMPORARY_PASSWORD) {
            setError('New password cannot be the same as the temporary password.');
            return;
        }

        if (!isFormValid) {
            setError('Please ensure all password requirements are met.');
            return;
        }
        
        console.log('Password successfully updated.');
        onPasswordReset();
    };

    return (
        <div className="min-h-screen bg-violet-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-violet-700 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="max-w-md w-full z-10 p-8 sm:p-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold">Set a New Password</h2>
                    <p className="mt-2 text-center text-sm text-violet-200">
                        Your temporary password has expired. Please create a new one.
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="new-password" className="text-sm font-bold text-violet-200">New Password</label>
                        <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-2 block w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white"
                        />
                    </div>
                    <div className="pt-2">
                        <ul className="space-y-1">
                           <ValidationItem isValid={validations.minLength} text="At least 8 characters" />
                           <ValidationItem isValid={validations.hasLower} text="One lowercase letter" />
                           <ValidationItem isValid={validations.hasUpper} text="One uppercase letter" />
                           <ValidationItem isValid={validations.hasNumber} text="One number" />
                           <ValidationItem isValid={validations.hasSpecial} text="One special character" />
                        </ul>
                    </div>
                     <div>
                        <label htmlFor="confirm-password" className="text-sm font-bold text-violet-200">Confirm New Password</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-2 block w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 placeholder-violet-300 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white"
                        />
                    </div>
                    {confirmPassword && (
                        <ValidationItem isValid={passwordsMatch} text="Passwords match" />
                    )}

                    {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-violet-600 bg-white hover:bg-violet-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            Set New Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};