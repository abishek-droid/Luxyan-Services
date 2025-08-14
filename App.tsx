
import React, { useState } from 'react';
import { User, UserRole } from './types';
import LoginScreen from './components/RoleSelection';
import ClientDashboard from './components/client/ClientDashboard';
import CleanerDashboard from './components/cleaner/CleanerDashboard';
import SupervisorDashboard from './components/supervisor/SupervisorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const PendingApprovalScreen: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
    <div className="w-full max-w-2xl mx-auto text-center bg-luxyan-card p-10 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-3xl font-bold text-luxyan-blue mb-3">Access Pending</h1>
        <p className="text-lg text-luxyan-text-primary mb-2">Hello, {user.name}!</p>
        <p className="text-luxyan-text-secondary mb-8">Your account as a {user.role} requires administrator approval. You will be notified once your access has been granted.</p>
        <button
            onClick={onLogout}
            className="bg-luxyan-blue hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
            Back to Login
        </button>
    </div>
);


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const renderDashboard = () => {
        if (!currentUser) {
            return <LoginScreen onLogin={handleLogin} />;
        }

        if (currentUser.status === 'pending') {
            return <PendingApprovalScreen user={currentUser} onLogout={handleLogout} />;
        }

        switch (currentUser.role) {
            case UserRole.CLIENT:
                return <ClientDashboard user={currentUser} onLogout={handleLogout} />;
            case UserRole.CLEANER:
                return <CleanerDashboard user={currentUser} onLogout={handleLogout} />;
            case UserRole.SUPERVISOR:
                return <SupervisorDashboard user={currentUser} onLogout={handleLogout} />;
            case UserRole.ADMIN:
                return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
            default:
                // This case should not be reached if currentUser is valid
                return <LoginScreen onLogin={handleLogin} />;
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            {renderDashboard()}
        </div>
    );
};

export default App;
