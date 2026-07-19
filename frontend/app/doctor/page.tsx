"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPin, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/components/LanguageContext";

import { API_BASE_URL } from "@/lib/api";

export default function DoctorDashboard() {
    const { t, tDynamic } = useLanguage();
    const [mothers, setMothers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/mothers`)
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                const sorted = [...data].sort((a, b) => a.id.localeCompare(b.id));
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
        <div className="min-h-screen font-body selection:bg-accent/30 flex flex-col">
            <Header />
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-gray-900">{t("doctor.dashboardTitle")}</h1>
                            <p className="text-gray-500">Access patient records, consultations, and medical histories.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 w-full">
                            <Input placeholder={t("doctor.recPlaceholder").replace("Enter clinical recommendation or prescription...", "Search patient by name or ID...")} className="bg-white/60 backdrop-blur-sm border-gray-200 w-full" />
                        </div>
                        <button className="bg-gray-900 w-full sm:w-auto hover:bg-black text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-all">
                            <Search className="w-4 h-4" /> {t("common.filter").replace("Filter", "Search")}
                        </button>
                    </div>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">{t("mother.patientNotFound").replace("Patient not found.", "Database Connection Offline")}</p>
                                <p className="text-sm mt-0.5 text-red-700">Please make sure the backend server is running locally (e.g. by running start_server.bat in the backend folder).</p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-900 animate-pulse font-medium">{t("mother.uploading").replace("Uploading...", t("asha.loadingProfiles"))}</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mothers.length === 0 && (
                                <div className="col-span-3 text-center py-10 text-gray-500">
                                    No records found.
                                </div>
                            )}

                            {mothers.map((mother) => (
                                <Link key={mother.id} href={`/doctor/${mother.id}`}>
                                    <Card variant="solid" className="p-6 hover:border-gray-300 transition-all cursor-pointer h-full group bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">{tDynamic(mother.name)}</h3>
                                                <p className="text-sm text-gray-500">ID: {tDynamic(mother.id)}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                                Registered
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" /> <span>{tDynamic(mother.location) || tDynamic("N/A")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-500">{t("common.age")}:</span> {tDynamic(mother.age)} | {tDynamic(mother.gestational_age_weeks)} {t("common.weeks")}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-500">{t("common.phone")}:</span> {tDynamic(mother.phone)}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

