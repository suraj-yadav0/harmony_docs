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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base">Document Camera Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Selector Pills */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {(['aadhaar', 'pan', 'bank_passbook', 'marksheet'] as DocumentType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Camera Viewfinder View */}
        <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-950 flex items-center justify-center overflow-hidden">
          
          {/* Flash Effect on Capture */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white z-30 animate-ping opacity-90" />
          )}

          {/* Document Bounding Guide */}
          <div
            className={`relative w-4/5 h-3/4 rounded-xl border-2 transition-all duration-500 flex flex-col items-center justify-between p-4 ${
              perspectiveAligned
                ? 'border-emerald-400/90 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
                : 'border-amber-400/80'
            }`}
          >
            {/* Corner Indicators */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />

            {/* Edge Detection Scanning Line */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-70" />

            <div className="text-center bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
              <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {perspectiveAligned ? 'Document in Focus • Glare Free' : 'Aligning edges...'}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              {selectedType.replace('_', ' ')} • Perspective Lock
            </div>
          </div>

          {/* Subtext info */}
          <div className="absolute bottom-2 left-3 right-3 text-center text-[11px] text-slate-400">
            Hold steady. Ensure all 4 corners and full name/DOB are clearly visible.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Scanning: <strong className="text-white">{selectedType.replace('_', ' ').toUpperCase()}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isCapturing}
              onClick={handleTriggerCapture}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
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
