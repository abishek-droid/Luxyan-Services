import React from 'react';
import { User } from '../../types';

interface DashboardShellProps {
    user: User;
    onLogout: () => void;
    children: React.ReactNode;
}

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);


const DashboardShell: React.FC<DashboardShellProps> = ({ user, onLogout, children }) => {
    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-luxyan-card rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <header className="flex items-center justify-between p-4 bg-luxyan-blue text-white shadow-md z-10">
                <button onClick={onLogout} className="flex items-center gap-2 text-white hover:text-luxyan-gold transition-colors">
                    <LogoutIcon />
                    <span className="hidden sm:inline">Logout</span>
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{user.name} ({user.role})</h1>
                    <h2 className="text-lg font-light text-luxyan-gold">Luxyan Services Dashboard</h2>
                </div>
                <div className="w-28 text-right">
                    <span className="text-4xl">🧼</span>
                </div>
            </header>
            <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-luxyan-bg">
                {children}
            </main>
        </div>
    );
};

export default DashboardShell;