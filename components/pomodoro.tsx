"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';
import { MinusIcon, PauseIcon, PlayIcon, PlusIcon, RefreshCwIcon } from "lucide-react";

type TimerStatus = "idle" | "running" | "paused";
type SessionType = "work" | "break";

interface PomodoroState {
    workDuration: number;
    breakDuration: number;
    currentTime: number;
    currentSession: SessionType;
    timerStatus: TimerStatus;
}

const PomodoroComponent = () => {
    const [state, setState] = useState<PomodoroState>({
        workDuration: 25 * 60,
        breakDuration: 5 * 60,
        currentTime: 25 * 60,
        currentSession: "work",
        timerStatus: "idle"
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Function to switch between "work" and "break" sessions
    const handleSessionSwitch = (): void => {
        setState((prevState) => {
            const isWorkSession = prevState.currentSession === "work";
            return {
                ...prevState,
                currentSession: isWorkSession ? "break" : "work",
                currentTime: isWorkSession ? prevState.breakDuration : prevState.workDuration,
            };
        });
    };

    // useEffect to manage the timer
    useEffect(() => {
        if (state.timerStatus === "running" && state.currentTime > 0) {
            timerRef.current = setInterval(() => {
                setState((prevState) => ({
                    ...prevState,
                    currentTime: prevState.currentTime - 1
                }));
            }, 1000);
        } else if (state.currentTime === 0) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleSessionSwitch();
        }

        return () => clearInterval(timerRef.current as NodeJS.Timeout);
    }, [state.timerStatus, state.currentTime]);

    // Start and Pause button handler
    const handleStartPause = (): void => {
        if (state.timerStatus === "running") {
            setState((prevState) => ({
                ...prevState,
                timerStatus: "paused",
            }));
            clearInterval(timerRef.current as NodeJS.Timeout);
        } else {
            setState((prevState) => ({
                ...prevState,
                timerStatus: "running",
            }));
        }
    };

    // Reset button handler
    const handleReset = (): void => {
        clearInterval(timerRef.current as NodeJS.Timeout);
        setState((prevState) => ({
            ...prevState,
            currentTime: prevState.workDuration,
            currentSession: "work",
            timerStatus: "idle",
        }));
    };

    // Duration change handler
    const handleDurationChange = (type: SessionType, increment: boolean): void => {
        setState((prevState) => {
            const durationChange = increment ? 60 : -60;
            if (type === "work") {
                return {
                    ...prevState,
                    workDuration: Math.max(60, prevState.workDuration + durationChange),
                    currentTime: prevState.currentSession === "work" ? Math.max(60, prevState.workDuration + durationChange) : prevState.currentTime,
                };
            } else {
                return {
                    ...prevState,
                    breakDuration: Math.max(60, prevState.breakDuration + durationChange),
                    currentTime: prevState.currentSession === "break" ? Math.max(60, prevState.breakDuration + durationChange) : prevState.currentTime,
                };
            }
        });
    };

    // Helper function to format time
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <Card className="w-full max-w-md p-8 bg-gray-800 shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-center text-white mb-4">Pomodoro Timer</h1>
            <p className="text-center text-gray-400 mb-6">Stay focused using the Pomodoro Technique.</p>
            
            <div className="text-center">
                <div className={`text-3xl font-semibold mb-2 ${state.currentSession === "work" ? "text-white" : "text-green-400"}`}>
                    {state.currentSession === "work" ? "Work" : "Break"} Session
                </div>
                <div className="text-6xl font-bold text-white mb-6">
                    {formatTime(state.currentTime)}
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={() => handleDurationChange("work", false)} className="text-white border-gray-500 hover:border-white">
                        <MinusIcon className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDurationChange("work", true)} className="text-white border-gray-500 hover:border-white">
                        <PlusIcon className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleStartPause} className="text-white border-gray-500 hover:border-white">
                        {state.timerStatus === "running" ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleReset} className="text-white border-gray-500 hover:border-white">
                        <RefreshCwIcon className="h-6 w-6" />
                    </Button>
                </div>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-white border-gray-500 hover:border-white">What is the Pomodoro Technique?</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border border-gray-700 text-gray-300 max-w-xl p-4 shadow-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white text-lg font-bold">
                                Pomodoro Technique Explained
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-400 mt-2">
                                The Pomodoro Technique is a time management method where work is divided into 25-minute focused intervals, separated by 5-minute breaks. 
                                <ul className="mt-2 list-disc list-inside">
                                    <li>Work for 25 minutes on a single task.</li>
                                    <li>Take a 5-minute break.</li>
                                    <li>Repeat this process 4 times.</li>
                                    <li>Take a 20-30 minute break after 4 rounds.</li>
                                </ul>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="text-gray-400 hover:text-white">Close</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <a href="https://todoist.com/productivity-methods/pomodoro-technique" target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-white text-gray-800 hover:bg-gray-200">Learn More</Button>
                                </a>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    </div>
    
    );
};

export default PomodoroComponent;
