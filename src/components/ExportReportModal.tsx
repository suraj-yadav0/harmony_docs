'use client';

import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { DocumentRecord, HarmonyAnalysisResult, WorkflowConfig } from '@/types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: HarmonyAnalysisResult;
  documents: DocumentRecord[];
  workflow: WorkflowConfig;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  documents,
  workflow,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const uploadedDocs = documents.filter((d) => d.isUploaded);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="rounded-3xl p-1 bg-white/[0.08] border border-white/10 w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-y-auto text-white">
        <div className="rounded-[calc(1.5rem-2px)] bg-[#101014] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/8 sticky top-0 bg-[#101014]/95 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Identity Harmony Diagnostic Report
                </h3>
                <p className="text-[11px] text-stone-400 font-mono">
                  Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Masked Record
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-stone-950 hover:bg-stone-200 transition-colors cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Report Content */}
          <div className="p-6 sm:p-8 space-y-6 text-stone-200 printable-area text-xs">
            
            {/* Executive Overview */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-400">
                  Target Workflow: {workflow.title}
                </span>
                <h4 className="text-xl font-extrabold text-white mt-1">
                  Harmony Score: {analysis.harmonyScore} / 100
                </h4>
                <p className="text-xs text-stone-300 mt-1 max-w-md leading-relaxed">
                  {analysis.statusSummary}
                </p>
              </div>

              <div className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-white/10 border border-white/20">
                Status: {analysis.overallStatus}
              </div>
            </div>

            {/* Cross Document Table */}
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-xs tracking-wider">
                Document Comparison Summary
              </h5>
              <div className="border border-white/8 rounded-xl overflow-hidden bg-white/[0.02]">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.04] font-bold text-stone-300 text-[11px] border-b border-white/8">
                    <tr>
                      <th className="p-3">Attribute</th>
                      {uploadedDocs.map((d) => (
                        <th key={d.id} className="p-3">
                          {d.title}
                        </th>
                      ))}
                      <th className="p-3">Consistency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4 font-mono text-xs">
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">Full Name</td>
                      {uploadedDocs.map((d) => (
                        <td key={d.id} className="p-3 text-stone-300">
                          {d.fields.name?.value || '—'}
                        </td>
                      ))}
                      <td className="p-3 font-sans font-bold text-emerald-400">
                        {analysis.fieldResults.find((f) => f.fieldName === 'name')?.status}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">Date of Birth</td>
                      {uploadedDocs.map((d) => (
                        <td key={d.id} className="p-3 text-stone-300">
                          {d.fields.dob?.value || '—'}
                        </td>
                      ))}
                      <td className="p-3 font-sans font-bold text-emerald-400">
                        {analysis.fieldResults.find((f) => f.fieldName === 'dob')?.status}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">Father&apos;s Name</td>
                      {uploadedDocs.map((d) => (
                        <td key={d.id} className="p-3 text-stone-300">
                          {d.fields.fatherName?.value || '—'}
                        </td>
                      ))}
                      <td className="p-3 font-sans font-bold text-emerald-400">
                        {analysis.fieldResults.find((f) => f.fieldName === 'fatherName')?.status}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Remediation Roadmap */}
            <div className="space-y-3">
              <h5 className="font-bold text-white uppercase text-xs tracking-wider">
                Recommended Remediation Roadmap
              </h5>
              <div className="space-y-2">
                {analysis.remediationPlan.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-xl border border-white/8 bg-white/[0.02] flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="space-y-1">
                      <p className="font-bold text-white">{step.actionTitle}</p>
                      <p className="text-stone-300 leading-relaxed">{step.reason}</p>
                      <p className="text-[11px] text-stone-400 font-mono">
                        Authority: <strong>{step.authority}</strong> • Fee: <strong>{step.verifiedFee}</strong> • Timeline: <strong>{step.verifiedTimeline}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Legal Disclaimer */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 text-[11px] text-stone-400 space-y-1">
              <p>
                <strong>Privacy Assurance:</strong> No biometric data, unmasked Aadhaar numbers, or raw images are stored.
              </p>
              <p>
                <strong>Legal Disclaimer:</strong> Document Harmony is an independent identity diagnostic tool and does not alter government databases directly.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
