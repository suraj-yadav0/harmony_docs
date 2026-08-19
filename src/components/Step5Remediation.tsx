'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  ArrowLeft,
  Download,
  Check,
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
    <div className="space-y-8 max-w-4xl">
      
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
            Remediation Roadmap
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Follow this prerequisite order to update records with the respective government authorities.
          </p>
        </div>

        <button
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 text-xs text-stone-800 hover:text-stone-950 font-medium underline underline-offset-2 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Printable Summary</span>
        </button>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {remediationPlan.length === 0 || overallStatus === 'GREEN' ? (
          <div className="border border-stone-200 rounded-lg p-6 bg-white text-center space-y-3">
            <h3 className="font-semibold text-sm text-stone-900">
              No Document Corrections Required
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Your identity records are character-for-character consistent across all uploaded proofs. You can proceed directly with your target application.
            </p>
            <div className="pt-2">
              <a
                href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors"
              >
                <span>Open Income Tax Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          remediationPlan.map((step) => {
            const isCompleted = completedStepIds.includes(step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                className={`border rounded-lg p-4 sm:p-5 bg-white space-y-3 transition-colors ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-200'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`w-6 h-6 rounded border flex items-center justify-center font-mono text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                        isCompleted
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.stepNumber}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            isCompleted ? 'line-through text-stone-500' : 'text-stone-900'
                          }`}
                        >
                          {step.actionTitle}
                        </h4>
                        {step.prerequisiteStep !== undefined && (
                          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Prerequisite: Step {step.prerequisiteStep}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {step.reason}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-stone-500 shrink-0 hidden sm:block">
                    <div>Fee: {step.verifiedFee}</div>
                    <div>Timeline: {step.verifiedTimeline}</div>
                  </div>
                </div>

                {/* Steps Details / Proofs */}
                {step.stepsSummary && step.stepsSummary.length > 0 && (
                  <div className="pl-9 text-xs text-stone-600">
                    <span className="font-medium text-stone-800 block mb-1">Required Proofs & Instructions:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                      {step.stepsSummary.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Link */}
                <div className="pl-9 pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                  <span className="text-stone-500 text-[11px]">
                    Authority: {step.authority}
                  </span>
                  <a
                    href={step.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-stone-900 font-medium hover:underline"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Simulate Alignment Trigger */}
      {remediationPlan.length > 0 && overallStatus !== 'GREEN' && (
        <div className="border border-stone-200 rounded-lg p-4 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-stone-900">
              Simulate Post-Correction State
            </span>
            <p className="text-stone-600 mt-0.5">
              Preview the dashboard with all non-anchor fields aligned to the canonical value.
            </p>
          </div>

          <button
            onClick={onSimulateResolvedCorrection}
            className="px-3 py-1.5 rounded-md border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-medium text-xs cursor-pointer shrink-0 transition-colors"
          >
            Simulate Alignment
          </button>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Summary</span>
        </button>
      </div>

    </div>
  );
};
