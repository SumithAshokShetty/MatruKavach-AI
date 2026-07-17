"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { API_BASE_URL } from "@/lib/api";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Share2, Copy, Check, QrCode, ShieldCheck, Clock } from "lucide-react";

interface PatientQRCodeProps {
  motherId: string;
  patientName: string;
}

export function PatientQRCode({ motherId, patientName }: PatientQRCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [shareLink, setShareLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchTokenAndGenerateQR = async () => {
    try {
      setLoading(true);
      setError("");
      // 1. Fetch secure cryptographically signed share token from backend
      const res = await fetch(`${API_BASE_URL}/share/mother/${motherId}/token`);
      if (!res.ok) {
        throw new Error("Failed to generate security token");
      }
      const data = await res.json();
      
      // 2. Build the secure client-side redirect destination URL
      const secureUrl = `${window.location.origin}/share/mother/${motherId}?token=${data.token}`;
      setShareLink(secureUrl);

      // 3. Generate QR code Data URL using the 'qrcode' library
      const qrDataUrl = await QRCode.toDataURL(secureUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: "#1e293b", // Slate 800
          light: "#ffffff",
        },
      });
      setQrUrl(qrDataUrl);
      setHasGenerated(true);
    } catch (err: any) {
      console.error("QR Generation error:", err);
      setError("Could not generate secure QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Card variant="glass" className="p-6 border border-gray-150 shadow-sm bg-white rounded-2xl flex flex-col items-center text-center max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Secure QR Record Share
        </h3>
      </div>

      <p className="text-xs text-gray-500 mb-6">
        Scan to view {patientName}'s secure health history and consultation records on any portal.
      </p>

      <div className="relative w-48 h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shadow-inner mb-6 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <QrCode className="w-8 h-8 text-gray-300 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-semibold animate-pulse">Generating Secure Code...</span>
          </div>
        ) : error ? (
          <p className="text-xs text-red-500 font-medium px-4">{error}</p>
        ) : !hasGenerated ? (
          <div className="flex flex-col items-center gap-3 p-4">
            <QrCode className="w-12 h-12 text-gray-300" />
            <Button size="sm" onClick={fetchTokenAndGenerateQR} className="text-xs py-1.5 px-4 font-bold shadow-md">
              Generate QR
            </Button>
          </div>
        ) : (
          <img src={qrUrl} alt="Patient Secure QR Code" className="w-full h-full object-contain" />
        )}
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100 w-fit mx-auto">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Expires in 24 Hours (Secured by JWT)</span>
        </div>

        {hasGenerated && !loading && !error && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="flex-1 py-2 text-xs font-bold rounded-lg border border-gray-250 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Link
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
