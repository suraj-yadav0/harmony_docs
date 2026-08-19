'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-stone-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">
              Identity Consistency Diagnostic Report
            </h3>
            <p className="text-[11px] text-stone-500 font-mono">
              Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Masked Record
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 space-y-6 text-stone-800 printable-area text-xs">
          
          {/* Executive Overview */}
          <div className="p-4 rounded border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-medium uppercase text-stone-500">
                Purpose: {workflow.title}
              </span>
              <h4 className="text-base font-bold text-stone-900 mt-0.5">
                Harmony Score: {analysis.harmonyScore} / 100
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                {analysis.statusSummary}
              </p>
            </div>

            <div className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-white border border-stone-300">
              Status: {analysis.overallStatus}
            </div>
          </div>

          {/* Cross Document Table */}
          <div className="space-y-2">
            <h5 className="font-semibold text-stone-900 uppercase text-[11px]">
              Document Comparison Matrix
            </h5>
            <div className="border border-stone-200 rounded overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-100 font-semibold text-stone-700 text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">Attribute</th>
                    {uploadedDocs.map((d) => (
                      <th key={d.id} className="p-2.5">
                        {d.title}
                      </th>
                    ))}
                    <th className="p-2.5">Consistency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-xs">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-stone-900">Full Name</td>
                    {uploadedDocs.map((d) => (
                      <td key={d.id} className="p-2.5 text-stone-700">
                        {d.fields.name?.value || '—'}
                      </td>
                    ))}
                    <td className="p-2.5 font-sans font-medium">
                      {analysis.fieldResults.find((f) => f.fieldName === 'name')?.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-stone-900">Date of Birth</td>
                    {uploadedDocs.map((d) => (
                      <td key={d.id} className="p-2.5 text-stone-700">
                        {d.fields.dob?.value || '—'}
                      </td>
                    ))}
                    <td className="p-2.5 font-sans font-medium">
                      {analysis.fieldResults.find((f) => f.fieldName === 'dob')?.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-stone-900">Father&apos;s Name</td>
                    {uploadedDocs.map((d) => (
                      <td key={d.id} className="p-2.5 text-stone-700">
                        {d.fields.fatherName?.value || '—'}
                      </td>
                    ))}
                    <td className="p-2.5 font-sans font-medium">
                      {analysis.fieldResults.find((f) => f.fieldName === 'fatherName')?.status}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Remediation Roadmap */}
          <div className="space-y-2.5">
            <h5 className="font-semibold text-stone-900 uppercase text-[11px]">
              Recommended Remediation Sequence
            </h5>
            <div className="space-y-2">
              {analysis.remediationPlan.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3 rounded border border-stone-200 bg-stone-50/50 flex items-start gap-2.5 text-xs"
                >
                  <span className="font-mono font-bold text-stone-900 shrink-0">
                    {step.stepNumber}.
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-stone-900">{step.actionTitle}</p>
                    <p className="text-stone-600">{step.reason}</p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Authority: {step.authority} • Fee: {step.verifiedFee} • Turnaround: {step.verifiedTimeline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Legal Disclaimer */}
          <div className="p-3 rounded border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <p>
              <strong>Privacy:</strong> No biometric data, unmasked Aadhaar numbers, or raw images are stored.
            </p>
            <p>
              <strong>Notice:</strong> Document Harmony is an independent verification tool and does not directly alter government records.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
