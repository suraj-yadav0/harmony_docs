'use client';

import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { DocumentRecord, HarmonyAnalysisResult, WorkflowConfig } from '@/types';
import { DiffVisualizer } from './DiffVisualizer';

interface Step4HarmonyReportProps {
  analysis: HarmonyAnalysisResult;
  documents: DocumentRecord[];
  workflow: WorkflowConfig;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step4HarmonyReport: React.FC<Step4HarmonyReportProps> = ({
  analysis,
  onPrevStep,
  onNextStep,
}) => {
  const { overallStatus, harmonyScore, statusSummary, fieldResults, anchorAnalysis } = analysis;

  const getStatusBadge = (status: 'GREEN' | 'AMBER' | 'RED' | 'UNAVAILABLE') => {
    if (status === 'GREEN') {
      return (
        <span className="inline-block font-mono text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Consistent
        </span>
      );
    }
    if (status === 'AMBER') {
      return (
        <span className="inline-block font-mono text-[11px] font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
          Review
        </span>
      );
    }
    if (status === 'RED') {
      return (
        <span className="inline-block font-mono text-[11px] font-medium text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          Mismatch
        </span>
      );
    }
    return <span className="text-[11px] font-mono text-stone-400">—</span>;
  };

  const nameResult = fieldResults.find((f) => f.fieldName === 'name');
  const dobResult = fieldResults.find((f) => f.fieldName === 'dob');
  const fatherResult = fieldResults.find((f) => f.fieldName === 'fatherName');

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Executive Summary */}
      <div className="border border-stone-200 rounded-lg p-5 sm:p-6 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Diagnostic Assessment
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-stone-900">
              Score: {harmonyScore}/100
            </span>
            {getStatusBadge(overallStatus)}
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-stone-900 tracking-tight">
            {overallStatus === 'GREEN'
              ? 'All documents are consistent.'
              : overallStatus === 'AMBER'
              ? 'Minor variations identified.'
              : 'Blocking mismatch identified.'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            {statusSummary}
          </p>
        </div>
      </div>

      {/* Anchor Analysis Callout */}
      <div className="border border-stone-200 rounded-lg p-4 sm:p-5 bg-white text-xs space-y-1.5">
        <span className="font-semibold text-stone-900 block">
          Authoritative Anchor Record:{' '}
          <span className="font-normal text-stone-700">
            {anchorAnalysis.anchorDocTitle || 'Class 10th Marksheet'}
          </span>
        </span>
        <p className="text-stone-600 leading-relaxed">
          {anchorAnalysis.rationale}
        </p>
      </div>

      {/* Matrix Table */}
      <div className="border border-stone-200 rounded-lg bg-white overflow-hidden text-xs">
        <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 font-semibold text-stone-900">
          Attribute Consistency Matrix
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-mono text-stone-500 uppercase">
                <th className="p-3 pl-4 font-semibold">Attribute</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Canonical (Target)</th>
                <th className="p-3 font-semibold">Aadhaar</th>
                <th className="p-3 font-semibold">PAN Card</th>
                <th className="p-3 pr-4 font-semibold">Marksheet / Bank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {fieldResults.map((result) => (
                <tr key={result.fieldName} className="hover:bg-stone-50/50">
                  <td className="p-3 pl-4 font-sans font-medium text-stone-900">
                    {result.fieldLabel}
                  </td>
                  <td className="p-3">{getStatusBadge(result.status)}</td>
                  <td className="p-3 font-semibold text-stone-900">
                    {result.canonicalValue || '—'}
                  </td>
                  <td className="p-3 text-stone-700">
                    {result.docValues?.aadhaar || '—'}
                  </td>
                  <td className="p-3 text-stone-700">
                    {result.docValues?.pan || '—'}
                  </td>
                  <td className="p-3 pr-4 text-stone-700">
                    {result.docValues?.marksheet || result.docValues?.bank_passbook || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Token Diff Visualizers */}
      {nameResult && nameResult.technicalDetails.tokenDiffs && nameResult.technicalDetails.tokenDiffs.length > 0 && (
        <DiffVisualizer fieldResult={nameResult} />
      )}

      {dobResult && dobResult.technicalDetails.tokenDiffs && dobResult.technicalDetails.tokenDiffs.length > 0 && (
        <DiffVisualizer fieldResult={dobResult} />
      )}

      {fatherResult && fatherResult.technicalDetails.tokenDiffs && fatherResult.technicalDetails.tokenDiffs.length > 0 && (
        <DiffVisualizer fieldResult={fatherResult} />
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
          onClick={onNextStep}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <span>View Remediation Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
