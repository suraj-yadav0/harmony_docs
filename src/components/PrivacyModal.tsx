'use client';

import React from 'react';
import { X, Trash2, ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurgeData: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onPurgeData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Privacy & Security Architecture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ServerOff className="w-4 h-4 text-emerald-600" />
              <span>0-Day Ephemeral Retention</span>
            </div>
            <p className="text-emerald-800 leading-relaxed pl-6">
              All document uploads and OCR parses live strictly in client-side RAM during your active browser tab session. No files are persisted to remote disk.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Lock className="w-4 h-4 text-[#0c2340]" />
              <span>Masked Identifier Hashes</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              12-digit Aadhaar and 10-digit PAN numbers are masked before rendering or exporting to reports (e.g. <code>XXXX-XXXX-8921</code> / <code>ABCDE****F</code>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <EyeOff className="w-4 h-4 text-amber-600" />
              <span>Zero External AI Model Training</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              Your personal identity proofs are never ingested into training datasets or third-party analytical pipelines.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onPurgeData();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Session Data Now</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
