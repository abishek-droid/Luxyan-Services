import React from 'react';
import { User, UserRole } from '../../types';
import DashboardShell from '../common/DashboardShell';
import ChatInterface from '../common/ChatInterface';

interface SupervisorDashboardProps {
    user: User;
    onLogout: () => void;
}

const actionItems = [
    { type: 'Quality Issue', details: 'Client at 456 Pitt St reports missed bathroom cleaning.', priority: 'High', icon: '⚠️' },
    { type: 'Schedule Conflict', details: 'John Doe is double-booked at 2 PM. Needs reassignment.', priority: 'Medium', icon: '⏰' },
    { type: 'Complaint', details: 'Noise complaint from 123 George St office neighbor.', priority: 'High', icon: '🗣️' },
    { type: 'Low Stock', details: 'Eco-friendly all-purpose cleaner running low.', priority: 'Low', icon: '🛒' },
];

const priorityClasses: { [key: string]: string } = {
    'High': 'bg-red-100 text-red-800 border-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Low': 'bg-blue-100 text-blue-800 border-blue-300',
};

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ user, onLogout }) => {
    return (
        <DashboardShell user={user} onLogout={onLogout}>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-luxyan-blue">Action Items</h3>
                    <div className="bg-white p-4 rounded-lg shadow-md space-y-4 overflow-y-auto">
                        {actionItems.map((item, index) => (
                            <div key={index} className={`p-4 border-l-4 rounded-r-lg ${priorityClasses[item.priority]}`}>
                                <p className="font-bold text-luxyan-text-primary flex items-center gap-2">
                                  <span className="text-xl">{item.icon}</span>
                                  {item.type}
                                </p>
                                <p className="text-luxyan-text-secondary mt-1">{item.details}</p>
                                <p className="text-right text-sm font-semibold mt-2">{item.priority} Priority</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 h-[calc(100vh-180px)] min-h-[500px]">
                    <ChatInterface role={UserRole.SUPERVISOR} initialMessage="Command Center Active! Here's your real-time operations dashboard:" />
                </div>
            </div>
        </DashboardShell>
    );
};

export default SupervisorDashboard;