'use client';

import React from 'react';
import { X, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl border border-stone-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h3 className="font-semibold text-stone-900 text-sm">
            Privacy & Security Architecture
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-stone-600 leading-relaxed">
          
          <div className="p-3 rounded border border-stone-200 bg-stone-50">
            <h4 className="font-semibold text-stone-900 mb-0.5">0-Day Document Retention</h4>
            <p>
              Uploaded documents and extracted text exist only in temporary memory during your browser session. No files or personal data are stored in persistent databases.
            </p>
          </div>

          <div className="p-3 rounded border border-stone-200 bg-stone-50">
            <h4 className="font-semibold text-stone-900 mb-0.5">Masked Identity Numbers</h4>
            <p>
              All 12-digit Aadhaar numbers and 10-digit PAN numbers are automatically masked (e.g., <code>XXXX-XXXX-8921</code> / <code>ABCDE****F</code>) before rendering or exporting.
            </p>
          </div>

          <div className="p-3 rounded border border-stone-200 bg-stone-50">
            <h4 className="font-semibold text-stone-900 mb-0.5">No External Training</h4>
            <p>
              Your document scans are never sent to external AI providers for model training or analytics tracking.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={() => {
              onPurgeData();
              onClose();
            }}
            className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 hover:underline cursor-pointer font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset session & clear memory</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
