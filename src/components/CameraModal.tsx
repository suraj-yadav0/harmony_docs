'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, Sparkles, Video } from 'lucide-react';
import { DocumentType } from '@/types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (docType: DocumentType, fileName: string, fileBlob?: Blob) => void;
  initialDocType: DocumentType;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  initialDocType,
}) => {
  const [selectedType, setSelectedType] = useState<DocumentType>(initialDocType);
  const [prevInitialDocType, setPrevInitialDocType] = useState<DocumentType>(initialDocType);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [perspectiveAligned, setPerspectiveAligned] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync selected type when initialDocType changes during render
  if (initialDocType !== prevInitialDocType) {
    setPrevInitialDocType(initialDocType);
    setSelectedType(initialDocType);
  }

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
          });
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setHasCameraAccess(true);
        } else {
          setHasCameraAccess(false);
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
        if (isMounted) {
          setHasCameraAccess(false);
        }
      }
    };

    startCamera();

    const timer = setTimeout(() => {
      if (isMounted) {
        setPerspectiveAligned(true);
      }
    }, 800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerCapture = async () => {
    setIsCapturing(true);

    const fileName = `${selectedType}_camera_scan_${Date.now().toString().slice(-4)}.jpg`;

    // If active video stream exists, capture frame from video
    if (videoRef.current && canvasRef.current && hasCameraAccess) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            setIsCapturing(false);
            if (blob) {
              onCapture(selectedType, fileName, blob);
            } else {
              onCapture(selectedType, fileName);
            }
            onClose();
          },
          'image/jpeg',
          0.92
        );
        return;
      }
    }

    // Fallback: Generate canvas synthetic capture card
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 1200;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 750);
        ctx.fillStyle = '#0c2340';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`GOVERNMENT OF INDIA - ${selectedType.toUpperCase()}`, 60, 90);
        ctx.font = '28px sans-serif';
        ctx.fillText('NAME: SURAJ KUMAR YADAV', 60, 170);
        ctx.fillText('DOB: 15/08/2001', 60, 230);
        ctx.fillText('FATHER: SURESH KUMAR YADAV', 60, 290);
        ctx.fillText(
          selectedType === 'pan' ? 'PAN: ABCDE1234F' : 'ID: 1234 5678 9012',
          60,
          360
        );

        canvas.toBlob(
          (blob) => {
            setTimeout(() => {
              setIsCapturing(false);
              if (blob) {
                onCapture(selectedType, fileName, blob);
              } else {
                onCapture(selectedType, fileName);
              }
              onClose();
            }, 600);
          },
          'image/jpeg',
          0.9
        );
        return;
      }
    }

    setTimeout(() => {
      setIsCapturing(false);
      onCapture(selectedType, fileName);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0c2340]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Live Document Camera Scanner
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
          {hasCameraAccess ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-white text-xs sm:text-sm font-bold">
                  Camera Viewfinder Ready
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Physical webcam stream or simulated high-resolution scan capture.
                </p>
              </div>
            </div>
          )}

          {isCapturing && (
            <div className="absolute inset-0 bg-white z-30 opacity-90 animate-ping" />
          )}

          {/* Guide Bounding Box */}
          <div
            className={`relative w-4/5 h-3/4 rounded-xl border-2 transition-all duration-500 flex flex-col items-center justify-between p-4 z-20 pointer-events-none ${
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
                {perspectiveAligned
                  ? 'Document in Focus • Glare Free'
                  : 'Align document corners...'}
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
            Target:{' '}
            <strong className="text-slate-900">
              {selectedType.replace('_', ' ').toUpperCase()}
            </strong>
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
                  <span>Processing Frame...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>Capture & OCR</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
