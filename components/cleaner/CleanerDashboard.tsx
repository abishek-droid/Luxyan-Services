import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, UserRole } from '../../types';
import DashboardShell from '../common/DashboardShell';
import ChatInterface from '../common/ChatInterface';

interface CleanerDashboardProps {
    user: User;
    onLogout: () => void;
}

const initialJobs = [
    { id: 1, time: '09:00 AM', address: '123 George St, Sydney', task: 'Office Cleaning (2 hours)', status: 'Pending', checkInTime: null, checkOutTime: null },
    { id: 2, time: '12:00 PM', address: '456 Pitt St, Sydney', task: 'End-of-Lease Clean (3 hours)', status: 'Pending', checkInTime: null, checkOutTime: null },
    { id: 3, time: '04:00 PM', address: '789 Kent St, Sydney', task: 'Residential Carpet Clean', status: 'Pending', checkInTime: null, checkOutTime: null },
];

const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const LogOutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);

const statusPillClasses: {[key: string]: string} = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800 animate-pulse',
    'Completed': 'bg-green-100 text-green-800',
};

const PhotoVerificationModal = ({ isOpen, onClose, onVerified, videoRef }: { isOpen: boolean, onClose: () => void, onVerified: () => void, videoRef: React.RefObject<HTMLVideoElement>}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg text-center">
                <h3 className="text-2xl font-bold text-luxyan-blue mb-4">Photo Verification</h3>
                <p className="text-luxyan-text-secondary mb-4">Please center your face in the camera to verify your identity and start the shift.</p>
                <div className="bg-black rounded-lg w-full aspect-video mb-4 overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                </div>
                <button onClick={onVerified} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg w-full transition-colors">
                    Verify & Start Shift
                </button>
                 <button onClick={onClose} className="text-gray-500 hover:text-gray-700 mt-4 text-sm">
                    Cancel
                </button>
            </div>
        </div>
    );
};


const CleanerDashboard: React.FC<CleanerDashboardProps> = ({ user, onLogout }) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanupCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const handleStartShift = async (jobId: number) => {
        setSelectedJobId(jobId);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsModalOpen(true);
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Camera access is required for photo verification. Please enable it in your browser settings.");
        }
    };
    
    const handleVerification = () => {
        if (selectedJobId === null) return;
        setJobs(jobs.map(job => 
            job.id === selectedJobId 
            ? { ...job, status: 'In Progress', checkInTime: new Date().toLocaleTimeString() } 
            : job
        ));
        closeModal();
    };

    const handleEndShift = (jobId: number) => {
         setJobs(jobs.map(job => 
            job.id === jobId 
            ? { ...job, status: 'Completed', checkOutTime: new Date().toLocaleTimeString() } 
            : job
        ));
    };

    const closeModal = () => {
        cleanupCamera();
        setIsModalOpen(false);
        setSelectedJobId(null);
    };

    useEffect(() => {
        // Cleanup camera on component unmount
        return () => {
            cleanupCamera();
        };
    }, [cleanupCamera]);

    return (
        <DashboardShell user={user} onLogout={onLogout}>
             <PhotoVerificationModal isOpen={isModalOpen} onClose={closeModal} onVerified={handleVerification} videoRef={videoRef} />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-luxyan-blue">Today's Jobs</h3>
                    <div className="bg-white p-4 rounded-lg shadow-md space-y-4 overflow-y-auto">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <p className="font-bold text-luxyan-text-primary">{job.time} - {job.task}</p>
                                <p className="text-luxyan-text-secondary">📍 {job.address}</p>
                                {job.checkInTime && <p className="text-xs text-gray-500 mt-1">Checked In: {job.checkInTime}</p>}
                                {job.checkOutTime && <p className="text-xs text-gray-500">Checked Out: {job.checkOutTime}</p>}
                                <div className="flex justify-between items-center mt-2">
                                     <span className={`text-sm font-semibold px-2 py-1 rounded-full ${statusPillClasses[job.status]}`}>{job.status}</span>
                                     {job.status === 'Pending' && (
                                         <button onClick={() => handleStartShift(job.id)} className="flex items-center gap-1 text-green-600 hover:text-green-800 font-semibold text-sm">
                                            <CheckCircleIcon /> Check-In
                                         </button>
                                     )}
                                     {job.status === 'In Progress' && (
                                         <button onClick={() => handleEndShift(job.id)} className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-sm">
                                            <LogOutIcon /> Check-Out
                                         </button>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 h-[calc(100vh-180px)] min-h-[500px]">
                    <ChatInterface role={UserRole.CLEANER} initialMessage={`Good morning ${user.name}! Your AI assistant has optimized your day. Here's your smart schedule:`} />
                </div>
            </div>
        </DashboardShell>
    );
};

export default CleanerDashboard;