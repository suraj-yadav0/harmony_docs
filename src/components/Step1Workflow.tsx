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
  Shield,
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
    <div className="space-y-10 sm:space-y-14 animate-fade-in text-slate-900">
      
      {/* Intro Section */}
      <div className="rounded-3xl bg-white p-7 sm:p-10 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>STATUTORY PRECEDENCE & IDENTITY RESOLUTION SPEC</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#0c2340] tracking-tight leading-tight">
          Select Your Target Government Verification Purpose
        </h1>

        <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          The engine applies the relevant government portal validation rules (e.g. CBDT Income Tax rules for PAN, MEA Passport rules, or EPFO Joint Declaration circulars).
        </p>
      </div>

      {/* Purpose Selection Cards */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            Available Statutory Workflows
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {WORKFLOWS.map((wf) => {
            const isSelected = wf.id === selectedWorkflowId;
            const Icon = ICON_MAP[wf.icon] || FileSpreadsheet;

            return (
              <div
                key={wf.id}
                onClick={() => onSelectWorkflow(wf.id)}
                className={`p-6 sm:p-7 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isSelected
                    ? 'border-[#0c2340] bg-white ring-2 ring-[#0c2340]/20 shadow-md scale-[1.005]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0c2340] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {wf.badge && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {wf.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900">
                    {wf.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {wf.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{wf.requiredDocs.length} Proofs Required</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#0c2340] text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Acceptance Scenarios */}
      <div className="rounded-3xl bg-white p-7 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0c2340]">
              Simulated Acceptance Scenarios (AT-01 to AT-06)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any pre-configured Indian discrepancy test case to explore engine behavior.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ACCEPTANCE_SCENARIOS.map((scenario) => {
            const isGreen = scenario.expectedStatus === 'GREEN';
            const isAmber = scenario.expectedStatus === 'AMBER';

            return (
              <button
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className="text-left p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{scenario.title}</span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        isGreen
                          ? 'bg-emerald-100 text-emerald-800'
                          : isAmber
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {scenario.expectedStatus}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Target: {scenario.expectedScore}/100</span>
                  <span className="text-[#0c2340] font-sans font-bold group-hover:translate-x-0.5 transition-transform">
                    Run Scenario →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Primary CTA */}
      <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200">
        <div className="text-xs sm:text-sm text-slate-600 truncate">
          Selected: <strong className="text-slate-900 font-bold">{WORKFLOWS.find((w) => w.id === selectedWorkflowId)?.title}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none w-full sm:w-auto"
        >
          <span>Continue to Document Proofs</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

    </div>
  );
};
