'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Anchor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Layers,
  Scale,
} from 'lucide-react';
import { DocumentRecord, HarmonyAnalysisResult, WorkflowConfig } from '@/types';
import { DiffVisualizer } from './DiffVisualizer';
import {
  AadhaarCardPreview,
  PanCardPreview,
  MarksheetPreview,
  BankPassbookPreview,
} from './DocumentCards';

interface Step4HarmonyReportProps {
  analysis: HarmonyAnalysisResult;
  documents: DocumentRecord[];
  workflow: WorkflowConfig;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step4HarmonyReport: React.FC<Step4HarmonyReportProps> = ({
  analysis,
  documents,
  onPrevStep,
  onNextStep,
}) => {
  const { overallStatus, harmonyScore, statusSummary, fieldResults, anchorAnalysis } = analysis;
  const [selectedProofType, setSelectedProofType] = useState<string>('aadhaar');

  const getStatusBadge = (status: 'GREEN' | 'AMBER' | 'RED' | 'UNAVAILABLE') => {
    if (status === 'GREEN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Consistent (Green)
        </span>
      );
    }
    if (status === 'AMBER') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Action Needed (Amber)
        </span>
      );
    }
    if (status === 'RED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200 shadow-2xs">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Mismatch (Red)
        </span>
      );
    }
    return <span className="text-xs font-mono text-slate-400">—</span>;
  };

  const nameResult = fieldResults.find((f) => f.fieldName === 'name');
  const dobResult = fieldResults.find((f) => f.fieldName === 'dob');
  const fatherResult = fieldResults.find((f) => f.fieldName === 'fatherName');

  const uploadedDocs = documents.filter((d) => d.isUploaded);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* 1. Master Score Cockpit */}
      <div className="rounded-3xl bg-white p-5 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Radial Score Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`${
                  overallStatus === 'GREEN'
                    ? 'stroke-emerald-600'
                    : overallStatus === 'AMBER'
                    ? 'stroke-amber-500'
                    : 'stroke-rose-600'
                } transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * harmonyScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                {harmonyScore}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                / 100
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Audit Result
              </span>
              {getStatusBadge(overallStatus)}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#0c2340] tracking-tight">
              {overallStatus === 'GREEN'
                ? 'All Documents in Optimal Statutory Harmony'
                : overallStatus === 'AMBER'
                ? 'Minor Abbreviation / Variance Identified'
                : 'Blocking Statutory Discrepancy Found'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {statusSummary}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-xs font-mono text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex-1 sm:flex-none">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Audited Proofs:</span>
            <span className="font-bold text-slate-900 text-xs">{uploadedDocs.length} Official Records</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex-1 sm:flex-none">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Authoritative Anchor:</span>
            <span className="font-bold text-emerald-700 text-xs truncate max-w-[170px] inline-block">
              {anchorAnalysis.anchorDocTitle || 'Class 10 Marksheet'}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Statutory Precedence Hierarchy */}
      <div className="rounded-3xl bg-white p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-700" />
            <h3 className="font-bold text-sm text-[#0c2340]">
              Statutory Precedence & Conflict Resolution Hierarchy
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-slate-700 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 w-max">
            Supreme Court Guidelines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 text-xs">
          {/* Step 1 Precedence */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-900">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-center text-xs flex items-center justify-center font-mono">1</span>
              <span>Tier-1 Date of Birth Anchor</span>
            </div>
            <p className="font-bold text-slate-900 text-xs mt-1">Class 10th / 12th Marksheet</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Conclusive proof for Date of Birth and Father&apos;s Name across Indian tribunals.
            </p>
          </div>

          {/* Step 2 Precedence */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-center text-xs flex items-center justify-center font-mono">2</span>
              <span>Tier-2 Identity & Biometric Anchor</span>
            </div>
            <p className="font-bold text-slate-900 text-xs mt-1">Aadhaar (UIDAI)</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Mandatory anchor for biometric KYC authentication and demographic matching.
            </p>
          </div>

          {/* Step 3 Precedence */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-center text-xs flex items-center justify-center font-mono">3</span>
              <span>Tier-3 Dependent Financial ID</span>
            </div>
            <p className="font-bold text-slate-900 text-xs mt-1">PAN Card (Income Tax Dept)</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Derived tax record; must be updated to match the authoritative Aadhaar / Marksheet record.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
          <Anchor className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-bold">Active Case Legal Determination:</strong>{' '}
            {anchorAnalysis.rationale}
          </div>
        </div>
      </div>

      {/* 3. Interactive Physical Proofs Comparison (Clean Mobile Stack) */}
      <div className="rounded-3xl bg-white p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0c2340] shrink-0" />
            <h3 className="font-bold text-sm text-[#0c2340] whitespace-nowrap">
              Interactive Proof Inspector
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {uploadedDocs.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedProofType(d.type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedProofType === d.type
                    ? 'bg-[#0c2340] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                {d.type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          {selectedProofType === 'aadhaar' && (
            <AadhaarCardPreview document={documents.find((d) => d.type === 'aadhaar') || documents[0]} isActive />
          )}
          {selectedProofType === 'pan' && (
            <PanCardPreview document={documents.find((d) => d.type === 'pan') || documents[0]} isActive />
          )}
          {selectedProofType === 'marksheet' && (
            <MarksheetPreview document={documents.find((d) => d.type === 'marksheet') || documents[0]} isActive />
          )}
          {selectedProofType === 'bank_passbook' && (
            <BankPassbookPreview document={documents.find((d) => d.type === 'bank_passbook') || documents[0]} isActive />
          )}
        </div>
      </div>

      {/* 4. Cross Comparison Matrix Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#0c2340]" />
            <h3 className="font-bold text-sm text-slate-900">
              Attribute Cross-Comparison Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            3 Core Identity Fields
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
                <th className="p-3.5 sm:p-4 pl-4 sm:pl-6 font-bold whitespace-nowrap">Attribute</th>
                <th className="p-3.5 sm:p-4 font-bold whitespace-nowrap">Status</th>
                <th className="p-3.5 sm:p-4 font-bold whitespace-nowrap">Canonical Target</th>
                <th className="p-3.5 sm:p-4 font-bold whitespace-nowrap">Aadhaar (UIDAI)</th>
                <th className="p-3.5 sm:p-4 font-bold whitespace-nowrap">PAN Card (ITD)</th>
                <th className="p-3.5 sm:p-4 pr-4 sm:pr-6 font-bold whitespace-nowrap">Marksheet / Bank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {fieldResults.map((result) => (
                <tr key={result.fieldName} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 sm:p-4 pl-4 sm:pl-6 font-sans font-bold text-slate-900 whitespace-nowrap">
                    {result.fieldLabel}
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">{getStatusBadge(result.status)}</td>
                  <td className="p-3.5 sm:p-4 font-bold text-[#0c2340] whitespace-nowrap">
                    {result.canonicalValue || '—'}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-700 whitespace-nowrap">
                    {result.docValues?.aadhaar || '—'}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-700 whitespace-nowrap">
                    {result.docValues?.pan || '—'}
                  </td>
                  <td className="p-3.5 sm:p-4 pr-4 sm:pr-6 text-slate-700 whitespace-nowrap">
                    {result.docValues?.marksheet || result.docValues?.bank_passbook || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Token Diff Visualizers */}
      {nameResult && nameResult.technicalDetails.tokenDiffs && nameResult.technicalDetails.tokenDiffs.length > 0 && (
        <DiffVisualizer fieldResult={nameResult} />
      )}

      {dobResult && dobResult.technicalDetails.tokenDiffs && dobResult.technicalDetails.tokenDiffs.length > 0 && (
        <DiffVisualizer fieldResult={dobResult} />
      )}

      {fatherResult && fatherResult.technicalDetails.tokenDiffs && fatherResult.technicalDetails.tokenDiffs.length > 0 && (
        <DiffVisualizer fieldResult={fatherResult} />
      )}

      {/* Footer Navigation (Responsive Full-Width Stack on Mobile) */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to OCR Review</span>
        </button>

        <button
          onClick={onNextStep}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none w-full sm:w-auto"
        >
          <span>View Fix Roadmap & Portals</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

    </div>
  );
};
