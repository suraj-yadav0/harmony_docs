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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Consistent (Green)
        </span>
      );
    }
    if (status === 'AMBER') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Action Needed (Amber)
        </span>
      );
    }
    if (status === 'RED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Mismatch (Red)
        </span>
      );
    }
    return <span className="text-xs font-mono text-stone-500">—</span>;
  };

  const nameResult = fieldResults.find((f) => f.fieldName === 'name');
  const dobResult = fieldResults.find((f) => f.fieldName === 'dob');
  const fatherResult = fieldResults.find((f) => f.fieldName === 'fatherName');

  const uploadedDocs = documents.filter((d) => d.isUploaded);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Master Score Cockpit */}
      <div className="rounded-[2rem] p-1 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl">
        <div className="rounded-[calc(2rem-0.25rem)] bg-[#0f0f13] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Radial score gauge */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${
                    overallStatus === 'GREEN'
                      ? 'stroke-emerald-400'
                      : overallStatus === 'AMBER'
                      ? 'stroke-amber-400'
                      : 'stroke-rose-400'
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * harmonyScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {harmonyScore}
                </span>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  / 100
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                  Diagnostic Result
                </span>
                {getStatusBadge(overallStatus)}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {overallStatus === 'GREEN'
                  ? 'All Document Proofs in Optimal Harmony'
                  : overallStatus === 'AMBER'
                  ? 'Identified Abbreviation / Minor Discrepancy'
                  : 'Critical Discrepancy Identified'}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                {statusSummary}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/8 pt-4 md:pt-0 md:pl-6 text-xs font-mono text-stone-400">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/6">
              <span className="text-[9px] uppercase tracking-wider block text-stone-500">Proofs Audited:</span>
              <span className="font-bold text-white text-xs">{uploadedDocs.length} Official Records</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/6">
              <span className="text-[9px] uppercase tracking-wider block text-stone-500">Anchor:</span>
              <span className="font-bold text-emerald-400 text-xs truncate max-w-[150px] inline-block">
                {anchorAnalysis.anchorDocTitle || 'Class 10 Marksheet'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Visual Precedence Hierarchy Flow */}
      <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8">
        <div className="rounded-xl bg-[#111115] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/6 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-white">
                Statutory Precedence & Conflict Resolution Hierarchy
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-stone-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/6">
              Supreme Court Guidelines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Step 1 Precedence */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-300">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 text-center text-xs flex items-center justify-center">1</span>
                <span>Tier-1 Date of Birth Anchor</span>
              </div>
              <p className="font-bold text-white text-xs mt-1">Class 10th / 12th Marksheet</p>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Primary conclusive proof for Date of Birth and Father&apos;s Name across Indian tribunals.
              </p>
            </div>

            {/* Step 2 Precedence */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-center text-xs flex items-center justify-center">2</span>
                <span>Tier-2 Identity & Biometric Anchor</span>
              </div>
              <p className="font-bold text-white text-xs mt-1">Aadhaar (UIDAI)</p>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Mandatory anchor for biometric KYC authentication and demographic matching.
              </p>
            </div>

            {/* Step 3 Precedence */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-300">
                <span className="w-5 h-5 rounded-full bg-blue-500/30 text-center text-xs flex items-center justify-center">3</span>
                <span>Tier-3 Dependent Financial ID</span>
              </div>
              <p className="font-bold text-white text-xs mt-1">PAN Card (Income Tax Dept)</p>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Derived tax record; must be updated to match the authoritative Aadhaar / Marksheet record.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-stone-300 flex items-start gap-2">
            <Anchor className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Active Case Determination:</strong>{' '}
              {anchorAnalysis.rationale}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Physical Proofs Comparison */}
      <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8 space-y-3">
        <div className="rounded-xl bg-[#111115] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/6 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                Interactive Proof Inspector
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {uploadedDocs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedProofType(d.type)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    selectedProofType === d.type
                      ? 'bg-white text-stone-950 shadow-sm'
                      : 'bg-white/[0.04] text-stone-400 hover:text-white'
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
      </div>

      {/* 4. Cross Comparison Matrix Table */}
      <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8 overflow-hidden text-xs">
        <div className="rounded-xl bg-[#111115] overflow-hidden">
          <div className="px-5 py-3 bg-white/[0.02] border-b border-white/6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-stone-300" />
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Attribute Cross-Comparison Matrix
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              3 Core Identity Fields
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/6 text-[10px] font-mono text-stone-400 uppercase">
                  <th className="p-3.5 pl-5 font-bold">Attribute</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold">Canonical Value</th>
                  <th className="p-3.5 font-bold">Aadhaar</th>
                  <th className="p-3.5 font-bold">PAN Card</th>
                  <th className="p-3.5 pr-5 font-bold">Marksheet / Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4 font-mono text-xs">
                {fieldResults.map((result) => (
                  <tr key={result.fieldName} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-5 font-sans font-bold text-white">
                      {result.fieldLabel}
                    </td>
                    <td className="p-3.5">{getStatusBadge(result.status)}</td>
                    <td className="p-3.5 font-bold text-white">
                      {result.canonicalValue || '—'}
                    </td>
                    <td className="p-3.5 text-stone-300">
                      {result.docValues?.aadhaar || '—'}
                    </td>
                    <td className="p-3.5 text-stone-300">
                      {result.docValues?.pan || '—'}
                    </td>
                    <td className="p-3.5 pr-5 text-stone-300">
                      {result.docValues?.marksheet || result.docValues?.bank_passbook || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-white/8">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-stone-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to OCR Review</span>
        </button>

        <button
          onClick={onNextStep}
          className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <span>View Fix Roadmap & Portals</span>
          <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

    </div>
  );
};
