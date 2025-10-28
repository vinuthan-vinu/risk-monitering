
import React, { useState } from 'react';
import Header from '../components/Header';
import { AnalyticsData, RiskLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const dummyData: AnalyticsData = {
    totalAlerts: 128,
    averageSeverity: RiskLevel.Moderate,
    frequentType: 'Flood',
    frequency: [
        { name: 'Week 1', alerts: 20 },
        { name: 'Week 2', alerts: 50 },
        { name: 'Week 3', alerts: 25 },
        { name: 'Week 4', alerts: 35 },
    ],
    byType: [
        { name: 'Flood', value: 45 },
        { name: 'Storm', value: 30 },
        { name: 'Seismic', value: 15 },
        { name: 'Fire', value: 10 },
    ],
    bySeverity: [
        { name: RiskLevel.Low, value: 15 },
        { name: RiskLevel.Moderate, value: 55 },
        { name: RiskLevel.High, value: 25 },
        { name: RiskLevel.Critical, value: 5 },
    ],
};

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
const SEVERITY_COLORS: { [key in RiskLevel]: string } = {
    [RiskLevel.Low]: '#FBBF24', // yellow-400
    [RiskLevel.Moderate]: '#F97316', // orange-500
    [RiskLevel.High]: '#EF4444', // red-500
    [RiskLevel.Critical]: '#DC2626', // red-600
};

const Analytics: React.FC = () => {
    const [data] = useState(dummyData);

    return (
        <div className="flex flex-col h-full">
            <Header title="Alert Analytics" showBackButton={true} />
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Alerts</p>
                        <p className="text-slate-900 dark:text-white text-2xl font-bold">{data.totalAlerts}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Avg Severity</p>
                        <p className="text-orange-500 text-2xl font-bold">{data.averageSeverity}</p>
                    </div>
                     <div className="flex flex-col col-span-2 md:col-span-1 gap-2 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Frequent Type</p>
                        <p className="text-slate-900 dark:text-white text-2xl font-bold">{data.frequentType}</p>
                    </div>
                </div>

                {/* Frequency Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                     <p className="text-slate-900 dark:text-white text-base font-semibold">Alert Frequency</p>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">Last 30 Days</p>
                     <div className="h-52 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.frequency} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                                <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}}/>
                                <Bar dataKey="alerts" fill="#13a4ec" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </div>

                {/* Type Distribution Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                    <p className="text-slate-900 dark:text-white text-base font-semibold">Alerts by Type</p>
                    <div className="h-52">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie data={data.byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                                     {data.byType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                 </Pie>
                                 <Tooltip />
                                 <Legend />
                             </PieChart>
                         </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Severity Breakdown */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                    <p className="text-slate-900 dark:text-white text-base font-semibold mb-4">Severity Breakdown</p>
                    <div className="space-y-4">
                        {data.bySeverity.map(item => (
                            <div key={item.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.value}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="h-2 rounded-full" style={{ width: `${item.value}%`, backgroundColor: SEVERITY_COLORS[item.name] }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
