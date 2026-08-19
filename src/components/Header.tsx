'use client';

import React from 'react';
import { AcceptanceScenario, WorkflowId } from '@/types';
import { ACCEPTANCE_SCENARIOS } from '@/data/scenarios';
import { ChevronDown, ShieldCheck, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentWorkflowId: WorkflowId;
  onSelectWorkflow: (id: WorkflowId) => void;
  onSelectScenario: (scenario: AcceptanceScenario) => void;
  onPurgeData: () => void;
  onOpenPrivacyModal: () => void;
  onOpenInfoModal: () => void;
  activeScenarioId?: string;
  isWizardView?: boolean;
  onNavigateHome?: () => void;
  onStartAudit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectScenario,
  onPurgeData,
  onOpenPrivacyModal,
  activeScenarioId,
  isWizardView,
  onNavigateHome,
  onStartAudit,
}) => {
  return (
    <header className="sticky top-3 z-40 w-full px-4 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto rounded-2xl bg-[#121215]/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/60 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-4 pointer-events-auto transition-all">
        
        {/* Brand Logo / Back Home Button */}
        <div className="flex items-center gap-3">
          {isWizardView ? (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 transition-all cursor-pointer select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          ) : (
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/15 flex items-center justify-center text-white font-mono font-black text-xs shadow-inner transition-transform group-hover:scale-105">
                DH
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#121215]" />
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-stone-200 transition-colors">
                  Document Harmony
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-semibold text-stone-400 uppercase tracking-wider">
                  India
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Scenario Quick Selector */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 rounded-xl px-3 py-1.5 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
            Scenario:
          </span>
          <div className="relative inline-flex items-center">
            <select
              value={activeScenarioId || ''}
              onChange={(e) => {
                const scenario = ACCEPTANCE_SCENARIOS.find((s) => s.id === e.target.value);
                if (scenario) onSelectScenario(scenario);
              }}
              aria-label="Select test scenario"
              className="text-xs font-semibold text-stone-200 bg-transparent appearance-none focus:outline-none cursor-pointer pr-5 py-0.5"
            >
              <option value="" disabled className="bg-[#121215] text-stone-300">
                Load PRD Test Case...
              </option>
              {ACCEPTANCE_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#121215] text-stone-300">
                  {s.title} — [{s.badge}]
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 pointer-events-none absolute right-0" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!isWizardView ? (
            <button
              onClick={onStartAudit}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-stone-200 text-stone-950 text-xs font-bold transition-all shadow-md cursor-pointer select-none"
            >
              <span>Start Check</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <>
              <button
                onClick={onOpenPrivacyModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Privacy</span>
              </button>

              <button
                onClick={onPurgeData}
                title="Purge session memory"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
