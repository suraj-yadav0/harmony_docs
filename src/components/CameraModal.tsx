'use client';

import React, { useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles } from 'lucide-react';
import { DocumentType } from '@/types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (docType: DocumentType, fileName: string) => void;
  initialDocType: DocumentType;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  initialDocType,
}) => {
  const [selectedType, setSelectedType] = useState<DocumentType>(initialDocType);
  const [isCapturing, setIsCapturing] = useState(false);
  const [perspectiveAligned, setPerspectiveAligned] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setPerspectiveAligned(true), 600);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      onCapture(selectedType, `${selectedType}_camera_scan_${Date.now().toString().slice(-4)}.jpg`);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="rounded-3xl p-1 bg-white/[0.08] border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden text-white">
        <div className="rounded-[calc(1.5rem-2px)] bg-[#101014] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">Document Camera Scanner</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Document Selector */}
          <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/6 flex items-center gap-2 overflow-x-auto">
            {(['aadhaar', 'pan', 'bank_passbook', 'marksheet'] as DocumentType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === t
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'bg-white/[0.04] text-stone-300 hover:bg-white/[0.08]'
                }`}
              >
                {t.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Viewfinder */}
          <div className="relative aspect-4/3 sm:aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
            {isCapturing && (
              <div className="absolute inset-0 bg-white z-30 opacity-90 animate-ping" />
            )}

            {/* Guide box */}
            <div
              className={`relative w-4/5 h-3/4 rounded-xl border-2 transition-all duration-500 flex flex-col items-center justify-between p-4 ${
                perspectiveAligned
                  ? 'border-emerald-400/90 shadow-[0_0_30px_rgba(52,211,153,0.25)]'
                  : 'border-amber-400/80'
              }`}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

              <div className="text-center bg-black/80 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {perspectiveAligned ? 'Edge Alignment Locked' : 'Align document corners...'}
                </span>
              </div>

              <div className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                {selectedType.replace('_', ' ')} • Perspective Lock
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white/[0.02] border-t border-white/8 flex items-center justify-between">
            <div className="text-xs text-stone-400">
              Scanning: <strong className="text-white">{selectedType.replace('_', ' ').toUpperCase()}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white bg-white/[0.04] cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isCapturing}
                onClick={handleTriggerCapture}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Proof</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
