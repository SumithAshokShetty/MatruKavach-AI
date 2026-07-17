"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/components/LanguageContext";

import { API_BASE_URL } from "@/lib/api";

export default function DoctorDashboard() {
    const { t } = useLanguage();
    const [mothers, setMothers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/mothers`)
            .then(res => res.json())
            .then(data => {
                setMothers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch mothers:", err);
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
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">{mother.name}</h3>
                                                <p className="text-sm text-gray-500">ID: {mother.id}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                                Registered
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" /> <span>{mother.location || t("mother.noDocs").replace("documents uploaded yet.", "location provided")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-500">{t("common.age")}:</span> {mother.age} | {mother.gestational_age_weeks} {t("common.weeks")}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-500">{t("common.phone")}:</span> {mother.phone}
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

