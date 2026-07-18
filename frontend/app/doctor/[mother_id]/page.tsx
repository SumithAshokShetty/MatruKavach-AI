"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, Clock, Activity, FileText, Pill, FileUp, Apple, ClipboardList, CheckCircle2, MessageSquare, AlertCircle, RefreshCw, Mic } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/components/LanguageContext";
import { PatientQRCode } from "@/components/PatientQRCode";
import { VoiceAssistant } from "@/components/VoiceAssistant";

export default function DoctorPatientDetail() {
    const params = useParams();
    const router = useRouter();
    const motherId = params.mother_id as string;
    const { t } = useLanguage();

    const [mother, setMother] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [consultations, setConsultations] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("consultations");

    const [chatSummary, setChatSummary] = useState<string | null>(null);
    const [generatingSummary, setGeneratingSummary] = useState(false);

    const [isConsulting, setIsConsulting] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [consultForm, setConsultForm] = useState({
        systolic_bp: "", diastolic_bp: "", weight_kg: "", heart_rate: "",
        health_status: "Stable", observations: "", nutrition_plan: "", medication_plan: "",
        next_consultation_date: ""
    });

    const handleVoiceComplete = (data: any) => {
        setConsultForm(prev => {
            let statusVal = prev.health_status;
            if (data.status === "Stable") statusVal = "Stable";
            else if (data.status === "Critical") statusVal = "Critical Admission Required";
            else if (data.status === "Requires Attention") statusVal = "Monitor Closely";

            return {
                ...prev,
                systolic_bp: data.sys_bp !== undefined && data.sys_bp !== null ? String(data.sys_bp) : prev.systolic_bp,
                diastolic_bp: data.dia_bp !== undefined && data.dia_bp !== null ? String(data.dia_bp) : prev.diastolic_bp,
                weight_kg: data.weight_kg !== undefined && data.weight_kg !== null ? String(data.weight_kg) : prev.weight_kg,
                heart_rate: data.heart_rate !== undefined && data.heart_rate !== null ? String(data.heart_rate) : prev.heart_rate,
                health_status: statusVal,
                next_consultation_date: data.next_consultation_date !== undefined && data.next_consultation_date !== null ? String(data.next_consultation_date) : prev.next_consultation_date,
                observations: data.doctor_observations !== undefined && data.doctor_observations !== null ? String(data.doctor_observations) : prev.observations,
                medication_plan: data.medication_advice !== undefined && data.medication_advice !== null ? String(data.medication_advice) : prev.medication_plan,
                nutrition_plan: data.nutritional_advice !== undefined && data.nutritional_advice !== null ? String(data.nutritional_advice) : prev.nutrition_plan,
            };
        });
        setIsVoiceMode(false);
    };

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE_URL}/mother/${motherId}`).then(res => res.json()),
            fetch(`${API_BASE_URL}/mother/${motherId}/history`).then(res => res.json()),
            fetch(`${API_BASE_URL}/mother/${motherId}/consultations`).then(res => res.json()),
            fetch(`${API_BASE_URL}/mother/${motherId}/documents`).then(res => res.json())
        ])
            .then(([motherData, historyData, consultationData, documentData]) => {
                setMother(motherData);
                setHistory(historyData);
                setConsultations(Array.isArray(consultationData) ? consultationData : []);
                setDocuments(Array.isArray(documentData) ? documentData : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [motherId]);

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/chat/summary`);
            if (res.ok) {
                const data = await res.json();
                setChatSummary(data.summary);
            }
        } catch (e) {
            console.error("Failed to generate summary", e);
        } finally {
            setGeneratingSummary(false);
        }
    };

    const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("document_type", "Scanned Report");

        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/documents`, {
                method: "POST",
                body: formData
            });
            if (res.ok) {
                const newDoc = await res.json();
                setDocuments([newDoc, ...documents]);
            }
        } catch (err) {
            console.error("Failed to upload document", err);
        }
    };

    const submitConsultation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...consultForm,
                mother_id: motherId,
                systolic_bp: parseInt(consultForm.systolic_bp) || null,
                diastolic_bp: parseInt(consultForm.diastolic_bp) || null,
                weight_kg: parseFloat(consultForm.weight_kg) || null,
                heart_rate: parseInt(consultForm.heart_rate) || null,
                next_consultation_date: consultForm.next_consultation_date ? new Date(consultForm.next_consultation_date).toISOString() : null
            };

            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/consultations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newConsult = await res.json();
                setConsultations([newConsult, ...consultations]);
                setIsConsulting(false);
                setConsultForm({
                    systolic_bp: "", diastolic_bp: "", weight_kg: "", heart_rate: "",
                    health_status: "Stable", observations: "", nutrition_plan: "", medication_plan: "",
                    next_consultation_date: ""
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">{t("common.loading")}</div>;
    if (!mother) return <div className="text-center py-20 text-red-500">{t("mother.patientNotFound")}</div>;

    const tabs = [
        { id: "consultations", label: t("doctor.recommendations").replace("Doctor Clinical Directive", "Consultation & Rx"), icon: ClipboardList },
        { id: "assessments", label: t("mother.assessmentsTab"), icon: Activity },
        { id: "documents", label: t("mother.recordsTitle").replace("Health Records & Documents", "Medical Documents"), icon: FileText },
        { id: "chat", label: t("mother.chatTab"), icon: MessageSquare }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] font-body text-gray-900 pb-20">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-6xl">

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-heading font-bold">{mother.name}</h1>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 uppercase tracking-widest">
                                {t("common.active")}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {mother.location || t("mother.noDocs").replace("documents uploaded yet.", "location provided")}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> {t("common.age")}: {mother.age}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {mother.gestational_age_weeks} {t("common.weeks")}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 mt-4 md:mt-0">
                        <button onClick={() => { setActiveTab("consultations"); setIsConsulting(true); }} className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                            + {t("doctor.recommendations").replace("Doctor Clinical Directive", "New Consultation")}
                        </button>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-px hide-scrollbar scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-gray-900" : "text-gray-400"}`} /> {tab.label}
                        </button>
                    ))}
                </div>

                <div className={activeTab === "chat" ? "space-y-8" : "grid lg:grid-cols-3 gap-8 items-start"}>
                    <div className={activeTab === "chat" ? "" : "lg:col-span-2 space-y-8"}>

                    {activeTab === "consultations" && (
                        <div>
                            {isConsulting && (
                                <Card variant="glass" className="p-8 mb-8 border-t-4 border-t-gray-900 shadow-md bg-white">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <ClipboardList className="w-5 h-5" /> Start Clinical Consultation
                                        </h3>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setIsVoiceMode(false)}
                                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${!isVoiceMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                Manual Fill
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsVoiceMode(true)}
                                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${isVoiceMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                <Mic className="w-4 h-4 text-[#C5A880]" /> Voice Fill
                                            </button>
                                        </div>
                                    </div>

                                    {isVoiceMode ? (
                                        <div className="mb-6">
                                            <VoiceAssistant
                                                portalType="doctor"
                                                onComplete={(data) => {
                                                    handleVoiceComplete(data);
                                                    setTimeout(() => {
                                                        const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
                                                        submitConsultation(syntheticEvent);
                                                    }, 100);
                                                }}
                                                onCancel={() => setIsVoiceMode(false)}
                                                onChange={(key, val) => {
                                                    setConsultForm(prev => {
                                                        let statusVal = prev.health_status;
                                                        if (key === "status") {
                                                            if (val === "Stable") statusVal = "Stable";
                                                            else if (val === "Critical") statusVal = "Critical Admission Required";
                                                            else if (val === "Requires Attention") statusVal = "Monitor Closely";
                                                        }
                                                        return {
                                                            ...prev,
                                                            systolic_bp: key === "sys_bp" ? String(val) : prev.systolic_bp,
                                                            diastolic_bp: key === "dia_bp" ? String(val) : prev.diastolic_bp,
                                                            weight_kg: key === "weight_kg" ? String(val) : prev.weight_kg,
                                                            heart_rate: key === "heart_rate" ? String(val) : prev.heart_rate,
                                                            health_status: statusVal,
                                                            next_consultation_date: key === "next_consultation_date" ? String(val) : prev.next_consultation_date,
                                                            observations: key === "doctor_observations" ? String(val) : prev.observations,
                                                            medication_plan: key === "medication_advice" ? String(val) : prev.medication_plan,
                                                            nutrition_plan: key === "nutritional_advice" ? String(val) : prev.nutrition_plan,
                                                        };
                                                    });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <form onSubmit={submitConsultation} className="space-y-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div><label className="text-xs font-bold text-gray-500 uppercase">Sys BP</label><input type="number" required value={consultForm.systolic_bp} onChange={e => setConsultForm({ ...consultForm, systolic_bp: e.target.value })} className="w-full mt-1 p-2 border rounded-md" placeholder="120" /></div>
                                                <div><label className="text-xs font-bold text-gray-500 uppercase">Dia BP</label><input type="number" required value={consultForm.diastolic_bp} onChange={e => setConsultForm({ ...consultForm, diastolic_bp: e.target.value })} className="w-full mt-1 p-2 border rounded-md" placeholder="80" /></div>
                                                <div><label className="text-xs font-bold text-gray-500 uppercase">{t("assess.weight")}</label><input type="number" step="0.1" value={consultForm.weight_kg} onChange={e => setConsultForm({ ...consultForm, weight_kg: e.target.value })} className="w-full mt-1 p-2 border rounded-md" placeholder="65" /></div>
                                                <div><label className="text-xs font-bold text-gray-500 uppercase">Heart Rate</label><input type="number" value={consultForm.heart_rate} onChange={e => setConsultForm({ ...consultForm, heart_rate: e.target.value })} className="w-full mt-1 p-2 border rounded-md" placeholder="80" /></div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase">{t("common.status")}</label>
                                                    <select value={consultForm.health_status} onChange={e => setConsultForm({ ...consultForm, health_status: e.target.value })} className="w-full mt-1 p-2 border rounded-md">
                                                        <option>Stable</option>
                                                        <option>Monitor Closely</option>
                                                        <option>High Risk</option>
                                                        <option>Critical Admission Required</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Next Consultation Date</label>
                                                    <input type="date" value={consultForm.next_consultation_date} onChange={e => setConsultForm({ ...consultForm, next_consultation_date: e.target.value })} className="w-full mt-1 p-2 border rounded-md" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t("doctor.recPlaceholder").replace("Enter clinical recommendation or prescription...", "Doctor's Observations")}</label>
                                                <textarea required value={consultForm.observations} onChange={e => setConsultForm({ ...consultForm, observations: e.target.value })} className="w-full mt-1 p-3 border rounded-md min-h-[100px]" placeholder="Note symptoms, sonography results, etc." />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Pill className="w-3 h-3" /> {t("common.medicationAdvice")}</label>
                                                    <textarea value={consultForm.medication_plan} onChange={e => setConsultForm({ ...consultForm, medication_plan: e.target.value })} className="w-full mt-1 p-3 border rounded-md min-h-[100px]" placeholder="1. Iron Tablets (1 daily)&#10;2. Calcium (1 daily)" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Apple className="w-3 h-3" /> {t("common.nutritionalAdvice")}</label>
                                                    <textarea value={consultForm.nutrition_plan} onChange={e => setConsultForm({ ...consultForm, nutrition_plan: e.target.value })} className="w-full mt-1 p-3 border rounded-md min-h-[100px]" placeholder="Increase green leafy vegetables..." />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                                <button type="button" onClick={() => setIsConsulting(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">{t("common.cancel")}</button>
                                                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm">{t("common.save")}</button>
                                            </div>
                                        </form>
                                    )}
                                </Card>
                            )}
                            <div className="space-y-4">
                                <h3 className="font-heading font-medium text-xl text-gray-800 tracking-tight">{t("mother.historyTitle").replace("History", "Consultation History")}</h3>
                                {consultations.length === 0 ? <p className="text-gray-500 italic p-8 bg-white rounded-xl border border-gray-100 text-center">No past consultations recorded.</p> : (
                                    consultations.map(c => (
                                        <Card key={c.id} className="p-6 bg-white shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
                                            <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-gray-100 pb-4 gap-4">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                        {new Date(c.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.health_status === 'High Risk' || c.health_status?.includes('Critical') ? 'bg-red-100 text-red-800' :
                                                            c.health_status === 'Monitor Closely' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {c.health_status || "Stable"}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-600">BP: {c.systolic_bp}/{c.diastolic_bp} | Wt: {c.weight_kg}kg</span>
                                                    </div>
                                                </div>
                                                {c.next_consultation_date && (
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Next Visit</p>
                                                        <p className="text-sm font-semibold flex items-center justify-end gap-1"><Calendar className="w-4 h-4" /> {new Date(c.next_consultation_date).toLocaleDateString()}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Observations</h4>
                                                    <p className="text-sm text-gray-800">{c.observations}</p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    {c.medication_plan && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-900 uppercase mb-2 flex items-center gap-1"><Pill className="w-3 h-3" /> {t("common.medicationAdvice")}</h4>
                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.medication_plan}</p>
                                                        </div>
                                                    )}
                                                    {c.nutrition_plan && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-900 uppercase mb-2 flex items-center gap-1"><Apple className="w-3 h-3" /> {t("common.nutritionalAdvice")}</h4>
                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.nutrition_plan}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ASSESSMENTS TAB */}
                    {activeTab === "assessments" && (
                        <div className="space-y-6">
                            <h3 className="font-heading text-xl font-medium tracking-tight">On-Ground ASHA Assessments</h3>
                            {history.length === 0 ? <p className="text-gray-500">No assessments found.</p> : (
                                history.map((record, i) => {
                                    const date = new Date(record.risk.timestamp);
                                    let flags = [];
                                    try { flags = JSON.parse(record.risk.clinical_flags) || []; } catch (e) { }

                                    return (
                                        <Card key={i} className="p-6 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                                            {record.risk.risk_level === "High Risk" && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium mb-1">{date.toLocaleString()}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                            ${record.risk.risk_level === "High Risk" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                            {record.risk.risk_level}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Score: {record.risk.overall_risk_score}/10</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl mb-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 font-medium">BP:</span>
                                                    <span className="ml-2 font-bold">{record.vitals.systolic_bp}/{record.vitals.diastolic_bp} mmHg</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 font-medium">{t("assess.glucose").replace("Random Glucose (mg/dL)", "Glucose")}:</span>
                                                    <span className="ml-2 font-bold">{record.vitals.glucose} mg/dL</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 font-medium">{t("assess.hemoglobin").replace("Hemoglobin (g/dL)", "Hemoglobin")}:</span>
                                                    <span className="ml-2 font-bold">{record.vitals.hemoglobin} g/dL</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 font-medium">{t("assess.weight").replace("Weight (kg)", "Weight")}:</span>
                                                    <span className="ml-2 font-bold">{record.vitals.weight_kg} kg</span>
                                                </div>
                                            </div>

                                            {flags.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> {t("common.clinicalFlags")}</p>
                                                    <ul className="list-none space-y-1">
                                                        {flags.map((flag: string, idx: number) => (
                                                            <li key={idx} className="text-sm flex items-start gap-2 bg-red-50 text-red-800 px-3 py-2 rounded-md">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                                                {flag}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* ASHA Consultation Note */}
                                            {record.risk.asha_consultation_note && (
                                                <div className="mt-4 bg-blue-50/70 p-4 rounded-xl border border-blue-100/50 shadow-sm relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
                                                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                        <MessageSquare className="w-4 h-4 text-blue-500" /> {t("assess.consultNote")}
                                                    </h4>
                                                    <p className="text-sm text-gray-700 italic leading-relaxed">
                                                        "{record.risk.asha_consultation_note}"
                                                    </p>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* DOCUMENTS TAB */}
                    {activeTab === "documents" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-heading text-xl font-medium tracking-tight">{t("mother.recordsTitle")}</h3>
                                <div>
                                    <input type="file" id="docUpload" className="hidden" onChange={handleDocumentUpload} />
                                    <label htmlFor="docUpload" className="cursor-pointer bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                                        <FileUp className="w-4 h-4" /> {t("mother.uploadReport")}
                                    </label>
                                </div>
                            </div>

                            {documents.length === 0 ? <p className="text-gray-500 bg-white p-8 rounded-xl text-center border border-gray-100">{t("mother.noDocs")}</p> : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.map(doc => (
                                        <Card key={doc.id} className="p-4 flex items-center gap-4 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-semibold text-gray-900 truncate">{doc.file_name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CHAT TAB */}
                    {activeTab === "chat" && (
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                                <ChatWindow motherId={motherId} />
                            </div>
                            <div className="lg:col-span-1">
                                <Card className="p-6 bg-white/50 backdrop-blur-md sticky top-6 border border-gray-200">
                                    <h3 className="font-heading font-medium text-lg mb-2 flex items-center gap-2">
                                        <SparklesIcon /> AI Medical Summary
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                        Generate a structured clinical summary of the patient's conversations over the past two weeks to quickly catch up on reported symptoms or emergencies.
                                    </p>

                                    <button
                                        onClick={handleGenerateSummary}
                                        disabled={generatingSummary}
                                        className="w-full mb-6 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-3 rounded-xl border border-indigo-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {generatingSummary ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                                        {generatingSummary ? "Analyzing Chat Logs..." : "Generate AI Summary"}
                                    </button>

                                    {chatSummary && (
                                        <div className="mt-4 p-5 bg-white rounded-xl border border-indigo-100 shadow-[0_4px_20px_rgba(99,102,241,0.05)] text-sm text-gray-800 leading-relaxed font-medium">
                                            <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                                                <CheckCircle2 className="w-4 h-4" /> Summary Ready
                                            </div>
                                            {chatSummary}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    )}
                    </div>
                    {activeTab !== "chat" && (
                        <div className="lg:col-span-1">
                            {mother && (
                                <PatientQRCode motherId={mother.id} patientName={mother.name} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SparklesIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    )
}

