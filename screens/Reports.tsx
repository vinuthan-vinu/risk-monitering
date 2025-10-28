import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Header from '../components/Header';
import { analyzeImage } from '../services/geminiService';

// New interface for a submitted report
interface IncidentReport {
    id: number;
    type: string;
    description: string;
}


const AnalyzeDamage: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = (reader.result as string).split(',')[1];
                setImage(reader.result as string);
                setIsLoading(true);
                setAnalysis(null);
                const prompt = "Analyze the damage in this image for a disaster report. Identify the type of damage, estimate its severity, and point out key areas of concern.";
                const result = await analyzeImage(base64String, file.type, prompt);
                setAnalysis(result);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
         <div className="flex flex-col flex-1 p-4 gap-6">
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-6 py-10">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400" style={{ fontSize: 40 }}>cloud_upload</span>
                <p className="text-gray-800 dark:text-white text-lg font-bold text-center">Upload a photo of the damage</p>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold">
                    Tap to Upload
                </button>
            </div>
            {(image || isLoading) && (
                 <div>
                    <h3 className="text-gray-800 dark:text-white text-lg font-bold pb-2">AI Analysis</h3>
                    <div className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-[#1a262c]">
                        {image && <img src={image} alt="Damage analysis" className="w-full aspect-[4/3] object-cover rounded-t-xl" />}
                        <div className="p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Analyzing...</span>
                                </div>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300 text-base">{analysis}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};


const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'report' | 'analyze'>('report');
    
    // State for the incident reporting form and list
    const [reports, setReports] = useState<IncidentReport[]>([]);
    const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);
    const [incidentType, setIncidentType] = useState('Other');
    const [description, setDescription] = useState('');

    // Pre-fill form when editing a report
    useEffect(() => {
        if (editingReport) {
            setIncidentType(editingReport.type);
            setDescription(editingReport.description);
        }
    }, [editingReport]);

    const resetForm = () => {
        setIncidentType('Other');
        setDescription('');
        setEditingReport(null);
    };

    const handleSubmit = () => {
        if (!description.trim()) {
            alert('Please add a description.');
            return;
        }

        if (editingReport) {
            // Update existing report
            setReports(prev => prev.map(r => r.id === editingReport.id ? { ...editingReport, type: incidentType, description } : r));
            alert('Report updated successfully!');
        } else {
            // Add new report
            const newReport: IncidentReport = { id: Date.now(), type: incidentType, description };
            setReports(prev => [newReport, ...prev]);
            alert('Report submitted successfully!');
        }
        resetForm();
    };

    const handleEdit = (report: IncidentReport) => {
        setEditingReport(report);
        // Scroll to top for better UX
        document.querySelector('.overflow-y-auto')?.scrollTo(0, 0);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            setReports(prev => prev.filter(r => r.id !== id));
            // If deleting the report currently being edited, reset the form
            if (editingReport?.id === id) {
                resetForm();
            }
        }
    };

    const handleCancelEdit = () => {
        resetForm();
    };


    return (
        <div className="flex flex-col h-full">
            <Header title="Reports" />
            <div className="flex h-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 p-1 mx-4 my-2">
                <button onClick={() => setActiveTab('analyze')} className={`h-full grow rounded-md px-2 text-sm font-medium transition-colors ${activeTab === 'analyze' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    Analyze Damage
                </button>
                <button onClick={() => setActiveTab('report')} className={`h-full grow rounded-md px-2 text-sm font-medium transition-colors ${activeTab === 'report' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    Report Incident
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'analyze' ? (
                    <AnalyzeDamage />
                ) : (
                    <div className="pb-28"> {/* Padding for fixed button area */}
                        {/* Form Section */}
                        <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{editingReport ? 'Edit Incident' : 'Report an Incident'}</h2>
                        <h3 className="text-slate-600 dark:text-slate-400 text-base font-medium leading-tight px-4 pb-2 pt-4">Incident Type</h3>
                        <div className="flex px-4 py-3">
                            <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-slate-200 dark:bg-black/20 p-1">
                                {['Flood', 'Fire', 'Earthquake', 'Other'].map((type) => (
                                    <label key={type} className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-primary has-[:checked]:shadow-sm has-[:checked]:text-white text-slate-600 dark:text-white/70 text-sm font-medium leading-normal">
                                        <span className="truncate">{type}</span>
                                        <input
                                            className="invisible w-0"
                                            name="incident_type"
                                            type="radio"
                                            value={type}
                                            checked={incidentType === type}
                                            onChange={() => setIncidentType(type)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <h3 className="text-slate-600 dark:text-slate-400 text-base font-medium leading-tight px-4 pb-2 pt-4">Description</h3>
                        <div className="px-4 py-3">
                            <textarea
                                className="form-textarea w-full resize-y rounded-xl bg-slate-100 dark:bg-black/20 border border-slate-300 dark:border-white/20 focus:border-primary focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/50 text-base font-normal leading-normal"
                                placeholder="Provide a brief but clear description..."
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Submitted Reports Section */}
                        <div className="px-4 mt-6">
                            <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">Submitted Reports</h2>
                            {reports.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400 text-center py-4">No reports submitted yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reports.map(report => (
                                        <div key={report.id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">{report.type}</p>
                                                    <p className="text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{report.description}</p>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0 ml-4">
                                                    <button onClick={() => handleEdit(report)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(report.id)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

             {activeTab === 'report' && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-slate-200 dark:border-white/10 flex items-center gap-4">
                    {editingReport && (
                        <button
                            onClick={handleCancelEdit}
                            className="flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-base font-bold"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary text-white text-base font-bold transition-opacity disabled:opacity-50"
                        disabled={!description.trim()}
                    >
                        {editingReport ? 'Update Report' : 'Submit Report'}
                    </button>
                </div>
             )}
        </div>
    );
};

export default Reports;