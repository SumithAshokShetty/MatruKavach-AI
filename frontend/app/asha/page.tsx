"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Search, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

import { API_BASE_URL } from "@/lib/api";

export default function AshaDashboard() {
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">ASHA Dashboard</h1>
                    <p className="text-gray-500">Manage mother profiles and assessments</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 w-full">
                    <Input placeholder="Search by name or ID..." className="bg-white w-full" />
                </div>
                <Button variant="secondary" className="w-full sm:w-auto">Filter</Button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-900 animate-pulse">Loading Patient Profiles...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mothers.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-gray-500">
                            No records found. Please seed the database or add a new mother.
                        </div>
                    )}

                    {mothers.map((mother) => (
                        <Link key={mother.id} href={`/asha/mother/${mother.id}`}>
                            <Card variant="solid" className="p-6 hover:border-primary/50 transition-colors cursor-pointer h-full group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors">{mother.name}</h3>
                                        <p className="text-sm text-gray-500">ID: {mother.id}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        Active
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" /> <span>{mother.location || "Location not provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-500">Age:</span> {mother.age} | {mother.gestational_age_weeks} Weeks
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
