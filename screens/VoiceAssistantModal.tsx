
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connectLive, decode, decodeAudioData, createAudioBlob } from '../services/geminiService';
import type { LiveSession, LiveServerMessage } from '@google/genai';

interface VoiceAssistantModalProps {
    onClose: () => void;
}

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);

    const stopConversation = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        setIsListening(false);
    }, []);

    const startConversation = async () => {
        setIsListening(true);
        setTranscript(['Listening...']);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support audio recording.');
            return;
        }

        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            let nextStartTime = 0;
            let currentInputTranscription = '';
            let currentOutputTranscription = '';

            sessionPromiseRef.current = connectLive({
                onopen: async () => {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaStreamSourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
                    scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createAudioBlob(inputData);
                        if (sessionPromiseRef.current) {
                            sessionPromiseRef.current.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        }
                    };

                    mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(audioContextRef.current!.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscription += message.serverContent.outputTranscription.text;
                    }
                    if (message.serverContent?.inputTranscription) {
                        currentInputTranscription += message.serverContent.inputTranscription.text;
                        setTranscript(prev => [`You: ${currentInputTranscription}`, ...prev.slice(1)]);
                    }
                    if(message.serverContent?.turnComplete) {
                        setTranscript(prev => [`AI: ${currentOutputTranscription}`, `You: ${currentInputTranscription}`, ...prev.slice(1)]);
                        currentInputTranscription = '';
                        currentOutputTranscription = '';
                    }

                    const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (audioData) {
                        const decodedAudio = decode(audioData);
                        const audioBuffer = await decodeAudioData(decodedAudio, outputAudioContextRef.current!, 24000, 1);
                        const source = outputAudioContextRef.current!.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContextRef.current!.destination);
                        
                        const currentTime = outputAudioContextRef.current!.currentTime;
                        const startTime = Math.max(currentTime, nextStartTime);
                        source.start(startTime);
                        nextStartTime = startTime + audioBuffer.duration;
                    }
                },
                onerror: (e) => {
                    console.error('Live API Error:', e);
                    setTranscript(prev => ['Error connecting. Please try again.', ...prev]);
                    stopConversation();
                },
                onclose: () => {
                     console.log('Live API connection closed.');
                }
            });
        } catch (err) {
            console.error('Error starting conversation:', err);
            setTranscript(prev => ['Could not start microphone.', ...prev]);
            setIsListening(false);
        }
    };

    useEffect(() => {
        return () => { // Cleanup on unmount
            stopConversation();
        };
    }, [stopConversation]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative w-full max-w-md h-full bg-background-dark text-white flex flex-col p-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-white">
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>
                <h2 className="text-xl font-bold text-center mt-4 mb-6">Voice Assistant</h2>

                <div className="flex-grow bg-black/30 rounded-lg p-4 overflow-y-auto flex flex-col-reverse">
                    <div className="space-y-4">
                        {transcript.map((line, i) => (
                            <p key={i} className={`text-sm ${line.startsWith('You:') ? 'text-blue-300' : 'text-gray-200'}`}>{line}</p>
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0 pt-6 flex flex-col items-center">
                    <button 
                        onClick={isListening ? stopConversation : startConversation}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-primary'}`}
                    >
                        <span className="material-symbols-outlined text-4xl text-white">
                            {isListening ? 'stop' : 'mic'}
                        </span>
                        {isListening && <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping"></div>}
                    </button>
                    <p className="mt-4 text-sm text-gray-400">{isListening ? 'Tap to stop' : 'Tap to speak'}</p>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistantModal;
