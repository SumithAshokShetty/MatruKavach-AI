"use client";

import React, { useState, useEffect } from "react";
import { socket } from "@/lib/api";
import { X, Bell, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Alert {
    id: string;
    mother_id: string;
    mother_name: string;
    content: string; 
    sender: string;
    is_urgent: boolean;
    priority?: string;
    timestamp: string;
}

export function LiveAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isOpen, setIsOpen] = useState(true); 

    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.on("new_notification", (data: any) => {
            console.log("New Notification:", data);

            setAlerts(prev => [
                {
                    id: data.id || Date.now().toString(),
                    mother_id: data.mother_id,
                    mother_name: data.mother_name,
                    content: data.content,
                    sender: data.sender,
                    is_urgent: data.is_urgent,
                    priority: data.priority || "RED",
                    timestamp: data.timestamp
                },
                ...prev
            ]);
        });

        return () => {
            socket.off("new_notification");
        };
    }, []);

    const removeAlert = (id: string, e: React.MouseEvent) => {
        e.preventDefault();  
        e.stopPropagation(); 
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    if (alerts.length === 0) return null; 

    return (
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="pointer-events-auto w-full"
                    >
                        <Link href={`/asha/mother/${alert.mother_id}`}>
                            <div className={`
                                p-4 rounded-xl shadow-lg border-l-4 backdrop-blur-md cursor-pointer transition-transform hover:scale-[1.02]
                                ${alert.priority === 'RED'
                                    ? 'bg-red-50/95 border-red-500 text-red-900 animate-pulse border-2 shadow-[0_4px_20px_rgba(239,68,68,0.3)]'
                                    : alert.priority === 'YELLOW'
                                        ? 'bg-yellow-50/95 border-yellow-500 text-yellow-900 shadow-[0_4px_15px_rgba(234,179,8,0.2)]'
                                        : 'bg-green-50/95 border-green-500 text-green-900 shadow-md'
                                }
                            `}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                        {alert.priority === 'RED' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                        {alert.priority === 'YELLOW' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                                        {alert.priority === 'GREEN' && <Bell className="w-4 h-4 text-green-600" />}
                                        {alert.mother_name}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={(e) => removeAlert(alert.id, e)}
                                        className="text-gray-400 hover:text-gray-600 p-1 -mr-2 -mt-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-sm line-clamp-2 mb-2 font-medium">
                                    "{alert.content}"
                                </p>
                                <div className="text-xs opacity-60 flex justify-between">
                                    <span>From: {alert.sender}</span>
                                    <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
