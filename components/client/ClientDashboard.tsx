import React from 'react';
import { User, UserRole } from '../../types';
import DashboardShell from '../common/DashboardShell';
import ChatInterface from '../common/ChatInterface';

interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout }) => {
    return (
        <DashboardShell user={user} onLogout={onLogout}>
            <div className="h-[calc(100vh-160px)]">
               <ChatInterface role={UserRole.CLIENT} initialMessage={`Welcome to Luxyan Services Premium, ${user.name}! I'm your AI concierge. I've analyzed your location and can offer you our best rates. How can I exceed your expectations today?`} />
            </div>
        </DashboardShell>
    );
};

export default ClientDashboard;