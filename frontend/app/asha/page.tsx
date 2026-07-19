"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Search, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/components/LanguageContext";
import { API_BASE_URL } from "@/lib/api";
import { AshaRouteTimeline } from "@/components/AshaRouteTimeline";
import { useAuth } from "@/components/AuthContext";

export default function AshaDashboard() {
    const { user } = useAuth();
    const { t, tDynamic } = useLanguage();
    const [mothers, setMothers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"mothers" | "route">("mothers");

    useEffect(() => {
        fetch(`${API_BASE_URL}/mothers`)
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                const sorted = [...data].sort((a: any, b: any) => {
                    const idA = a.id || "";
                    const idB = b.id || "";
                    return idA.localeCompare(idB);
                });
                setMothers(sorted);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch mothers:", err);
                setError(err.message || "Failed to fetch");
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">{t("asha.dashboardTitle")}</h1>
                    <p className="text-gray-500">{t("asha.dashboardSub")}</p>
                </div>
            </div>

            {/* ASHA Tab Selector */}
            <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-none">
                <button
                    onClick={() => setActiveTab("mothers")}
                    className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === "mothers"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    {tDynamic("My Patients")}
                </button>
                <button
                    onClick={() => setActiveTab("route")}
                    className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === "route"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    {tDynamic("Today's Visit Route")}
                </button>
            </div>

            {activeTab === "route" ? (
                <AshaRouteTimeline ashaId={user?.associated_id || "asha-1"} />
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 w-full">
                            <Input placeholder={t("asha.searchPlaceholder")} className="bg-white w-full" />
                        </div>
                        <Button variant="secondary" className="w-full sm:w-auto">{t("common.filter")}</Button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">{t("mother.patientNotFound").replace("Patient not found.", "Database Connection Offline")}</p>
                                <p className="text-sm mt-0.5 text-red-700">Please make sure the backend server is running locally.</p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-900 animate-pulse">{t("asha.loadingProfiles")}</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mothers.length === 0 && (
                                <div className="col-span-3 text-center py-10 text-gray-500">
                                    {t("asha.noRecords")}
                                </div>
                            )}

                            {mothers.map((mother) => (
                                <Link key={mother.id} href={`/asha/mother/${mother.id}`}>
                                    <Card variant="solid" className="p-6 hover:border-primary/50 transition-colors cursor-pointer h-full group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors">{tDynamic(mother.name)}</h3>
                                                <p className="text-sm text-gray-500">ID: {tDynamic(mother.id)}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                {t("common.active")}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" /> <span>{tDynamic(mother.location) || tDynamic("N/A")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-500">{t("common.age")}:</span> {tDynamic(mother.age)} | {tDynamic(mother.gestational_age_weeks)} {t("common.weeks")}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
