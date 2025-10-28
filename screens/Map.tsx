
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroundedResponse } from '../services/geminiService';
import { useLocationSetting } from '../hooks/useLocationSetting';

interface WeatherStats {
    temp: string;
    humidity: string;
    wind: string;
}

interface GroundingChunk {
    maps?: {
        uri: string;
        title: string;
    };
    web?: {
        uri: string;
        title: string;
    };
}

const MapScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isLocationEnabled] = useLocationSetting();
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [weatherStats, setWeatherStats] = useState<WeatherStats>({ temp: 'N/A', humidity: 'N/A', wind: 'N/A' });
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLocationEnabled) {
            setError(null);
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    fetchWeatherData({ latitude, longitude });
                },
                (err) => {
                    setError('Could not get location. Please enable location in your browser/OS settings.');
                    console.error(err);
                    setIsLoading(false);
                }
            );
        } else {
            setError('Location services are disabled in the app settings.');
            setIsLoading(false);
            setLocation(null);
            setWeatherStats({ temp: 'N/A', humidity: 'N/A', wind: 'N/A' });
        }
    }, [isLocationEnabled]);

    const fetchWeatherData = async (coords: { latitude: number, longitude: number }) => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            const prompt = "Get the current temperature in Celsius, humidity, and wind speed for my location. Respond ONLY in the format: Temp: [value]°C, Humidity: [value]%, Wind: [value] km/h";
            const response = await getGroundedResponse(prompt, coords);
            const text = response.text;

            // Use specific regex based on the prompted format for reliability
            const tempMatch = text.match(/Temp:\s*(-?\d+\.?\d*)\s*°C/i);
            const humidityMatch = text.match(/Humidity:\s*(\d+\.?\d*)\s*%/i);
            const windMatch = text.match(/Wind:\s*(-?\d+\.?\d*)\s*km\/h/i);

            setWeatherStats({
                temp: tempMatch ? `${tempMatch[1]}°C` : 'N/A',
                humidity: humidityMatch ? `${humidityMatch[1]}%` : 'N/A',
                wind: windMatch ? `${windMatch[1]} km/h` : 'N/A',
            });
            
            if (!tempMatch || !humidityMatch || !windMatch) {
                console.warn("Could not parse all weather data from response:", text);
            }

        } catch (err) {
            console.error("Failed to fetch weather data", err);
            setError("Could not fetch weather data.");
            setWeatherStats({ temp: 'N/A', humidity: 'N/A', wind: 'N/A' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeLocation = async () => {
        if (!location) {
            setError('Location not available.');
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        setSources([]);
        setError(null);
        setIsSheetOpen(true);
        try {
            const prompt = "Analyze the current environmental risks for my location, including flood, storm, and fire danger. Provide a concise summary and safety advice.";
            const response = await getGroundedResponse(prompt, location);
            setAnalysisResult(response.text);
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                setSources(groundingChunks as GroundingChunk[]);
            }
        } catch (err) {
            setError('Failed to get analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center p-4 pb-2 bg-background-light dark:bg-background-dark flex-shrink-0 z-10">
                <button onClick={() => navigate('/settings')} className="flex size-12 shrink-0 items-center justify-start text-slate-800 dark:text-white">
                    <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
                <h1 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Current Location</h1>
                <div className="flex w-12 items-center justify-end">
                    <button onClick={() => navigate('/analytics')} className="flex cursor-pointer items-center justify-center rounded-xl h-12 text-slate-800 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                    </button>
                </div>
            </header>
            <div className="flex-grow flex flex-col relative overflow-hidden bg-slate-200 dark:bg-slate-900">
                {!isLocationEnabled && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-8 text-center">
                        <span className="material-symbols-outlined text-white text-6xl mb-4">location_off</span>
                        <h2 className="text-white text-xl font-bold mb-2">Location Disabled</h2>
                        <p className="text-slate-300 mb-4">Please enable location services in the Settings tab to get local weather and risk analysis.</p>
                        <button onClick={() => navigate('/settings')} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">Go to Settings</button>
                    </div>
                )}
                <div className="flex-grow bg-[#a0c4ff] flex items-center justify-center relative map-placeholder">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                        <span className="material-symbols-outlined text-primary text-5xl drop-shadow-lg fill">location_on</span>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full animate-ping"></div>
                    </div>
                    <div className="absolute top-[10%] left-[5%] w-[40%] h-[30%] bg-risk-green/30 border-2 border-risk-green rounded-xl z-10 opacity-70"></div>
                    <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[40%] bg-risk-yellow/30 border-2 border-risk-yellow rounded-xl z-10 opacity-70"></div>
                    <div className="absolute top-[40%] left-[30%] w-[45%] h-[20%] bg-risk-red/30 border-2 border-risk-red rounded-xl z-10 opacity-70"></div>
                    <button
                        onClick={handleAnalyzeLocation}
                        disabled={isLoading || !location}
                        className="absolute bottom-4 right-4 bg-primary text-white flex items-center justify-center gap-2 py-3 px-4 rounded-full shadow-lg z-40 cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading && isSheetOpen ? (
                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <span className="material-symbols-outlined text-white text-lg">travel_explore</span>
                        )}
                        <span className="text-white text-base font-bold">Analyze Area</span>
                    </button>
                </div>
                <div className="absolute top-4 left-4 right-4 bg-background-light dark:bg-slate-800 p-3 rounded-xl shadow-lg z-20 grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">thermostat</span>
                        <p className="text-slate-800 dark:text-white text-lg font-bold">{weatherStats.temp}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Temp</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">humidity_mid</span>
                        <p className="text-slate-800 dark:text-white text-lg font-bold">{weatherStats.humidity}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Humidity</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">air</span>
                        <p className="text-slate-800 dark:text-white text-lg font-bold">{weatherStats.wind}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Wind</p>
                    </div>
                </div>
            </div>
             {isSheetOpen && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setIsSheetOpen(false)}>
                    <div className="w-full bg-background-light dark:bg-slate-800 rounded-t-2xl p-4 max-h-[75%] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4"></div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Local Risk Analysis</h3>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="ml-4 text-slate-600 dark:text-slate-400">Analyzing location...</p>
                            </div>
                        ) : error ? (
                             <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <div>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{analysisResult}</p>
                                {sources.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Sources</h4>
                                        <ul className="space-y-2">
                                            {sources.map((source, index) => {
                                                const link = source.maps || source.web;
                                                return link ? (
                                                    <li key={index}>
                                                        <a href={link.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-base">{source.maps ? 'map' : 'public'}</span>
                                                            {link.title}
                                                        </a>
                                                    </li>
                                                ) : null;
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapScreen;
