'use client';

import React from 'react';

interface WizardProgressProps {
  currentStep: number; // 1 to 5
  onStepClick: (step: number) => void;
  maxStepReached: number;
}

const STEPS = [
  { step: 1, label: '1. Purpose' },
  { step: 2, label: '2. Documents' },
  { step: 3, label: '3. OCR Review' },
  { step: 4, label: '4. Diagnostics' },
  { step: 5, label: '5. Remediation' },
];

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  return (
    <nav aria-label="Verification wizard steps" className="w-full border-b border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between sm:justify-start sm:gap-6 overflow-x-auto py-1">
          {STEPS.map((item) => {
            const isCurrent = item.step === currentStep;
            const isClickable = item.step <= maxStepReached;

            return (
              <button
                key={item.step}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(item.step)}
                className={`py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none ${
                  isCurrent
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : isClickable
                    ? 'border-transparent text-stone-600 hover:text-stone-800 cursor-pointer'
                    : 'border-transparent text-stone-400 cursor-not-allowed'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
