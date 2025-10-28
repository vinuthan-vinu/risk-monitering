
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import MapScreen from './screens/Map';
import Reports from './screens/Reports';
import Settings from './screens/Settings';
import Analytics from './screens/Analytics';
import BottomNav from './components/BottomNav';
import { useDarkMode } from './hooks/useDarkMode';

const App: React.FC = () => {
    const [isDarkMode] = useDarkMode();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <HashRouter>
            <MainContent />
        </HashRouter>
    );
};

const MainContent: React.FC = () => {
    const location = useLocation();
    const showBottomNav = ['/', '/map', '/reports', '/settings'].includes(location.pathname);

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark font-display">
            <main className="flex-grow flex flex-col overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/map" element={<MapScreen />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </main>
            {showBottomNav && <BottomNav />}
        </div>
    );
}

export default App;
