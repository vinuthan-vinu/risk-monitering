
import React from 'react';
import Header from '../components/Header';
import { useDarkMode } from '../hooks/useDarkMode';
import { useLocationSetting } from '../hooks/useLocationSetting';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="peer h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
    </label>
);

const Settings: React.FC = () => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const [isLocationEnabled, toggleLocationSetting] = useLocationSetting();
    
    return (
        <div className="flex flex-col h-full">
            <Header title="Preparedness Settings" />
            <div className="px-4 space-y-8 pb-10 overflow-y-auto">
                {/* Emergency Contacts */}
                <div>
                    <h3 className="text-slate-800 dark:text-white text-lg font-bold leading-tight flex items-center gap-3 py-4">
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">group</span>
                        Emergency Contacts
                    </h3>
                    <div className="flex flex-col gap-px overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800/50">
                        {/* Dummy contacts */}
                        <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 py-2 justify-between">
                             <p className="text-slate-500 dark:text-slate-400 text-sm">No contacts added yet.</p>
                        </div>
                        <div className="bg-background-light dark:bg-background-dark px-2 py-1">
                            <button className="flex w-full items-center justify-center rounded-lg h-12 bg-primary/10 text-primary gap-2 text-sm font-bold transition-colors hover:bg-primary/20">
                                <span className="material-symbols-outlined text-xl">add</span>
                                Add New Contact
                            </button>
                        </div>
                    </div>
                </div>

                {/* Connectivity */}
                <div>
                    <h3 className="text-slate-800 dark:text-white text-lg font-bold leading-tight flex items-center gap-3 py-4">
                         <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">wifi_off</span>
                         Connectivity
                     </h3>
                    <div className="flex flex-col gap-2 rounded-xl bg-background-light dark:bg-background-dark p-4 ring-1 ring-slate-200 dark:ring-slate-800/50">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-900 dark:text-white text-base font-medium">Enable Offline Mode</p>
                            <ToggleSwitch checked={true} onChange={() => {}} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm pr-8">Receive basic alerts via SMS without an internet connection.</p>
                    </div>
                </div>

                {/* Location Services */}
                <div>
                    <h3 className="text-slate-800 dark:text-white text-lg font-bold leading-tight flex items-center gap-3 py-4">
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">location_on</span>
                        Location Services
                    </h3>
                    <div className="flex flex-col gap-2 rounded-xl bg-background-light dark:bg-background-dark p-4 ring-1 ring-slate-200 dark:ring-slate-800/50">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-900 dark:text-white text-base font-medium">Enable Location</p>
                            <ToggleSwitch checked={isLocationEnabled} onChange={toggleLocationSetting} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm pr-8">Allow the app to use your location for accurate, real-time weather and risk analysis.</p>
                    </div>
                </div>

                {/* Appearance */}
                <div>
                     <h3 className="text-slate-800 dark:text-white text-lg font-bold leading-tight flex items-center gap-3 py-4">
                         <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">contrast</span>
                         Appearance
                     </h3>
                    <div className="flex items-center justify-between gap-4 bg-background-light dark:bg-background-dark px-4 py-3 min-h-[56px] rounded-xl ring-1 ring-slate-200 dark:ring-slate-800/50">
                        <p className="text-slate-900 dark:text-white text-base font-medium">Dark Mode</p>
                        <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
