"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MapPin, ThermometerSun, Activity, HeartPulse, CheckCircle, Droplets, Wind, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { API_BASE_URL } from "@/lib/api";

function AssessmentContent() {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [locationCoords, setLocationCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [locationName, setLocationName] = useState(t("common.loading"));
    const [envData, setEnvData] = useState<any>(null);
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);
    const [consultationNote, setConsultationNote] = useState("");
    const [noteSaving, setNoteSaving] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);

    const [formData, setFormData] = useState({
        motherId: searchParams.get("motherId") || "MK-2024-001",
        name: "Patient", 
        systolic: "",
        diastolic: "",
        weight: "",
        hemoglobin: "",
        glucose: "",
        otherSymptoms: "",
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLocationCoords({ lat, lon });

                    try {
                        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                        if (geoRes.ok) {
                            const geoData = await geoRes.json();
                            setLocationName(geoData.address?.suburb || geoData.address?.city || geoData.address?.town || "Current Location");
                        } else setLocationName("GPS Active");
                    } catch (e) {
                        setLocationName("GPS Active");
                    }

                    try {
                        const envRes = await fetch(`${API_BASE_URL}/env_data?lat=${lat}&lon=${lon}`);
                        if (envRes.ok) setEnvData(await envRes.json());
                    } catch (e) {
                        console.error("Failed to load env data");
                    }
                },
                (err) => {
                    console.error("Geo Error Code:", err.code, "Message:", err.message);
                    setLocationCoords({ lat: 19.0760, lon: 72.8777 });
                    setLocationName("Mumbai (Fallback)");
                }
            );
        }
    }, [searchParams, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        setConsultationNote("");
        setNoteSaved(false);

        try {
            const response = await fetch(`${API_BASE_URL}/assess`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mother_id: formData.motherId,
                    systolic_bp: Number(formData.systolic),
                    diastolic_bp: Number(formData.diastolic),
                    weight_kg: Number(formData.weight),
                    hemoglobin: Number(formData.hemoglobin),
                    glucose: Number(formData.glucose),
                    heart_rate: 80, 
                    extra_symptoms: formData.otherSymptoms,
                    temperature_c: envData?.temperature_c || 30,
                    heat_index: envData?.heat_index || 30,
                    aqi: envData?.aqi_pm25 || 50,
                    chemical_exposure: envData?.chemical_exposure || 2
                }),
            });

            if (!response.ok) throw new Error("Assessment failed");
            const data = await response.json();

            data.clinical_flags = typeof data.clinical_flags === 'string' ? JSON.parse(data.clinical_flags) : data.clinical_flags;
            data.environmental_flags = typeof data.environmental_flags === 'string' ? JSON.parse(data.environmental_flags) : data.environmental_flags;
            data.nutrition_advice = typeof data.nutrition_advice === 'string' ? JSON.parse(data.nutrition_advice) : data.nutrition_advice;
            data.medication_reminders = typeof data.medication_reminders === 'string' ? JSON.parse(data.medication_reminders) : data.medication_reminders;

            setResult(data);
        } catch (err) {
            setError("Failed to connect to AI Orchestrator. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConsultation = async () => {
        if (!result?.id || !consultationNote) return;
        setNoteSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/assessment/${result.id}/consultation`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: consultationNote })
            });
            if (res.ok) {
                setNoteSaved(true);
            }
        } catch (e) {
            console.error("Failed to save note", e);
        } finally {
            setNoteSaving(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case "LOW": return "bg-green-100 text-green-800 border-green-200";
            case "MODERATE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200";
            case "CRITICAL": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-4xl font-heading font-extrabold text-primary tracking-tight">{t("assess.title")}</h1>
                <div className="flex items-center gap-2 text-primary/70 mt-3 font-medium bg-white/50 w-fit px-3 py-1.5 rounded-full border border-primary/10 shadow-sm">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>{t("assess.location")}: {locationName}</span>
                </div>
            </div>

            {envData && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4 bg-blue-50/50 border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                        <div>
                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">{t("assess.temp")}</p>
                            <p className="text-xl font-bold text-blue-900">{envData.temperature_c}°C</p>
                            <p className="text-xs text-blue-600/70">{t("assess.feelsLike")} {envData.heat_index}°C</p>
                        </div>
                        <ThermometerSun className="w-8 h-8 text-blue-300 self-end sm:self-auto" />
                    </Card>
                    <Card className="p-4 bg-orange-50/50 border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                        <div>
                            <p className="text-xs font-bold text-orange-800 uppercase tracking-wider">{t("assess.aqi")}</p>
                            <p className="text-xl font-bold text-orange-900">{Math.round(envData.aqi_pm25)}</p>
                            <p className="text-xs text-orange-600/70">{t("assess.pmLevels")}</p>
                        </div>
                        <Wind className="w-8 h-8 text-orange-300 self-end sm:self-auto" />
                    </Card>
                    <Card className="p-4 bg-purple-50/50 border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                        <div>
                            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider">{t("assess.toxin")}</p>
                            <p className="text-xl font-bold text-purple-900">{envData.chemical_exposure.toFixed(1)}/10</p>
                            <p className="text-xs text-purple-600/70">{t("assess.estRisk")}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-purple-300 self-end sm:self-auto" />
                    </Card>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                <Card variant="solid" className="p-8 h-fit shadow-lg shadow-primary/5 rounded-2xl bg-white border border-gray-100">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Activity className="w-6 h-6 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">{t("assess.clinicalForm")}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-red-500" /> {t("assess.bp")}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    placeholder={t("assess.systolic")}
                                    type="number"
                                    value={formData.systolic}
                                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                                    className="bg-gray-50/50 w-full"
                                    required
                                />
                                <Input
                                    placeholder={t("assess.diastolic")}
                                    type="number"
                                    value={formData.diastolic}
                                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                                    className="bg-gray-50/50 w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" /> {t("assess.weight")}
                                </label>
                                <Input
                                    placeholder="e.g. 65"
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="bg-gray-50/50 w-full"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-red-600" /> {t("assess.hemoglobin")}
                                </label>
                                <Input
                                    placeholder="e.g. 11.5"
                                    type="number"
                                    step="0.1"
                                    value={formData.hemoglobin}
                                    onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })}
                                    className="bg-gray-50/50 w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <ThermometerSun className="w-4 h-4 text-orange-500" /> {t("assess.glucose")}
                            </label>
                            <Input
                                placeholder="e.g. 100"
                                type="number"
                                value={formData.glucose}
                                onChange={(e) => setFormData({ ...formData, glucose: e.target.value })}
                                className="bg-gray-50/50"
                                required
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-purple-500" /> {t("assess.symptoms")}
                            </label>
                            <textarea
                                className="w-full h-24 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-inner resize-none placeholder:text-gray-400"
                                placeholder={t("assess.symptomsPlaceholder")}
                                value={formData.otherSymptoms}
                                onChange={(e) => setFormData({ ...formData, otherSymptoms: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full py-6 text-lg rounded-xl mt-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold" isLoading={loading}>
                            {loading ? t("assess.analyzing") : t("assess.runAssessment")}
                        </Button>
                        {error && <p className="text-alert text-sm text-center mt-3 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
                    </form>
                </Card>

                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card variant="glass" className="p-6 border-t-4 border-t-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary">{t("assess.resultTitle")}</h2>
                                        <p className="text-sm text-gray-500">AI Logic: Clinical x Environmental</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl font-bold border ${getRiskColor(result.risk_level)}`}>
                                        {result.risk_level} ({result.overall_risk_score}/10)
                                    </div>
                                </div>

                                <div className="mb-6 space-y-3 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" /> AI Clinical Justification
                                    </h3>
                                    <p className="text-gray-700 text-sm italic border-l-2 border-primary/40 pl-3">
                                        "{result.clinical_justification || 'Standard clinical rules applied.'}"
                                    </p>

                                    {result.environmental_impact && (
                                        <div className="pt-2">
                                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                                <ThermometerSun className="w-4 h-4 text-orange-500" /> Environmental Impact
                                            </h3>
                                            <p className="text-orange-800 text-sm mt-1 bg-orange-100 px-3 py-1.5 rounded-md inline-block">
                                                {result.environmental_impact}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mb-6">
                                    {result.clinical_flags.length > 0 && (
                                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-red-500" /> {t("assess.clinicalFlags")}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.clinical_flags.map((flag: string, i: number) => (
                                                    <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-red-200 text-red-700">
                                                        {flag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {result.environmental_flags.length > 0 && (
                                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                                            <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                                <ThermometerSun className="w-4 h-4" /> {t("assess.envFlags")}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.environmental_flags.map((flag: string, i: number) => (
                                                    <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-orange-200 text-orange-700">
                                                        {flag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {result.nutrition_advice && typeof result.nutrition_advice === 'object' && !Array.isArray(result.nutrition_advice) ? (
                                        Object.entries(result.nutrition_advice).map(([categoryName, adviceList]: [string, any], idx) => (
                                            <div key={idx}>
                                                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600" /> {categoryName}
                                                </h3>
                                                <ul className="space-y-2">
                                                    {Array.isArray(adviceList) && adviceList.map((advice: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
                                                            <div className="min-w-[4px] h-full bg-accent rounded-full" />
                                                            {advice}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <div>
                                            <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" /> {t("assess.nutAdvice")}
                                            </h3>
                                            <ul className="space-y-2">
                                                {Array.isArray(result.nutrition_advice) && result.nutrition_advice.map((advice: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
                                                        <div className="min-w-[4px] h-full bg-accent rounded-full" />
                                                        {advice}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card variant="glass" className="p-6 mt-8 border-t-4 border-t-blue-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{t("assess.consultNote")}</h2>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Record your direct observations and advice given to the mother based on the AI Risk Analysis.
                                </p>
                                <textarea
                                    className="w-full h-32 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none placeholder:text-gray-400"
                                    placeholder={t("assess.consultPlaceholder")}
                                    value={consultationNote}
                                    onChange={(e) => setConsultationNote(e.target.value)}
                                    disabled={noteSaved}
                                />
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={handleSaveConsultation}
                                        className="font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                                        variant={noteSaved ? "secondary" : "primary"}
                                        isLoading={noteSaving}
                                        disabled={noteSaved || !consultationNote}
                                    >
                                        {noteSaved ? t("assess.noteSaved") : t("assess.saveNote")}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function AssessmentPage() {
    return (
        <Suspense fallback={<div className="text-center py-10 text-gray-900 animate-pulse font-medium">Loading Assessment Form...</div>}>
            <AssessmentContent />
        </Suspense>
    );
}
