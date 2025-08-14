import React from 'react';
import { User, UserRole } from '../../types';
import DashboardShell from '../common/DashboardShell';
import ChatInterface from '../common/ChatInterface';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
}

const revenueData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
];

const bookingData = [
  { name: 'Commercial', bookings: 45 }, { name: 'Residential', bookings: 80 },
  { name: 'End-of-Lease', bookings: 30 }, { name: 'Carpet', bookings: 55 },
];

const pendingApprovals = [
    { name: 'John Doe', email: 'cleaner.john@luxyangroup.com', role: 'Cleaner' }
];

const MetricCard: React.FC<{title: string; value: string; change: string; icon: string}> = ({ title, value, change, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-luxyan-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-luxyan-text-primary">{value}</p>
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
        </div>
        <div className="text-3xl bg-luxyan-blue text-white rounded-full p-3">{icon}</div>
    </div>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    return (
        <DashboardShell user={user} onLogout={onLogout}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="flex flex-col gap-6">
                     <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-luxyan-blue mb-3">🔐 Pending User Approvals</h3>
                        {pendingApprovals.map(p => (
                            <div key={p.email} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-luxyan-text-primary">{p.name} <span className="text-sm font-normal text-luxyan-text-secondary">({p.role})</span></p>
                                    <p className="text-xs text-luxyan-text-secondary">{p.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded">Approve</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded">Deny</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCard title="Daily Revenue" value="$4,520" change="+5.2% vs yesterday" icon="💰"/>
                        <MetricCard title="Active Jobs" value="34" change="-2 vs yesterday" icon="🧽"/>
                        <MetricCard title="New Leads" value="12" change="+10.0% vs yesterday" icon="📈"/>
                        <MetricCard title="Satisfaction" value="4.8/5" change="+0.1 vs last week" icon="⭐"/>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md flex-grow">
                        <h3 className="text-lg font-bold text-luxyan-blue mb-4">Monthly Revenue 💰</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#003366" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className="h-[calc(100vh-180px)] min-h-[700px]">
                    <ChatInterface role={UserRole.ADMIN} initialMessage={`Welcome ${user.name}! Your AI Business Intelligence Dashboard is ready:`} />
                </div>
            </div>
        </DashboardShell>
    );
};

export default AdminDashboard;