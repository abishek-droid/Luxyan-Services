import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

const predefinedUsers: User[] = [
  { name: 'Abishek', email: 'abishek@luxyangroup.com', role: UserRole.ADMIN, status: 'approved', avatar: '👑' },
  { name: 'Jane Smith', email: 'supervisor.jane@luxyangroup.com', role: UserRole.SUPERVISOR, status: 'approved', avatar: '📋' },
  { name: 'Sarah Johnson', email: 'cleaner.sarah@luxyangroup.com', role: UserRole.CLEANER, status: 'approved', avatar: '🧹' },
  { name: 'John Doe', email: 'cleaner.john@luxyangroup.com', role: UserRole.CLEANER, status: 'pending', avatar: '⏳' },
  { name: 'Test Client', email: 'client.test@gmail.com', role: UserRole.CLIENT, status: 'approved', avatar: '👥' },
];

const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const UserSelectionModal: React.FC<{ onSelect: (user: User) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center text-luxyan-text-primary mb-6">Simulate Login As...</h2>
            <div className="space-y-4">
                {predefinedUsers.map(user => (
                    <button key={user.email} onClick={() => onSelect(user)} className="w-full flex items-center p-4 rounded-lg hover:bg-luxyan-bg border border-gray-200 transition-colors text-left">
                        <div className="text-4xl mr-4">{user.avatar}</div>
                        <div>
                            <p className="font-bold text-luxyan-text-primary">{user.name}</p>
                            <p className="text-sm text-luxyan-text-secondary">{user.email}</p>
                            <p className="text-xs font-semibold text-luxyan-blue">{user.role} ({user.status})</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col justify-center items-center min-h-[calc(100vh-100px)]">
            {isModalOpen && <UserSelectionModal onSelect={onLogin} onClose={() => setIsModalOpen(false)} />}
            <div className="text-center bg-luxyan-card p-12 rounded-2xl shadow-2xl border border-gray-200">
                <h1 className="text-5xl font-extrabold text-luxyan-blue mb-2">Luxyan Services</h1>
                <p className="text-xl text-luxyan-text-secondary mb-10">Complete Automation System</p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center bg-white text-gray-700 font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-300"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>
                <p className="text-xs text-gray-400 mt-8">This is a simulated login. No real authentication is performed.</p>
            </div>
        </div>
    );
};

export default LoginScreen;