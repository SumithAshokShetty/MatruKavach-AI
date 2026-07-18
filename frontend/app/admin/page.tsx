"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { RefreshCw, Users, UserPlus, Activity, CheckCircle2, AlertTriangle, Edit2, Trash2, MapPin, Compass, Clock, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

import { API_BASE_URL } from "@/lib/api";

export default function AdminDashboard() {
    const { t, tDynamic } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState<any>(null);
    const [mothers, setMothers] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [ashas, setAshas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Notification & Toast States
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // Modal states for listing patients by metric
    const [selectedMetricList, setSelectedMetricList] = useState<any[] | null>(null);
    const [selectedMetricTitle, setSelectedMetricTitle] = useState("");

    // Optimization States
    const [selectedAshaId, setSelectedAshaId] = useState("");
    const [optimizing, setOptimizing] = useState(false);
    const [optimizedResult, setOptimizedResult] = useState<any>(null);

    const openMetricModal = (title: string, list: any[]) => {
        setSelectedMetricTitle(title);
        setSelectedMetricList(list);
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [statsRes, mothersRes, docsRes, ashasRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/stats`),
                fetch(`${API_BASE_URL}/mothers`),
                fetch(`${API_BASE_URL}/doctors`),
                fetch(`${API_BASE_URL}/asha_workers`),
            ]);

            if (statsRes.ok && mothersRes.ok && docsRes.ok && ashasRes.ok) {
                setStats(await statsRes.json());
                const mothersData = await mothersRes.json();
                const sortedMothers = [...mothersData].sort((a: any, b: any) => {
                    const idA = a.id || "";
                    const idB = b.id || "";
                    return idA.localeCompare(idB);
                });
                setMothers(sortedMothers);
                setDoctors(await docsRes.json());
                setAshas(await ashasRes.json());
            }
        } catch (e) {
            console.error("Failed to load dashboard data", e);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (motherId: string, docId: string | null, ashaId: string | null) => {
        // Optimistically update local UI state immediately (0ms latency)
        setMothers(prev => prev.map(m => 
            m.id === motherId ? { ...m, assigned_doctor_id: docId, assigned_asha_id: ashaId } : m
        ));

        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/assign_hr`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctor_id: docId, asha_id: ashaId })
            });
            if (res.ok) {
                // Silently refresh stats in background
                fetchData(true);
            } else {
                // Rollback on API error
                fetchData(false);
            }
        } catch (e) {
            console.error(e);
            // Rollback on network error
            fetchData(false);
        }
    };

    // Trigger Google OR-Tools optimization engine
    const handleOptimizeRoute = async () => {
        if (!selectedAshaId) return;
        setOptimizing(true);
        
        // Find mothers assigned to this ASHA worker
        const assignedMothers = mothers.filter(m => m.assigned_asha_id === selectedAshaId).map(m => m.id);
        if (assignedMothers.length === 0) {
            setNotification({
                message: tDynamic("No patients are currently assigned to this ASHA worker. Please assign mothers first."),
                type: "error"
            });
            setOptimizing(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/dispatch/optimize-schedule`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    asha_worker_id: selectedAshaId,
                    mother_ids: assignedMothers
                })
            });
            if (res.ok) {
                const data = await res.json();
                setOptimizedResult(data.optimized_route);
            }
        } catch (err) {
            console.error("Failed to run route optimization:", err);
        } finally {
            setOptimizing(false);
        }
    };

    if (loading && !stats) return <div className="min-h-screen flex items-center justify-center font-body text-gray-500">{t("common.loading")}</div>;

    const tabs = [
        { id: "overview", label: tDynamic("Overview") },
        { id: "doctors", label: tDynamic("Doctors") },
        { id: "ashas", label: tDynamic("ASHA Workers") },
        { id: "mothers", label: tDynamic("Mothers") },
        { id: "schedules", label: tDynamic("Shift Schedules") }
    ];

    return (
        <div className="min-h-screen relative font-body selection:bg-accent/30 pb-20">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">{t("admin.dashboardTitle")}</h1>
                        <p className="text-gray-500">{t("admin.dashboardSub")}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-yellow-200">
                            <AlertTriangle className="w-4 h-4" /> {tDynamic("Approvals")} ({tDynamic(0)})
                        </div>
                        <button onClick={() => fetchData()} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors">
                            <RefreshCw className="w-4 h-4" /> {tDynamic("Refresh")}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 border-l-4 border-l-pink-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">{t("admin.totalMothers")}</p>
                        <p className="text-4xl font-black text-gray-900">{tDynamic(stats?.total_mothers)}</p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-indigo-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">{tDynamic("Doctors")}</p>
                        <p className="text-4xl font-black text-gray-900">{tDynamic(stats?.total_doctors)}</p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">{tDynamic("ASHA Workers")}</p>
                        <p className="text-4xl font-black text-gray-900">{tDynamic(stats?.total_ashas)}</p>
                    </Card>
                    <Card 
                        onClick={() => openMetricModal("Critical Risk Patients", stats?.critical_cases_list || [])}
                        className="p-6 border-l-4 border-l-green-500 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-95 bg-white"
                    >
                        <p className="text-sm font-bold text-gray-500 mb-1">{tDynamic("Critical Cases")}</p>
                        <p className="text-4xl font-black text-gray-900">{tDynamic(stats?.critical_cases || 0)}</p>
                    </Card>
                </div>

                {/* Navigation Tab Bar */}
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setOptimizedResult(null);
                            }}
                            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <Activity className="w-5 h-5 text-gray-400" /> {tDynamic("System Overview")}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div 
                                    onClick={() => openMetricModal("Fully Assigned Patients", stats?.fully_assigned_list || [])}
                                    className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    <p className="text-4xl font-black text-green-700">{tDynamic(stats?.fully_assigned)}</p>
                                    <p className="text-xs font-bold text-green-800 mt-2 uppercase tracking-wider">{tDynamic("Fully Assigned")}</p>
                                </div>
                                <div 
                                    onClick={() => openMetricModal("Patients Needing Assignment", stats?.needs_assignment_list || [])}
                                    className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    <p className="text-4xl font-black text-yellow-700">{tDynamic(stats?.needs_assignment)}</p>
                                    <p className="text-xs font-bold text-yellow-800 mt-2 uppercase tracking-wider">{tDynamic("Needs Assignment")}</p>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <p className="text-4xl font-black text-indigo-700">{tDynamic(stats?.total_doctors)}</p>
                                    <p className="text-xs font-bold text-indigo-800 mt-2 uppercase tracking-wider">{tDynamic("Active")} {tDynamic("Doctors")}</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <p className="text-4xl font-black text-purple-700">{tDynamic(stats?.total_ashas)}</p>
                                    <p className="text-xs font-bold text-purple-800 mt-2 uppercase tracking-wider">{tDynamic("Active")} {tDynamic("ASHA Workers")}</p>
                                </div>
                            </div>

                            {/* ASHA Visits & Patient Risk Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                                <Card className="p-6 shadow-sm border border-gray-100 bg-white">
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-500" /> {tDynamic("ASHA Shift Visits")}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div 
                                            onClick={() => openMetricModal("Completed ASHA Visits", stats?.visits_completed_list || [])}
                                            className="p-4 bg-green-50/50 rounded-xl border border-green-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-2xl font-black text-green-700">{tDynamic(stats?.visits_completed || 0)}</p>
                                            <p className="text-xs font-bold text-green-800 uppercase tracking-wider mt-1">{tDynamic("Completed")}</p>
                                        </div>
                                        <div 
                                            onClick={() => openMetricModal("In Progress ASHA Visits", stats?.visits_in_progress_list || [])}
                                            className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-2xl font-black text-blue-700">{tDynamic(stats?.visits_in_progress || 0)}</p>
                                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mt-1">{tDynamic("In Progress")}</p>
                                        </div>
                                        <div 
                                            onClick={() => openMetricModal("Pending ASHA Visits", stats?.visits_pending_list || [])}
                                            className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-2xl font-black text-yellow-700">{tDynamic(stats?.visits_pending || 0)}</p>
                                            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mt-1">{tDynamic("Pending")}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 shadow-sm border border-gray-100 bg-white">
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-pink-500" /> {tDynamic("Risk Level Distribution")}
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div 
                                            onClick={() => openMetricModal("Critical Risk Patients", stats?.critical_cases_list || [])}
                                            className="p-3 bg-red-50 rounded-xl border border-red-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-xl font-black text-red-700">{tDynamic(stats?.critical_cases || 0)}</p>
                                            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mt-1">{tDynamic("Critical")}</p>
                                        </div>
                                        <div 
                                            onClick={() => openMetricModal("High Risk Patients", stats?.high_risk_cases_list || [])}
                                            className="p-3 bg-orange-50 rounded-xl border border-orange-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-xl font-black text-orange-700">{tDynamic(stats?.high_risk_cases || 0)}</p>
                                            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider mt-1">{tDynamic("High")}</p>
                                        </div>
                                        <div 
                                            onClick={() => openMetricModal("Moderate Risk Patients", stats?.medium_risk_cases_list || [])}
                                            className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-xl font-black text-yellow-700">{tDynamic(stats?.medium_risk_cases || 0)}</p>
                                            <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider mt-1">{tDynamic("Moderate")}</p>
                                        </div>
                                        <div 
                                            onClick={() => openMetricModal("Low Risk Patients", stats?.low_risk_cases_list || [])}
                                            className="p-3 bg-green-50 rounded-xl border border-green-100 cursor-pointer hover:scale-[1.05] transition-transform active:scale-95"
                                        >
                                            <p className="text-xl font-black text-green-700">{tDynamic(stats?.low_risk_cases || 0)}</p>
                                            <p className="text-[10px] font-bold text-green-800 uppercase tracking-wider mt-1">{tDynamic("Low")}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-indigo-500" /> {tDynamic("Doctor Workload")}
                                    </h3>
                                    <div className="space-y-5">
                                        {stats?.doctor_workloads.map((doc: any, i: number) => (
                                            <div key={doc.id} className="flex items-center justify-between gap-4">
                                                <div className="w-32 text-sm font-medium text-gray-800 truncate">{tDynamic(doc.name)}</div>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((doc.count / 10) * 100, 100)}%` }} />
                                                </div>
                                                <div className="w-8 text-right text-sm font-black text-indigo-600">{tDynamic(doc.count)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <UserPlus className="w-4 h-4 text-purple-500" /> {tDynamic("ASHA Worker Workload")}
                                    </h3>
                                    <div className="space-y-5">
                                        {stats?.asha_workloads.map((asha: any, i: number) => (
                                            <div key={asha.id} className="flex items-center justify-between gap-4">
                                                <div className="w-32 text-sm font-medium text-gray-800 truncate">{tDynamic(asha.name)}</div>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((asha.count / 10) * 100, 100)}%` }} />
                                                </div>
                                                <div className="w-8 text-right text-sm font-black text-purple-600">{tDynamic(asha.count)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "mothers" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <Card className="p-0 shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-900">{tDynamic("Manage Mothers")} ({tDynamic(mothers.length)})</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/75 border-b border-gray-100">
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("admin.name")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("common.phone")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("common.location")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{tDynamic("ASHA Worker")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{tDynamic("Doctor")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">{t("common.status")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {mothers.map((m) => (
                                                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4 text-sm font-bold text-gray-900">{tDynamic(m.name)}</td>
                                                    <td className="p-4 text-sm text-gray-500">{tDynamic(m.phone)}</td>
                                                    <td className="p-4 text-sm text-gray-500">{tDynamic(m.location || "N/A")}</td>
                                                    <td className="p-4">
                                                        <select
                                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                            value={m.assigned_asha_id || ""}
                                                            onChange={(e) => handleAssign(m.id, m.assigned_doctor_id || null, e.target.value)}
                                                        >
                                                            <option value="" disabled>{tDynamic("-- Select --")}</option>
                                                            {ashas.map(a => <option key={a.id} value={a.id}>{tDynamic(a.name)}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        <select
                                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                            value={m.assigned_doctor_id || ""}
                                                            onChange={(e) => handleAssign(m.id, e.target.value, m.assigned_asha_id || null)}
                                                        >
                                                            <option value="" disabled>{tDynamic("-- Select --")}</option>
                                                            {doctors.map(d => <option key={d.id} value={d.id}>{tDynamic(d.name)}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {m.assigned_doctor_id && m.assigned_asha_id ? (
                                                            <span className="text-green-500 flex items-center justify-center gap-1 text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /> {tDynamic("OK")}</span>
                                                        ) : (
                                                            <span className="text-yellow-500 flex items-center justify-center gap-1 text-xs font-bold uppercase"><AlertTriangle className="w-4 h-4" /> {tDynamic("PEND")}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "ashas" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">{tDynamic("Manage ASHA Workers")} ({tDynamic(ashas.length)})</h2>
                            <div className="space-y-4">
                                {ashas.map((asha) => {
                                    const assignedCount = stats?.asha_workloads.find((a: any) => a.id === asha.id)?.count || 0;
                                    return (
                                        <Card key={asha.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{tDynamic(asha.name)}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{tDynamic(asha.location)} • {tDynamic(asha.phone)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-6 mt-2 sm:mt-0">
                                                <div className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold border border-purple-100">
                                                    {tDynamic(assignedCount)} {tDynamic("mothers")}
                                                </div>
                                                <div className="flex gap-2 text-gray-400">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                    <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "doctors" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">{tDynamic("Manage Doctors")} ({tDynamic(doctors.length)})</h2>
                            <div className="space-y-4">
                                {doctors.map((doc) => {
                                    const assignedCount = stats?.doctor_workloads.find((d: any) => d.id === doc.id)?.count || 0;
                                    return (
                                        <Card key={doc.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{tDynamic(doc.name)}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{tDynamic(doc.specialization)} • {tDynamic(doc.phone)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-6 mt-2 sm:mt-0">
                                                <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                                                    {tDynamic(assignedCount)} {tDynamic("patients")}
                                                </div>
                                                <div className="flex gap-2 text-gray-400">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                    <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "schedules" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">{tDynamic("Optimize ASHA Worker Routes")}</h2>
                            
                            <Card className="p-6 border border-gray-100 shadow-sm bg-white">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{tDynamic("Select ASHA Worker:")}</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                    <select
                                        value={selectedAshaId}
                                        onChange={(e) => {
                                            setSelectedAshaId(e.target.value);
                                            setOptimizedResult(null);
                                        }}
                                        className="p-3 border border-gray-200 rounded-xl outline-none bg-white shadow-sm flex-1"
                                    >
                                        <option value="">{tDynamic("-- Select ASHA Worker --")}</option>
                                        {ashas.map(a => <option key={a.id} value={a.id}>{tDynamic(a.name)}</option>)}
                                    </select>
                                    
                                    <button
                                        onClick={handleOptimizeRoute}
                                        disabled={optimizing || !selectedAshaId}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {optimizing ? tDynamic("Running OR-Tools...") : tDynamic("Optimize Shift Route")}
                                    </button>
                                </div>
                            </Card>

                            {optimizedResult && (
                                <Card className="p-6 border border-gray-100 shadow-sm bg-white">
                                    <h3 className="font-bold text-gray-900 text-lg mb-6">{tDynamic("Optimized Routing Timeline")}</h3>
                                    <div className="space-y-6 relative pl-6 border-l-2 border-indigo-100 ml-4">
                                        {optimizedResult.map((stop: any) => (
                                            <div key={stop.sequence} className="relative group">
                                                <div className="absolute -left-[33px] top-1.5 w-5 h-5 rounded-full border-2 bg-indigo-600 border-indigo-700 flex items-center justify-center shadow-sm">
                                                    <span className="text-[10px] font-black text-white">{stop.sequence}</span>
                                                </div>
                                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">{stop.mother_name}</h4>
                                                        <div className="flex gap-4 text-xs font-semibold text-gray-500 mt-1.5">
                                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Stop {stop.sequence}</span>
                                                            <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> {stop.distance_km} km</span>
                                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {stop.estimated_service_time_mins} mins</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                                                            {stop.travel_mode === "walking" ? "🚶 Walk" : "🛵 Scooter"}
                                                        </span>
                                                        <a
                                                            href={stop.google_maps_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                        >
                                                            <Navigation className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setNotification({
                                                    message: tDynamic("Route successfully dispatched to the ASHA worker's portal!"),
                                                    type: "success"
                                                });
                                                setOptimizedResult(null);
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-sm"
                                        >
                                            {tDynamic("Dispatch Route to Field")}
                                        </button>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Custom Floating Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0"
                    >
                        <div className={`p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-start justify-between gap-4 border ${
                            notification.type === "success" 
                                ? "bg-green-50 border-green-100 text-green-800" 
                                : notification.type === "error"
                                ? "bg-red-50 border-red-100 text-red-800"
                                : "bg-blue-50 border-blue-100 text-blue-800"
                        }`}>
                            <div className="flex-1">
                                <p className="text-sm font-bold leading-snug">{notification.message}</p>
                            </div>
                            <button 
                                onClick={() => setNotification(null)}
                                className="text-[10px] font-black uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity bg-black/5 hover:bg-black/10 px-2 py-1 rounded"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Metric Detailed List Modal */}
            <AnimatePresence>
                {selectedMetricList && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900">{selectedMetricTitle}</h3>
                                <button 
                                    onClick={() => setSelectedMetricList(null)}
                                    className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl transition-colors font-bold text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-gray-50/50">
                                {selectedMetricList.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-6">No mothers match this category.</p>
                                ) : (
                                    selectedMetricList.map((m: any, idx: number) => (
                                        <div key={m.id || idx} className="p-4 bg-white rounded-2xl flex justify-between items-center border border-gray-100 shadow-sm">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">ID: {m.id || "N/A"}</p>
                                            </div>
                                            {m.asha_name ? (
                                                <span className="text-[10px] bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold border border-purple-100">
                                                    ASHA: {m.asha_name}
                                                </span>
                                            ) : m.location ? (
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">
                                                    📍 {m.location}
                                                </span>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button 
                                    onClick={() => setSelectedMetricList(null)}
                                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
