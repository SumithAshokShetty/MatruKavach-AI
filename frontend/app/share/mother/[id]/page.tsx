"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, User, Calendar, ShieldCheck, HeartPulse, Activity, FileText, ClipboardList, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { translateDynamic } from "@/lib/translations";

function SharedContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();

  const motherId = params.id as string;
  const token = searchParams.get("token") || "";

  const [sharedData, setSharedData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSharedRecord() {
      if (!token) {
        setError("Missing security verification token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/share/mother?token=${token}`);
        
        if (res.status === 401) {
          // If unauthenticated scan, redirect to login page with callback
          if (!authLoading && !user) {
            const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/login?redirect=${redirectPath}`);
            return;
          }
          setError("This secure sharing link has expired or is invalid.");
        } else if (!res.ok) {
          setError("Failed to fetch verified medical records.");
        } else {
          const data = await res.json();
          setSharedData(data);
        }
      } catch (err) {
        console.error("Shared record fetch failed:", err);
        setError("Network connection issue while retrieving records.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchSharedRecord();
    }
  }, [token, authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-3">
        <HeartPulse className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Decrypting secure health records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <Card variant="solid" className="p-8 max-w-md bg-white border border-gray-100 shadow-lg rounded-2xl flex flex-col items-center">
          <ShieldAlert className="w-12 h-12 text-alert mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Button onClick={() => router.push("/")} className="w-full">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const { mother, history, consultations } = sharedData || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        
        {/* Verification Alert */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-xs">
          <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Cryptographically Verified Record</p>
            <p className="text-xs text-green-700 font-medium">This electronic record is signed by MatruKavach AI and valid for clinical reference.</p>
          </div>
        </div>

        {/* Patient Profile Card */}
        {mother && (
          <Card variant="solid" className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 font-bold text-xl uppercase">
                  {mother.name.substring(0, 2)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{mother.name}</h1>
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mt-1">
                    <span>ID: {mother.mother_id}</span>
                    <span>•</span>
                    <span>{mother.age} {t("mother.age")}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {mother.village}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Vitals History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> {t("mother.historyTitle")}
          </h2>
          {(!history || history.length === 0) ? (
            <p className="text-gray-500 italic p-6 bg-white rounded-xl border text-center">No health checks registered.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {history.map((record: any, idx: number) => {
                const date = new Date(record.vitals.timestamp);
                return (
                  <Card key={idx} variant="glass" className="p-5 bg-white border border-gray-150 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {record.risk && (
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            record.risk.risk_level === 'High Risk' ? 'bg-red-50 text-red-800 border-red-100' :
                            record.risk.risk_level === 'Moderate' ? 'bg-yellow-50 text-yellow-800 border-yellow-100' :
                            'bg-green-50 text-green-800 border-green-100'
                          }`}>
                            {translateDynamic(record.risk.risk_level, language)}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-semibold text-gray-700">
                        <div>BP: <span className="font-bold text-gray-900">{record.vitals.systolic}/{record.vitals.diastolic}</span></div>
                        <div>Weight: <span className="font-bold text-gray-900">{record.vitals.weight} kg</span></div>
                        <div>Hb: <span className="font-bold text-gray-900">{record.vitals.hemoglobin} g/dL</span></div>
                        <div>Glucose: <span className="font-bold text-gray-900">{record.vitals.glucose} mg/dL</span></div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Clinical Consultations Logs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" /> clinical Consultations Logs
          </h2>
          {(!consultations || consultations.length === 0) ? (
            <p className="text-gray-500 italic p-6 bg-white rounded-xl border text-center">No doctor consultations recorded.</p>
          ) : (
            <div className="space-y-4">
              {consultations.map((c: any, idx: number) => {
                const date = new Date(c.created_at);
                return (
                  <Card key={idx} variant="solid" className="p-6 bg-white border border-gray-100 shadow-xs">
                    <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">Status: {c.health_status}</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">Observations</span>
                        <p className="text-gray-700 leading-relaxed">{c.observations}</p>
                      </div>
                      {(c.medication_plan || c.nutrition_plan) && (
                        <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                          {c.medication_plan && (
                            <div>
                              <span className="font-bold text-gray-900 uppercase block mb-1">Medication Plan</span>
                              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{c.medication_plan}</p>
                            </div>
                          )}
                          {c.nutrition_plan && (
                            <div>
                              <span className="font-bold text-gray-900 uppercase block mb-1">Nutrition Plan</span>
                              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{c.nutrition_plan}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SecureSharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex justify-center items-center text-gray-500 font-medium">Loading secure sharing framework...</div>}>
      <SharedContent />
    </Suspense>
  );
}
