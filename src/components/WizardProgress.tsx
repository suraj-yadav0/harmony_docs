'use client';

import React from 'react';
import {
  Compass,
  FileCheck,
  ScanEye,
  Activity,
  GitMerge,
} from 'lucide-react';

interface WizardProgressProps {
  currentStep: number; // 1 to 5
  onStepClick: (step: number) => void;
  maxStepReached: number;
}

const STEPS = [
  { step: 1, label: 'Purpose', icon: Compass },
  { step: 2, label: 'Document Proofs', icon: FileCheck },
  { step: 3, label: 'OCR Verification', icon: ScanEye },
  { step: 4, label: 'Diagnostics & Diffs', icon: Activity },
  { step: 5, label: 'Official Roadmap', icon: GitMerge },
];

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  return (
    <nav aria-label="Verification progress" className="w-full my-8 sm:my-10">
      <div className="max-w-5xl mx-auto p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((item) => {
            const isCurrent = item.step === currentStep;
            const isCompleted = item.step < currentStep;
            const isClickable = item.step <= maxStepReached;
            const Icon = item.icon;

            return (
              <button
                key={item.step}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(item.step)}
                className={`group py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-2.5 select-none ${
                  isCurrent
                    ? 'bg-[#0c2340] text-white shadow-sm font-bold'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 cursor-pointer font-semibold'
                    : isClickable
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer font-medium'
                    : 'text-slate-400 opacity-50 cursor-not-allowed font-medium'
                }`}
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-colors shrink-0 ${
                    isCurrent
                      ? 'bg-white text-[#0c2340]'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {item.step}
                </div>

                <span className="hidden md:inline-block text-xs sm:text-sm tracking-tight truncate">
                  {item.label}
                </span>
                
                <Icon className={`w-3.5 h-3.5 md:hidden ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
