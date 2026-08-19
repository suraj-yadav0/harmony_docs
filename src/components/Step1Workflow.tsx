'use client';

import React from 'react';
import { AcceptanceScenario, WorkflowId } from '@/types';
import { ACCEPTANCE_SCENARIOS, WORKFLOWS } from '@/data/scenarios';
import {
  Link as LinkIcon,
  Landmark,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  Check,
  Fingerprint,
  Cpu,
} from 'lucide-react';

interface Step1WorkflowProps {
  selectedWorkflowId: WorkflowId;
  onSelectWorkflow: (id: WorkflowId) => void;
  onSelectScenario: (scenario: AcceptanceScenario) => void;
  onNextStep: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Link: LinkIcon,
  Landmark: Landmark,
  GraduationCap: GraduationCap,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
  FileSpreadsheet: FileSpreadsheet,
};

export const Step1Workflow: React.FC<Step1WorkflowProps> = ({
  selectedWorkflowId,
  onSelectWorkflow,
  onSelectScenario,
  onNextStep,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Editorial Hero Banner */}
      <div className="relative rounded-[2rem] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-1 border border-white/10 shadow-2xl">
        <div className="rounded-[calc(2rem-0.25rem)] bg-[#0e0e11] p-6 sm:p-10 relative overflow-hidden border border-white/5">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>INDIAN IDENTITY CONSISTENCY ENGINE • CLIENT-SIDE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
              Cross-verify official records before submitting government applications.
            </h1>

            <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-2xl font-normal">
              Detect character-level discrepancies across <strong className="text-white font-medium">Aadhaar, PAN, Bank KYC, and Marksheets</strong>. Resolve authoritative anchor precedence and generate the exact administrative correction sequence.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-stone-400">
              <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/8">
                <Fingerprint className="w-3.5 h-3.5 text-stone-300" />
                <span>0-Day Retention</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/8">
                <Cpu className="w-3.5 h-3.5 text-stone-300" />
                <span>Deterministic Phonetic Matching</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Workflow Purpose Selection */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-white/8 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              1. Select Verification Purpose
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              The engine configures regulatory precedence and acceptable tolerance thresholds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKFLOWS.map((wf) => {
            const isSelected = wf.id === selectedWorkflowId;
            const Icon = ICON_MAP[wf.icon] || FileSpreadsheet;

            return (
              <div
                key={wf.id}
                onClick={() => onSelectWorkflow(wf.id)}
                className={`group rounded-2xl p-1 transition-all duration-300 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-b from-white/25 to-white/10 shadow-lg shadow-black/40 scale-[1.01]'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/8'
                }`}
              >
                <div
                  className={`h-full rounded-[calc(1rem-2px)] p-5 flex flex-col justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#16161b] border border-white/20'
                      : 'bg-[#101014]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-white text-stone-950 shadow-md'
                            : 'bg-white/[0.06] text-stone-300 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {wf.badge && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300 border border-white/10">
                          {wf.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-stone-100 transition-colors">
                      {wf.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {wf.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>{wf.requiredDocs.length} Proofs</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-white text-stone-950'
                          : 'border border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acceptance Test Scenarios Bento */}
      <div className="rounded-[1.75rem] p-1 bg-white/[0.04] border border-white/8 space-y-3">
        <div className="rounded-[calc(1.75rem-0.25rem)] bg-[#0f0f13] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/8 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Simulated Acceptance Test Cases (AT-01 to AT-06)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Load real Indian discrepancy test cases with pre-configured OCR extractions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ACCEPTANCE_SCENARIOS.map((scenario) => {
              const isGreen = scenario.expectedStatus === 'GREEN';
              const isAmber = scenario.expectedStatus === 'AMBER';

              return (
                <button
                  key={scenario.id}
                  onClick={() => onSelectScenario(scenario)}
                  className="group text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/6 hover:border-white/15 transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-stone-100">
                        {scenario.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          isGreen
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : isAmber
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {scenario.expectedStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/6 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>Target: {scenario.expectedScore}/100</span>
                    <span className="text-white group-hover:translate-x-0.5 transition-transform font-sans font-semibold text-[11px]">
                      Test →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Button-in-Button Primary Action */}
      <div className="pt-4 flex items-center justify-between border-t border-white/8">
        <div className="text-xs text-stone-400">
          Target: <strong className="text-white font-medium">{WORKFLOWS.find((w) => w.id === selectedWorkflowId)?.title}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <span>Continue to Proofs</span>
          <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

    </div>
  );
};
