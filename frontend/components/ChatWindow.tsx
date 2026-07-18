"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, User, Mic, PlayCircle, Trash2, Edit2, Check, X, Trash } from "lucide-react";
import { API_BASE_URL, socket } from "@/lib/api";
import { useLanguage } from "@/components/LanguageContext";

interface ChatMessage {
    id: string;
    sender: "user" | "bot" | "Patient" | "Doctor" | "ASHA";
    content: string;
    timestamp: string;
    original_content?: string;
    is_urgent?: boolean;
    priority?: string;
}

interface ChatWindowProps {
    motherId: string;
}

export function ChatWindow({ motherId }: ChatWindowProps) {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [translationsCache, setTranslationsCache] = useState<Record<string, string>>({});
    const [inFlightTranslates, setInFlightTranslates] = useState<Record<string, boolean>>({});
    
    // Message editing states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    // Audio recording states
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Automatically detect sender portal role from pathname
    const isDoctor = typeof window !== "undefined" && window.location.pathname.includes("doctor");
    const senderRole = isDoctor ? "Doctor" : "ASHA";

    // Load Chat History
    const loadChatHistory = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/mother/${motherId}/chat`)
            .then(res => res.json())
            .then(data => {
                setMessages(data.map((m: any) => ({
                    id: String(m.id || m.message_id),
                    sender: m.sender || "Patient",
                    content: m.translated_text || m.raw_text,
                    timestamp: m.timestamp,
                    original_content: m.raw_text,
                    is_urgent: m.priority === "RED",
                    priority: m.priority || "GREEN"
                })));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load chat history:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadChatHistory();
    }, [motherId]);

    // Setup real-time Socket.IO subscriptions
    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.on("new_notification", (data: any) => {
            if (data.mother_id === motherId) {
                const newMsg: ChatMessage = {
                    id: String(data.id || Date.now()),
                    sender: data.sender || "Patient",
                    content: data.content,
                    timestamp: data.timestamp || new Date().toISOString(),
                    is_urgent: data.is_urgent,
                    priority: data.priority || "GREEN"
                };
                setMessages(prev => {
                    // Deduplicate messages with same ID to prevent duplicates
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
            }
        });

        socket.on("message_updated", (data: any) => {
            if (data.mother_id === motherId) {
                setMessages(prev => prev.map(m => 
                    m.id === String(data.id) ? { ...m, content: data.content } : m
                ));
                // Invalidate cache for this updated entry
                setTranslationsCache(prev => {
                    const next = { ...prev };
                    const cacheKey = `${data.id}_${language}`;
                    delete next[cacheKey];
                    return next;
                });
            }
        });

        socket.on("message_deleted", (data: any) => {
            if (data.mother_id === motherId) {
                setMessages(prev => prev.filter(m => m.id !== String(data.id)));
            }
        });

        socket.on("chat_cleared", (data: any) => {
            if (data.mother_id === motherId) {
                setMessages([]);
            }
        });

        return () => {
            socket.off("new_notification");
            socket.off("message_updated");
            socket.off("message_deleted");
            socket.off("chat_cleared");
        };
    }, [motherId, language]);

    // Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle Client-Side Dynamic Translation for active locale dropdown
    useEffect(() => {
        if (language === "en") return;

        messages.forEach(async (msg) => {
            const cacheKey = `${msg.id}_${language}`;
            if (translationsCache[cacheKey] || inFlightTranslates[cacheKey]) return;

            setInFlightTranslates(prev => ({ ...prev, [cacheKey]: true }));
            try {
                const res = await fetch(`${API_BASE_URL}/translate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: msg.content,
                        target_lang: language
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setTranslationsCache(prev => ({
                        ...prev,
                        [cacheKey]: data.translated_text
                    }));
                }
            } catch (err) {
                console.error("Failed to translate message on client:", err);
            } finally {
                setInFlightTranslates(prev => ({ ...prev, [cacheKey]: false }));
            }
        });
    }, [messages, language]);

    // Send Text Message (No manual append; Socket.IO resolves the addition)
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    content: newMessage,
                    sender: senderRole 
                }),
            });

            if (res.ok) {
                setNewMessage("");
            }
        } catch (err) {
            console.error("Failed to send reply:", err);
        } finally {
            setSending(false);
        }
    };

    // Edit/Update Chat Message
    const handleStartEdit = (msg: ChatMessage) => {
        setEditingId(msg.id);
        setEditingText(msg.content);
    };

    const handleSaveEdit = async (msgId: string) => {
        if (!editingText.trim()) return;
        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/chat/${msgId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editingText })
            });
            if (res.ok) {
                setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: editingText } : m));
                setEditingId(null);
            }
        } catch (err) {
            console.error("Failed to update message:", err);
        }
    };

    // Delete Single Message
    const handleDeleteMessage = async (msgId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/chat/${msgId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== msgId));
            }
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    // Purge Chat Logs
    const handleDeleteChat = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/chat`, {
                method: "DELETE"
            });
            if (res.ok) {
                setMessages([]);
            }
        } catch (err) {
            console.error("Failed to clear chat log:", err);
        }
    };

    // Audio Voice Recording Handler (Send voice reply to patient - no manual append; Socket.IO resolves addition)
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunks.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.current.push(e.data);
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                const formData = new FormData();
                formData.append("file", audioBlob, "recording.wav");
                formData.append("sender", senderRole);

                setSending(true);
                try {
                    await fetch(`${API_BASE_URL}/mother/${motherId}/reply-voice`, {
                        method: "POST",
                        body: formData
                    });
                } catch (err) {
                    console.error("Failed to upload voice reply:", err);
                } finally {
                    setSending(false);
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            console.error("Could not capture microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl bg-white shadow-sm">
            <div className="p-4 border-b bg-gray-50 rounded-t-xl flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-700">Live Communication</h3>
                    <p className="text-[10px] text-gray-400 capitalize">Logged as: {senderRole} Portal</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDeleteChat} 
                        className="text-gray-400 hover:text-red-600 transition-colors p-1" 
                        title="Clear whole conversation"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading history...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No messages yet. Start conversation.</div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender === "Doctor" || msg.sender === "ASHA";
                        const isEditing = editingId === msg.id;

                        // Dynamic translation text resolving
                        const displayContent = language === "en"
                            ? msg.content
                            : (translationsCache[`${msg.id}_${language}`] || msg.content);

                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`relative max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm group ${isMe
                                        ? 'bg-primary text-white rounded-br-none'
                                        : msg.priority === "RED"
                                            ? 'bg-red-100 text-red-800 border-red-200 border-2 rounded-bl-none shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                            : msg.priority === "YELLOW"
                                                ? 'bg-yellow-50 text-yellow-900 border-yellow-300 border rounded-bl-none'
                                                : 'bg-green-50 text-green-900 border-green-200 border rounded-bl-none'
                                        }`}
                                >
                                    <div className="text-xs opacity-70 mb-1 flex justify-between gap-4">
                                        <span className="font-bold">{msg.sender}</span>
                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    
                                    {isEditing ? (
                                        <div className="flex items-center gap-1 mt-1">
                                            <Input
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="bg-white text-gray-800 h-8 text-xs py-1"
                                            />
                                            <button onClick={() => handleSaveEdit(msg.id)} className="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                                <Check className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="whitespace-pre-wrap">{displayContent}</p>
                                            {language !== "en" && !translationsCache[`${msg.id}_${language}`] && (
                                                <div className="text-[10px] italic opacity-65 flex items-center gap-1 mt-1 animate-pulse">
                                                    ⏳ Translating...
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action buttons (Edit & Delete) for outgoing portal messages */}
                                    {isMe && !isEditing && (
                                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleStartEdit(msg)}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="Edit Message"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="text-gray-400 hover:text-red-500"
                                                title="Delete Message"
                                            >
                                                <Trash className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    {msg.sender === "Patient" && msg.original_content && msg.original_content !== displayContent && (
                                        <div className="mt-2 pt-2 border-t border-black/10 text-xs italic opacity-85">
                                            Original: "{msg.original_content}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t bg-gray-50 rounded-b-xl flex gap-2 items-center">
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2.5 rounded-xl border transition-colors ${
                        isRecording 
                            ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                            : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                    title={isRecording ? "Stop voice recording" : "Record voice response reply"}
                >
                    <Mic className="w-4 h-4" />
                </button>
                
                <Input
                    placeholder={isRecording ? "🎤 Recording response voice..." : "Type a message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-white"
                    disabled={sending || isRecording}
                />
                
                <Button type="submit" size="sm" isLoading={sending} disabled={isRecording} className="aspect-square p-0 w-10 h-10 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
