
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RiskCard from '../components/RiskCard';
import { RiskData, RiskLevel } from '../types';
import VoiceAssistantModal from './VoiceAssistantModal';

const dummyRisks: RiskData[] = [
    { type: 'Flood', emoji: '🌊', current: { level: RiskLevel.High, trend: 'up' }, predicted: { level: RiskLevel.Critical, trend: 'up' } },
    { type: 'Storm', emoji: '⚡️', current: { level: RiskLevel.Moderate, trend: 'stable' }, predicted: { level: RiskLevel.Moderate, trend: 'down' } },
    { type: 'Earthquake', emoji: '🌍', current: { level: RiskLevel.Low, trend: 'stable' }, predicted: { level: RiskLevel.Low, trend: 'stable' } },
    { type: 'Heatwave', emoji: '🔥', current: { level: RiskLevel.Moderate, trend: 'up' }, predicted: { level: RiskLevel.High, trend: 'up' } },
];


const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isVoiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="Predictive Dashboard" />
            <div className="flex-grow p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Risk Overview (24-48h)</h2>
                <div className="flex flex-col gap-4">
                    {dummyRisks.map(risk => <RiskCard key={risk.type} risk={risk} />)}
                </div>

                <div className="mt-8 mb-4">
                    <button onClick={() => navigate('/analytics')} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold text-base leading-normal">
                        <span className="material-symbols-outlined text-xl">bar_chart</span>
                        View Alert Analytics
                    </button>
                </div>

                 <div className="mt-4 mb-4">
                    <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">AI Assistant</h2>
                     <div className="flex flex-col gap-3">
                        <button onClick={() => setVoiceAssistantOpen(true)} className="flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-300 text-base font-bold leading-normal tracking-[0.015em] gap-2.5">
                             <span className="material-symbols-outlined">mic</span>
                             <span className="truncate">Voice Assistant</span>
                         </button>
                         {/* Placeholder for Chatbot button */}
                         <button className="flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-slate-200 dark:bg-zinc-800 text-zinc-800 dark:text-white text-base font-bold leading-normal tracking-[0.015em] gap-2.5">
                             <span className="material-symbols-outlined">chat</span>
                             <span className="truncate">Chat with AI</span>
                         </button>
                     </div>
                 </div>
            </div>
             {isVoiceAssistantOpen && <VoiceAssistantModal onClose={() => setVoiceAssistantOpen(false)} />}
        </div>
    );
};

export default Dashboard;
