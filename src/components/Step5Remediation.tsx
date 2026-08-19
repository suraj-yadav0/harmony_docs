'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  ArrowLeft,
  Download,
  Check,
  CheckCircle2,
  Clock,
  IndianRupee,
  Sparkles,
} from 'lucide-react';
import { DocumentRecord, HarmonyAnalysisResult, WorkflowConfig } from '@/types';

interface Step5RemediationProps {
  analysis: HarmonyAnalysisResult;
  documents: DocumentRecord[];
  workflow: WorkflowConfig;
  onPrevStep: () => void;
  onExportReport: () => void;
  onSimulateResolvedCorrection: () => void;
}

export const Step5Remediation: React.FC<Step5RemediationProps> = ({
  analysis,
  onPrevStep,
  onExportReport,
  onSimulateResolvedCorrection,
}) => {
  const { remediationPlan, overallStatus } = analysis;
  const [completedStepIds, setCompletedStepIds] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedStepIds((prev) =>
      prev.includes(stepNumber) ? prev.filter((id) => id !== stepNumber) : [...prev, stepNumber]
    );
  };

  return (
    <div className="space-y-10 sm:space-y-14 animate-fade-in text-slate-900">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-white p-7 sm:p-10 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Official Correction Sequence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0c2340] mt-2 tracking-tight">
            5. Statutory Remediation Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Execute steps in prerequisite order to eliminate rejected applications and administrative penalties.
          </p>
        </div>

        <button
          onClick={onExportReport}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0c2340] text-white hover:bg-[#16375f] text-xs sm:text-sm font-bold transition-all cursor-pointer select-none shrink-0 shadow-md w-full sm:w-auto"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Export Official PDF Report</span>
        </button>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        {remediationPlan.length === 0 || overallStatus === 'GREEN' ? (
          <div className="rounded-3xl bg-emerald-50/80 border border-emerald-200 p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
              No Document Corrections Required
            </h3>
            <p className="text-xs sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              All records match character-for-character across uploaded proofs. You can proceed directly with your target application.
            </p>
            <div className="pt-3">
              <a
                href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
              >
                <span>Open Income Tax Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          remediationPlan.map((step) => {
            const isCompleted = completedStepIds.includes(step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                className={`rounded-3xl border transition-all p-6 sm:p-8 space-y-5 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#0c2340] text-white shadow-xs hover:bg-[#16375f]'
                      }`}
                      title={isCompleted ? 'Mark step as pending' : 'Mark step as done'}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          Target Record: {step.docTitle}
                        </span>
                        {step.prerequisiteStep !== undefined && (
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                            Prerequisite: Complete Step {step.prerequisiteStep}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-base sm:text-lg font-extrabold transition-colors ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {step.actionTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.reason}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-slate-600 shrink-0 hidden sm:flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold">{step.verifiedFee}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{step.verifiedTimeline}</span>
                    </div>
                  </div>
                </div>

                {/* Required Proofs & Steps */}
                {step.stepsSummary && step.stepsSummary.length > 0 && (
                  <div className="sm:pl-12 text-xs sm:text-sm">
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-700 space-y-2">
                      <span className="font-bold text-slate-900 block">Required Proofs & Instructions:</span>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-600 leading-relaxed">
                        {step.stepsSummary.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Portal Action */}
                <div className="sm:pl-12 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                  <span className="text-slate-500 font-mono text-xs">
                    Authority: {step.authority}
                  </span>
                  <a
                    href={step.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs w-full sm:w-auto"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Alignment Simulation */}
      {remediationPlan.length > 0 && overallStatus !== 'GREEN' && (
        <div className="rounded-3xl bg-slate-900 text-white p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-base sm:text-lg text-white">
                Simulate Successful Alignment
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Preview how applying canonical updates resolves all discrepancies and elevates the score to 100/100.
            </p>
          </div>

          <button
            onClick={onSimulateResolvedCorrection}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none shrink-0 w-full sm:w-auto"
          >
            <span>Simulate 100% Harmony</span>
          </button>
        </div>
      )}

      {/* Footer Navigation (Responsive Full-Width Stack on Mobile) */}
      <div className="pt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Diagnostics</span>
        </button>

        <button
          onClick={onExportReport}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none w-full sm:w-auto"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Export Official Summary</span>
        </button>
      </div>

    </div>
  );
};
