'use client';

import React from 'react';
import { AcceptanceScenario, WorkflowId } from '@/types';
import { ACCEPTANCE_SCENARIOS } from '@/data/scenarios';
import { ChevronDown, ShieldCheck, RefreshCw, ArrowLeft, ArrowRight, Shield } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* Top Sovereign Tiranga Micro-Ribbon */}
      <div className="h-1 w-full tricolor-ribbon" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* Brand Logo & Sovereign Tag */}
          <div className="flex items-center gap-3">
            {isWizardView ? (
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer select-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </button>
            ) : (
              <div
                onClick={onNavigateHome}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                {/* Ashoka Navy Seal Badge */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0c2340] border border-[#16375f] flex items-center justify-center text-white shadow-md shadow-slate-900/10 transition-transform group-hover:scale-105">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0c2340]">
                      Document Harmony
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      GovTech India
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 font-sans">
                    National Identity Consistency & Precedence Engine
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Center: Scenario Quick Selector Dropdown */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-2xs">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              PRD Case:
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={activeScenarioId || ''}
                onChange={(e) => {
                  const scenario = ACCEPTANCE_SCENARIOS.find((s) => s.id === e.target.value);
                  if (scenario) onSelectScenario(scenario);
                }}
                aria-label="Select test scenario"
                className="text-xs font-bold text-[#0c2340] bg-transparent appearance-none focus:outline-none cursor-pointer pr-5 py-0.5"
              >
                <option value="" disabled>
                  Load Acceptance Scenario...
                </option>
                {ACCEPTANCE_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — [{s.badge}]
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0" />
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {!isWizardView ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPrivacyModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>0-Day Privacy</span>
                </button>

                <button
                  onClick={onStartAudit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white text-xs font-bold transition-all shadow-md shadow-slate-900/10 cursor-pointer select-none"
                >
                  <span>Start Verification</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenPrivacyModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Privacy Spec</span>
                  <span className="sm:hidden">Privacy</span>
                </button>

                <button
                  onClick={onPurgeData}
                  title="Purge session memory"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Purge Data</span>
                  <span className="sm:hidden">Reset</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
