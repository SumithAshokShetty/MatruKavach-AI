"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Shield, RefreshCw, Users, UserPlus, Activity, CheckCircle2, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

import { API_BASE_URL } from "@/lib/api";

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState<any>(null);
    const [mothers, setMothers] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [ashas, setAshas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, mothersRes, docsRes, ashasRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/stats`),
                fetch(`${API_BASE_URL}/mothers`),
                fetch(`${API_BASE_URL}/doctors`),
                fetch(`${API_BASE_URL}/asha_workers`),
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (mothersRes.ok) setMothers(await mothersRes.json());
            if (docsRes.ok) setDoctors(await docsRes.json());
            if (ashasRes.ok) setAshas(await ashasRes.json());
        } catch (e) {
            console.error("Failed to load admin data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (motherId: string, doctorId: string | null, ashaId: string | null) => {
        try {
            const payload: any = {};
            if (doctorId !== null) payload.doctor_id = doctorId;
            if (ashaId !== null) payload.asha_id = ashaId;

            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/assign_hr`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to assign.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading && !stats) return <div className="min-h-screen flex items-center justify-center font-body text-gray-500">{t("common.loading")}</div>;

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "doctors", label: t("nav.doctorPortal").replace(" Portal", "s") },
        { id: "ashas", label: t("nav.ashaPortal").replace(" Portal", " Workers") },
        { id: "mothers", label: "Mothers" }
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
                            <AlertTriangle className="w-4 h-4" /> {t("doctor.clinicalAlerts").replace("Clinical Alerts", "Approvals")} (0)
                        </div>
                        <button onClick={fetchData} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors">
                            <RefreshCw className="w-4 h-4" /> {t("admin.agentStatus").replace("Status", "Refresh")}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 border-l-4 border-l-pink-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">{t("admin.totalMothers")}</p>
                        <p className="text-4xl font-black text-gray-900">{stats?.total_mothers}</p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-indigo-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">{t("nav.doctorPortal").replace(" Portal", "s")}</p>
                        <p className="text-4xl font-black text-gray-900">{stats?.total_doctors}</p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">{t("nav.ashaPortal").replace(" Portal", " Workers")}</p>
                        <p className="text-4xl font-black text-gray-900">{stats?.total_ashas}</p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-green-500 shadow-sm">
                        <p className="text-sm font-bold text-gray-500 mb-1">Fully Assigned</p>
                        <p className="text-4xl font-black text-gray-900">{stats?.fully_assigned}</p>
                    </Card>
                </div>

                <div className="flex overflow-x-auto gap-8 mb-8 border-b border-gray-200 pb-px hide-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 font-bold text-sm transition-all whitespace-nowrap border-b-2 px-1 ${activeTab === tab.id
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-800"
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
                                <Activity className="w-5 h-5 text-gray-400" /> System Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <p className="text-4xl font-black text-green-700">{stats?.fully_assigned}</p>
                                    <p className="text-xs font-bold text-green-800 mt-2 uppercase tracking-wider">Fully Assigned</p>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <p className="text-4xl font-black text-yellow-700">{stats?.needs_assignment}</p>
                                    <p className="text-xs font-bold text-yellow-800 mt-2 uppercase tracking-wider">Needs Assignment</p>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <p className="text-4xl font-black text-indigo-700">{stats?.total_doctors}</p>
                                    <p className="text-xs font-bold text-indigo-800 mt-2 uppercase tracking-wider">{t("admin.agentStatus").replace("Status", "Active")} Doctors</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <p className="text-4xl font-black text-purple-700">{stats?.total_ashas}</p>
                                    <p className="text-xs font-bold text-purple-800 mt-2 uppercase tracking-wider">{t("admin.agentStatus").replace("Status", "Active")} ASHA Workers</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-indigo-500" /> Doctor Workload
                                    </h3>
                                    <div className="space-y-5">
                                        {stats?.doctor_workloads.map((doc: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-32 text-sm font-medium text-gray-800 truncate">{doc.name}</div>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((doc.count / 10) * 100, 100)}%` }} />
                                                </div>
                                                <div className="w-8 text-right text-sm font-black text-indigo-600">{doc.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <UserPlus className="w-4 h-4 text-purple-500" /> ASHA Worker Workload
                                    </h3>
                                    <div className="space-y-5">
                                        {stats?.asha_workloads.map((asha: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-32 text-sm font-medium text-gray-800 truncate">{asha.name}</div>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((asha.count / 10) * 100, 100)}%` }} />
                                                </div>
                                                <div className="w-8 text-right text-sm font-black text-purple-600">{asha.count}</div>
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
                                    <h2 className="text-lg font-bold text-gray-900">Manage Mothers ({mothers.length})</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("admin.name")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("common.phone")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("common.location")}</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ASHA Worker</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">{t("common.status")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {mothers.map((m) => (
                                                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4 text-sm font-bold text-gray-900">{m.name}</td>
                                                    <td className="p-4 text-sm text-gray-500">{m.phone}</td>
                                                    <td className="p-4 text-sm text-gray-500">{m.location || "N/A"}</td>
                                                    <td className="p-4">
                                                        <select
                                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                            value={m.assigned_asha_id || ""}
                                                            onChange={(e) => handleAssign(m.id, null, e.target.value)}
                                                        >
                                                            <option value="" disabled>-- Select --</option>
                                                            {ashas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        <select
                                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                            value={m.assigned_doctor_id || ""}
                                                            onChange={(e) => handleAssign(m.id, e.target.value, null)}
                                                        >
                                                            <option value="" disabled>-- Select --</option>
                                                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {m.assigned_doctor_id && m.assigned_asha_id ? (
                                                            <span className="text-green-500 flex items-center justify-center gap-1 text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /> OK</span>
                                                        ) : (
                                                            <span className="text-yellow-500 flex items-center justify-center gap-1 text-xs font-bold uppercase"><AlertTriangle className="w-4 h-4" /> PEND</span>
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
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Manage ASHA Workers ({ashas.length})</h2>
                            <div className="space-y-4">
                                {ashas.map((asha) => {
                                    const assignedCount = stats?.asha_workloads.find((a: any) => a.id === asha.id)?.count || 0;
                                    return (
                                        <Card key={asha.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{asha.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{asha.location} • {asha.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-6 mt-2 sm:mt-0">
                                                <div className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold border border-purple-100">
                                                    {assignedCount} mothers
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
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Manage Doctors ({doctors.length})</h2>
                            <div className="space-y-4">
                                {doctors.map((doc) => {
                                    const assignedCount = stats?.doctor_workloads.find((d: any) => d.id === doc.id)?.count || 0;
                                    return (
                                        <Card key={doc.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{doc.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{doc.specialization} • {doc.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-6 mt-2 sm:mt-0">
                                                <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                                                    {assignedCount} patients
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
                </AnimatePresence>
            </div>
        </div>
    );
}

