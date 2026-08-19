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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0c2340]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Document Camera Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Selector Pills */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {(['aadhaar', 'pan', 'bank_passbook', 'marksheet'] as DocumentType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-[#0c2340] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {t.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Viewfinder View */}
        <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-950 flex items-center justify-center overflow-hidden">
          {isCapturing && (
            <div className="absolute inset-0 bg-white z-30 opacity-90 animate-ping" />
          )}

          {/* Guide Bounding Box */}
          <div
            className={`relative w-4/5 h-3/4 rounded-xl border-2 transition-all duration-500 flex flex-col items-center justify-between p-4 ${
              perspectiveAligned
                ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
                : 'border-amber-400'
            }`}
          >
            <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400" />

            <div className="text-center bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
              <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {perspectiveAligned ? 'Document in Focus • Glare Free' : 'Align document corners...'}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              {selectedType.replace('_', ' ')} • Perspective Lock
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-mono">
            Target: <strong className="text-slate-900">{selectedType.replace('_', ' ').toUpperCase()}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-white border border-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isCapturing}
              onClick={handleTriggerCapture}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>Capture & Crop</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
