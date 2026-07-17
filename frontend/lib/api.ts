import { io } from "socket.io-client";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const socket = io(API_BASE_URL, {
    transports: ["websocket"],
    autoConnect: true,
});
