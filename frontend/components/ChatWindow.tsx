"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, User, Mic, PlayCircle } from "lucide-react";
import { API_BASE_URL, socket } from "@/lib/api";

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
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/mother/${motherId}/chat`)
            .then(res => res.json())
            .then(data => {
                
                setMessages(data.map((m: any) => ({
                    id: m.id || m.message_id,
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
    }, [motherId]);

    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.on("new_notification", (data: any) => {
            if (data.mother_id === motherId) {
                
                const newMsg: ChatMessage = {
                    id: data.id || Date.now().toString(),
                    sender: data.sender || "Patient",
                    content: data.content,
                    timestamp: data.timestamp || new Date().toISOString(),
                    is_urgent: data.is_urgent,
                    priority: data.priority || "GREEN"
                };
                setMessages(prev => [...prev, newMsg]);
            }
        });

        return () => {
            socket.off("new_notification");
        };
    }, [motherId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`${API_BASE_URL}/mother/${motherId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });

            if (res.ok) {

                const sentMsg: ChatMessage = {
                    id: "temp_" + Date.now(),
                    sender: "ASHA",
                    content: newMessage,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, sentMsg]);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl bg-white shadow-sm">
            <div className="p-4 border-b bg-gray-50 rounded-t-xl flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Live Communication</h3>
                <div className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
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
                        const isSystem = msg.sender === "bot";

                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm ${isMe
                                        ? 'bg-primary text-white rounded-br-none'
                                        : msg.priority === "RED"
                                            ? 'bg-red-100 text-red-800 border-red-200 border-2 rounded-bl-none shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                            : msg.priority === "YELLOW"
                                                ? 'bg-yellow-50 text-yellow-900 border-yellow-300 border rounded-bl-none'
                                                : 'bg-green-50 text-green-900 border-green-200 border rounded-bl-none'
                                        }`}
                                >
                                    <div className="text-xs opacity-70 mb-1 flex justify-between gap-2">
                                        <span>{msg.sender}</span>
                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p>{msg.content}</p>
                                    {msg.sender === "Patient" && msg.original_content && msg.original_content !== msg.content && (
                                        <div className="mt-2 pt-2 border-t border-black/10 text-xs italic opacity-80">
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

            <form onSubmit={handleSend} className="p-3 border-t bg-gray-50 rounded-b-xl flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-white"
                    disabled={sending}
                />
                <Button type="submit" size="sm" isLoading={sending} className="aspect-square p-0 w-10 h-10 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div >
    );
}
