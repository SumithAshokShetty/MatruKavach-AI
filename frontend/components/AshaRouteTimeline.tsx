"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, CheckCircle, Clock, AlertTriangle, AlertCircle, Compass } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/components/LanguageContext";

interface RouteStop {
    id: number;
    mother_id: string;
    mother_name: string;
    visit_sequence: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    google_maps_link: string;
    travel_mode: "walking" | "two-wheeler";
    distance_km: number;
    risk_score: number;
    risk_level: string;
    estimated_service_time_mins: number;
}

interface AshaRouteTimelineProps {
    ashaId: string;
}

export function AshaRouteTimeline({ ashaId }: AshaRouteTimelineProps) {
    const { t } = useLanguage();
    const [stops, setStops] = useState<RouteStop[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Dynamic digit translator
    const formatNumber = (num: number): string => {
        return String(num);
    };

    // Load active daily route sequence
    const loadRoute = async () => {
        setLoading(true);
        try {
            // Check local cache first if offline
            if (!navigator.onLine) {
                const cached = localStorage.getItem(`route_${ashaId}`);
                if (cached) {
                    setStops(JSON.parse(cached));
                    setIsOnline(false);
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(`${API_BASE_URL}/dispatch/route/${ashaId}`);
            if (res.ok) {
                const data = await res.json();
                setStops(data);
                localStorage.setItem(`route_${ashaId}`, JSON.stringify(data));
                setIsOnline(true);
            }
        } catch (err) {
            console.error("Failed to load route sequence:", err);
            // Fallback to cache on exception
            const cached = localStorage.getItem(`route_${ashaId}`);
            if (cached) {
                setStops(JSON.parse(cached));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoute();

        // Register online/offline status event bindings
        const handleOnline = () => {
            setIsOnline(true);
            flushSyncQueue();
        };
        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [ashaId]);

    // Handle offline synchronization queue flushing
    const flushSyncQueue = async () => {
        const queueRaw = localStorage.getItem(`sync_queue_${ashaId}`);
        if (!queueRaw) return;

        const queue = JSON.parse(queueRaw);
        if (queue.length === 0) return;

        setSyncing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/dispatch/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(queue)
            });
            if (res.ok) {
                localStorage.removeItem(`sync_queue_${ashaId}`);
                loadRoute(); // Reload fresh database states
            }
        } catch (err) {
            console.error("Failed to sync offline updates:", err);
        } finally {
            setSyncing(false);
        }
    };

    // Update stop status with offline queue fallback
    const handleStatusUpdate = async (stopId: number, nextStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
        // Optimistically update local UI and cache
        const updatedStops = stops.map(s => s.id === stopId ? { ...s, status: nextStatus } : s);
        setStops(updatedStops);
        localStorage.setItem(`route_${ashaId}`, JSON.stringify(updatedStops));

        if (!navigator.onLine) {
            // Queue action locally
            const queueRaw = localStorage.getItem(`sync_queue_${ashaId}`);
            const queue = queueRaw ? JSON.parse(queueRaw) : [];
            
            // Remove previous updates for same ID to keep minified payload
            const filtered = queue.filter((q: any) => q.schedule_id !== stopId);
            filtered.push({ schedule_id: stopId, status: nextStatus });
            localStorage.setItem(`sync_queue_${ashaId}`, JSON.stringify(filtered));
            
            setIsOnline(false);
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/dispatch/route/${stopId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus })
            });
        } catch (err) {
            console.error("Failed to submit status update:", err);
            // Queue on network failure
            const queueRaw = localStorage.getItem(`sync_queue_${ashaId}`);
            const queue = queueRaw ? JSON.parse(queueRaw) : [];
            queue.push({ schedule_id: stopId, status: nextStatus });
            localStorage.setItem(`sync_queue_${ashaId}`, JSON.stringify(queue));
        }
    };

    // Toggle travel mode manually (updates maps navigation link parameter instantly)
    const handleTravelModeToggle = (stopId: number, mode: "walking" | "two-wheeler") => {
        const updatedStops = stops.map(s => {
            if (s.id === stopId) {
                const mapsBase = s.google_maps_link.split("&travelmode=")[0];
                return {
                    ...s,
                    travel_mode: mode,
                    google_maps_link: `${mapsBase}&travelmode=${mode}`
                };
            }
            return s;
        });
        setStops(updatedStops);
        localStorage.setItem(`route_${ashaId}`, JSON.stringify(updatedStops));
    };

    if (loading) return <div className="text-center py-8 text-gray-500 font-medium">Loading optimized timeline...</div>;

    return (
        <div className="space-y-6">
            {/* Status Strip */}
            <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded-xl">
                <div>
                    <h3 className="font-bold text-gray-800 text-sm">Shift Schedule Sequence</h3>
                    <p className="text-xs text-gray-400 mt-1">ASHA Base Coordinates Depot Start</p>
                </div>
                <div className="flex items-center gap-3">
                    {syncing && <span className="text-[10px] text-indigo-600 animate-pulse font-bold">Syncing offline logs...</span>}
                    {!isOnline ? (
                        <span className="text-xs px-2.5 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full font-bold uppercase tracking-wider">
                            ⚠️ Offline Mode
                        </span>
                    ) : (
                        <span className="text-xs px-2.5 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full font-bold uppercase tracking-wider">
                            🟢 Online Sync
                        </span>
                    )}
                </div>
            </div>

            {stops.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl p-8 bg-white">
                    No active dispatched route schedules found for today.
                </div>
            ) : (
                <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8 ml-3 py-2">
                    {stops.map((stop) => {
                        const isCritical = stop.risk_score >= 8;
                        const isCompleted = stop.status === "COMPLETED";

                        return (
                            <div key={stop.id} className="relative group">
                                {/* Chronological Node Indicator dot */}
                                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                                    isCompleted 
                                        ? 'bg-green-500 border-green-600' 
                                        : isCritical 
                                            ? 'bg-red-500 border-red-600 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                            : 'bg-white border-indigo-400'
                                }`}>
                                    <span className="text-[8px] font-black text-white">{formatNumber(stop.visit_sequence)}</span>
                                </div>

                                <div className={`p-5 bg-white border rounded-xl shadow-sm transition-all ${
                                    isCompleted 
                                        ? 'opacity-70 border-gray-200' 
                                        : isCritical 
                                            ? 'border-red-300 ring-2 ring-red-500/10' 
                                            : 'border-gray-200 hover:border-indigo-200'
                                }`}>
                                    
                                    {/* Critical Triage alert badge */}
                                    {isCritical && (
                                        <div className="mb-3 px-3 py-1 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-lg flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
                                            <AlertCircle className="w-4 h-4 shrink-0" /> Critical Case (Risk {formatNumber(stop.risk_score)}/10)
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{stop.mother_name}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Stop {formatNumber(stop.visit_sequence)}</span>
                                                <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> Distance: {formatNumber(stop.distance_km)} km</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Service: {formatNumber(stop.estimated_service_time_mins)} min</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                            {/* Dynamic manual transport selector */}
                                            <select
                                                value={stop.travel_mode}
                                                onChange={(e) => handleTravelModeToggle(stop.id, e.target.value as any)}
                                                className="p-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-gray-50 text-gray-700 outline-none"
                                            >
                                                <option value="walking">🚶 Walk</option>
                                                <option value="two-wheeler">🛵 Scooter</option>
                                            </select>

                                            {/* Google maps direction CTA link */}
                                            <a
                                                href={stop.google_maps_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg transition-all flex items-center justify-center"
                                                title="Open Map Directions"
                                            >
                                                <Navigation className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Action Status buttons */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center">
                                        <div className="text-xs text-gray-400 font-bold uppercase">Status: {stop.status}</div>
                                        <div className="flex gap-2">
                                            {stop.status !== "IN_PROGRESS" && stop.status !== "COMPLETED" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(stop.id, "IN_PROGRESS")}
                                                    className="px-3 py-1.5 text-xs border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold transition-colors"
                                                >
                                                    Start Visit
                                                </button>
                                            )}
                                            {stop.status !== "COMPLETED" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(stop.id, "COMPLETED")}
                                                    className="px-3 py-1.5 text-xs bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" /> Mark Visited
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
