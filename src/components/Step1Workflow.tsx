'use client';

import React from 'react';
import { AcceptanceScenario, WorkflowId } from '@/types';
import { ACCEPTANCE_SCENARIOS, WORKFLOWS } from '@/data/scenarios';
import { ArrowRight, Check } from 'lucide-react';

interface Step1WorkflowProps {
  selectedWorkflowId: WorkflowId;
  onSelectWorkflow: (id: WorkflowId) => void;
  onSelectScenario: (scenario: AcceptanceScenario) => void;
  onNextStep: () => void;
}

export const Step1Workflow: React.FC<Step1WorkflowProps> = ({
  selectedWorkflowId,
  onSelectWorkflow,
  onSelectScenario,
  onNextStep,
}) => {
  return (
    <div className="space-y-12 max-w-4xl">
      
      {/* Intro Section */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
          Verify document consistency across Indian official records.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          Compare names, dates of birth, and attributes across Aadhaar, PAN, Bank records, and Marksheets. Detect character differences and identify which record serves as the legal anchor before submitting applications.
        </p>
      </div>

      {/* Target Workflows List */}
      <div className="space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Select Verification Purpose
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WORKFLOWS.map((wf) => {
            const isSelected = wf.id === selectedWorkflowId;

            return (
              <div
                key={wf.id}
                onClick={() => onSelectWorkflow(wf.id)}
                className={`p-4 rounded-lg border text-left cursor-pointer transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-sm text-stone-900">
                      {wf.title}
                    </h3>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-normal">
                    {wf.shortDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-600 font-mono">
                  Proofs: {wf.requiredDocs.join(', ').toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acceptance Test Scenarios */}
      <div className="space-y-4">
        <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Sample Diagnostic Scenarios (AT-01 to AT-06)
          </h2>
          <span className="text-xs text-stone-600">Click to load test data</span>
        </div>

        <div className="border border-stone-200 rounded-lg overflow-hidden bg-white divide-y divide-stone-100">
          {ACCEPTANCE_SCENARIOS.map((scenario) => {
            return (
              <button
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className="w-full text-left p-3 sm:px-4 hover:bg-stone-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-900">
                      {scenario.title}
                    </span>
                    <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                      {scenario.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 truncate mt-0.5">
                    {scenario.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs text-stone-600">
                  <span className="font-mono">{scenario.expectedStatus}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <div className="text-xs text-stone-600">
          Selected: <strong className="text-stone-900 font-semibold">{WORKFLOWS.find((w) => w.id === selectedWorkflowId)?.title}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
