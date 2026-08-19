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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="rounded-3xl p-1 bg-white/[0.08] border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden text-white">
        <div className="rounded-[calc(1.5rem-2px)] bg-[#101014] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                Privacy & Data Architecture
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3 text-xs text-stone-300">
            
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <ServerOff className="w-4 h-4 text-emerald-400" />
                <span>0-Day Ephemeral Retention</span>
              </div>
              <p className="text-stone-400 leading-relaxed pl-6">
                All document uploads and OCR parses live strictly in client-side RAM during your active browser tab session. No files are persisted to remote disk.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Masked Identifier Hashes</span>
              </div>
              <p className="text-stone-400 leading-relaxed pl-6">
                12-digit Aadhaar and 10-digit PAN numbers are masked before rendering or exporting to reports (e.g. <code>XXXX-XXXX-8921</code>).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Zero AI Model Training</span>
              </div>
              <p className="text-stone-400 leading-relaxed pl-6">
                Your personal documents are never ingested into training corpuses or third-party analytical pipelines.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/8 bg-white/[0.02] flex items-center justify-between">
            <button
              onClick={() => {
                onPurgeData();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Session Memory Now</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-stone-950 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
