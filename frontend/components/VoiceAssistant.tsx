"use client";

import React, { useState, useRef } from "react";
import { Mic, MicOff, Check, Edit2, ArrowRight, RefreshCw, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface VoiceAssistantProps {
  portalType: "asha" | "doctor";
  onComplete: (data: any) => void;
  onCancel: () => void;
  onChange?: (key: string, value: any) => void;
}

export function VoiceAssistant({ portalType, onComplete, onCancel, onChange }: VoiceAssistantProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Guided questions for ASHA
  const ashaQuestions = [
    { key: "sys_bp", question: "What is the mother's Systolic Blood Pressure? (e.g., 120)", label: "Systolic BP" },
    { key: "dia_bp", question: "What is the mother's Diastolic Blood Pressure? (e.g., 80)", label: "Diastolic BP" },
    { key: "weight_kg", question: "What is the patient's weight in kilograms?", label: "Weight" },
    { key: "hemoglobin_gdl", question: "What is the hemoglobin level in g/dL?", label: "Hemoglobin" },
    { key: "random_glucose_mgdl", question: "What is the random glucose level in mg/dL?", label: "Random Glucose" },
    { key: "other_symptoms", question: "Describe any other symptoms, headaches, or swelling.", label: "Symptoms & Notes" }
  ];

  // Guided questions for Doctor
  const doctorQuestions = [
    { key: "sys_bp", question: "What is the patient's Systolic Blood Pressure?", label: "Systolic BP" },
    { key: "dia_bp", question: "What is the Diastolic Blood Pressure?", label: "Diastolic BP" },
    { key: "weight_kg", question: "What is the weight in kilograms?", label: "Weight" },
    { key: "heart_rate", question: "What is the patient's heart rate?", label: "Heart Rate" },
    { key: "status", question: "What is the patient's clinical status? (Stable, Critical, or Requires Attention)", label: "Clinical Status" },
    { key: "next_consultation_date", question: "When is the next checkup date? (Format: YYYY-MM-DD)", label: "Next Visit Date" },
    { key: "doctor_observations", question: "Record your clinical observations and diagnosis details.", label: "Observations" },
    { key: "medication_advice", question: "Specify the prescriptions and medication instructions.", label: "Prescriptions (Rx)" },
    { key: "nutritional_advice", question: "Record any nutritional guidelines or dietary tips.", label: "Nutritional Advice" }
  ];

  const questions = portalType === "asha" ? ashaQuestions : doctorQuestions;
  const activeQuestion = questions[currentStep];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not supported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const uploadAudio = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
    formData.append("portal_type", portalType);
    formData.append("active_question_key", activeQuestion.key);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/voice/process`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        const extractedValue = data[activeQuestion.key];
        if (extractedValue !== undefined && extractedValue !== null) {
          setAnswers(prev => ({ ...prev, [activeQuestion.key]: extractedValue }));
          if (onChange) {
            onChange(activeQuestion.key, extractedValue);
          }
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleEditField = (key: string, currentValue: any) => {
    setEditField(key);
    setEditValue(currentValue || "");
  };

  const handleSaveEdit = () => {
    if (editField) {
      setAnswers(prev => ({ ...prev, [editField]: editValue }));
      if (onChange) {
        onChange(editField, editValue);
      }
      setEditField(null);
    }
  };

  const handleConfirmAll = () => {
    onComplete(answers);
  };

  return (
    <div className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl p-6 font-body">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-accent animate-pulse" />
            {isReviewing ? "Verify Captured Fields" : `Voice Guided Intake - Question ${currentStep + 1} of ${questions.length}`}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isReviewing ? "Confirm or edit details before applying" : "Speak answers clearly after clicking the microphone"}
          </p>
        </div>
        <button onClick={onCancel} className="p-1.5 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isReviewing ? (
        <div className="space-y-6 py-2 text-center">
          <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-xl mx-auto shadow-sm">
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">Speak Now</p>
            <h3 className="text-xl font-bold text-gray-900 leading-snug">{activeQuestion.question}</h3>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3">
            {isRecording ? (
              <div className="flex flex-col items-center space-y-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <p className="text-red-500 font-bold animate-pulse text-xs">Listening...</p>
                <button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all text-sm"
                >
                  <MicOff className="w-4 h-4" /> Stop Listening
                </button>
              </div>
            ) : (
              <button
                onClick={startRecording}
                disabled={loading}
                className="bg-accent hover:bg-accent/90 text-white font-bold p-6 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
              </button>
            )}
            {!isRecording && !loading && (
              <p className="text-gray-500 text-xs">Click mic to record response</p>
            )}
          </div>

          {answers[activeQuestion.key] !== undefined && (
            <div className="bg-white px-4 py-2 rounded-lg max-w-xs mx-auto border border-gray-200 flex items-center justify-between text-sm shadow-sm">
              <span className="text-gray-500 font-medium">Captured:</span>
              <span className="font-bold text-accent">{String(answers[activeQuestion.key])}</span>
            </div>
          )}

          <div className="flex justify-between items-center max-w-xs mx-auto pt-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all text-xs font-semibold"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all text-xs font-semibold flex items-center gap-1"
            >
              Skip <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="max-w-xl mx-auto pt-4">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div
                className="bg-accent h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Captured answers output displayed below the listening block */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-left">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Live Captured Answers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {questions.map((q) => {
                if (answers[q.key] === undefined) return null;
                return (
                  <div key={q.key} className="bg-white p-2.5 rounded-lg border border-gray-200 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] text-gray-400 block mb-0.5 uppercase tracking-wider font-semibold">{q.label}</span>
                      <p className="text-xs font-semibold text-gray-800">{String(answers[q.key])}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questions.map((q) => (
              <div key={q.key} className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col justify-between gap-1 shadow-sm">
                <div>
                  <span className="text-[10px] text-gray-500 block mb-0.5 uppercase tracking-wider font-semibold">{q.label}</span>
                  {editField === q.key ? (
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-250 text-gray-900 px-2 py-1 rounded w-full focus:outline-none focus:border-accent text-xs"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{answers[q.key] !== undefined ? String(answers[q.key]) : <span className="text-gray-300 italic">Not provided</span>}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-1.5 mt-1">
                  {editField === q.key ? (
                    <button
                      onClick={handleSaveEdit}
                      className="text-xs text-accent font-bold flex items-center gap-0.5 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditField(q.key, answers[q.key])}
                      className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-0.5 transition-all"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsReviewing(false);
                setCurrentStep(0);
              }}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all text-xs font-semibold"
            >
              Restart Voice Intake
            </button>
            <button
              onClick={handleConfirmAll}
              className="px-6 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white shadow-md transition-all text-xs font-bold"
            >
              Apply to Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
