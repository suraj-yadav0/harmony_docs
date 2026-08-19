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
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8">
        <div className="rounded-xl bg-[#101014] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Official Correction Sequence
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight">
              5. Remediation Roadmap
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Execute steps in prerequisite order to eliminate rejected applications.
            </p>
          </div>

          <button
            onClick={onExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-stone-950 hover:bg-stone-200 text-xs font-bold transition-all cursor-pointer select-none shrink-0 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {remediationPlan.length === 0 || overallStatus === 'GREEN' ? (
          <div className="rounded-2xl p-1 bg-emerald-500/10 border border-emerald-500/20">
            <div className="rounded-xl bg-[#0f1412] p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                No Record Corrections Required
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                All records match character-for-character across uploaded proofs. You can proceed with your target linking.
              </p>
              <div className="pt-2">
                <a
                  href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-colors"
                >
                  <span>Open Official Income Tax Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          remediationPlan.map((step) => {
            const isCompleted = completedStepIds.includes(step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                className={`rounded-2xl p-1 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/20 opacity-80'
                    : 'bg-white/[0.04] border border-white/8'
                }`}
              >
                <div className="rounded-xl bg-[#111115] p-5 space-y-3">
                  
                  {/* Step Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-stone-950 shadow-xs'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                        }`}
                        title={isCompleted ? 'Mark step as pending' : 'Mark step as done'}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-stone-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/6">
                            Target: {step.docTitle}
                          </span>
                          {step.prerequisiteStep !== undefined && (
                            <span className="text-[10px] font-mono font-bold uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                              Prerequisite: Step {step.prerequisiteStep}
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-sm font-bold transition-colors ${
                            isCompleted ? 'line-through text-stone-500' : 'text-white'
                          }`}
                        >
                          {step.actionTitle}
                        </h4>
                        <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                          {step.reason}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono text-stone-400 shrink-0 hidden sm:flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-stone-500" />
                        <span>{step.verifiedFee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{step.verifiedTimeline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Required Proofs */}
                  {step.stepsSummary && step.stepsSummary.length > 0 && (
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-stone-300">
                      <span className="font-semibold text-white block mb-1">Required Action Proofs:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-stone-400">
                        {step.stepsSummary.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Portal Action */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-white/6">
                    <span className="text-stone-500 font-mono text-[11px]">
                      Authority: {step.authority}
                    </span>
                    <a
                      href={step.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
                    >
                      <span>Open Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alignment Simulation */}
      {remediationPlan.length > 0 && overallStatus !== 'GREEN' && (
        <div className="rounded-2xl p-1 bg-gradient-to-b from-indigo-500/20 to-transparent border border-indigo-500/30">
          <div className="rounded-xl bg-[#0f1018] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-sm">
                  Simulate Document Alignment
                </span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Preview how recalculation aligns all attributes to 100/100 harmony.
              </p>
            </div>

            <button
              onClick={onSimulateResolvedCorrection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-stone-950 font-bold text-xs hover:bg-stone-200 transition-all cursor-pointer select-none shrink-0"
            >
              <span>Simulate 100% Harmony</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-white/8">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-stone-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Diagnostics</span>
        </button>

        <button
          onClick={onExportReport}
          className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <span>Export Summary Report</span>
          <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <Download className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

    </div>
  );
};
