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
  { step: 1, label: 'Intent', icon: Compass },
  { step: 2, label: 'Proofs', icon: FileCheck },
  { step: 3, label: 'OCR Review', icon: ScanEye },
  { step: 4, label: 'Diagnostics', icon: Activity },
  { step: 5, label: 'Roadmap', icon: GitMerge },
];

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  return (
    <nav aria-label="Verification progress" className="w-full px-4 sm:px-6 my-6">
      <div className="max-w-5xl mx-auto p-1 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md">
        <div className="grid grid-cols-5 gap-1">
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
                className={`group py-2.5 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-2 select-none ${
                  isCurrent
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/15 font-semibold'
                    : isCompleted
                    ? 'text-stone-300 hover:bg-white/[0.05] cursor-pointer'
                    : isClickable
                    ? 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04] cursor-pointer'
                    : 'text-stone-600 opacity-40 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                    isCurrent
                      ? 'bg-white text-stone-950 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.06] text-stone-400 group-hover:text-white'
                  }`}
                >
                  {item.step}
                </div>

                <span className="hidden md:inline-block text-xs tracking-tight truncate">
                  {item.label}
                </span>
                
                <Icon className={`w-3.5 h-3.5 md:hidden ${isCurrent ? 'text-white' : 'text-stone-500'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
