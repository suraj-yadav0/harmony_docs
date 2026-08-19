'use client';

import React from 'react';
import { AcceptanceScenario, WorkflowId } from '@/types';
import { ACCEPTANCE_SCENARIOS } from '@/data/scenarios';
import { ChevronDown, Shield, Trash2 } from 'lucide-react';

interface HeaderProps {
  currentWorkflowId: WorkflowId;
  onSelectWorkflow: (id: WorkflowId) => void;
  onSelectScenario: (scenario: AcceptanceScenario) => void;
  onPurgeData: () => void;
  onOpenPrivacyModal: () => void;
  onOpenInfoModal: () => void;
  activeScenarioId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectWorkflow,
  onSelectScenario,
  onPurgeData,
  onOpenPrivacyModal,
  activeScenarioId,
}) => {
  return (
    <header className="w-full border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div
            onClick={() => onSelectWorkflow('pan_aadhaar_link')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
              DH
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-stone-900">
                Document Harmony
              </span>
              <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                India
              </span>
            </div>
          </div>

          {/* Center: Scenario Quick Selector Dropdown */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-stone-600 font-medium">Scenario:</span>
            <div className="relative inline-flex items-center">
              <select
                value={activeScenarioId || ''}
                onChange={(e) => {
                  const scenario = ACCEPTANCE_SCENARIOS.find((s) => s.id === e.target.value);
                  if (scenario) onSelectScenario(scenario);
                }}
                aria-label="Select acceptance test scenario"
                className="text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 rounded-md pl-2.5 pr-7 py-1 appearance-none focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
              >
                <option value="" disabled>
                  Load acceptance scenario...
                </option>
                {ACCEPTANCE_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-600 pointer-events-none absolute right-2" />
            </div>
          </div>

          {/* Right: Privacy & Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPrivacyModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <span>Privacy</span>
            </button>

            <button
              onClick={onPurgeData}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
