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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in text-slate-900">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] shadow-2xl overflow-y-auto border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-sm z-10 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0c2340] text-white flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-base truncate">
                Identity Harmony Diagnostic Report
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Masked Record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#0c2340] hover:bg-[#16375f] text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Print / Save PDF</span>
              <span className="xs:hidden">Print</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-4 sm:p-8 space-y-6 text-slate-800 printable-area text-xs">
          
          {/* Executive Overview */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                Target Workflow: {workflow.title}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-[#0c2340] mt-0.5">
                Harmony Score: {analysis.harmonyScore} / 100
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md leading-relaxed">
                {analysis.statusSummary}
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase bg-white border border-slate-300 shadow-2xs">
              Status: {analysis.overallStatus}
            </div>
          </div>

          {/* Cross Document Table */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
              Document Comparison Summary
            </h5>
            <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Attribute</th>
                    {uploadedDocs.map((d) => (
                      <th key={d.id} className="p-3 whitespace-nowrap">
                        {d.title}
                      </th>
                    ))}
                    <th className="p-3 whitespace-nowrap">Consistency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  <tr>
                    <td className="p-3 font-sans font-bold text-slate-900 whitespace-nowrap">Full Name</td>
                    {uploadedDocs.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800 whitespace-nowrap">
                        {d.fields.name?.value || '—'}
                      </td>
                    ))}
                    <td className="p-3 font-sans font-bold text-emerald-700 whitespace-nowrap">
                      {analysis.fieldResults.find((f) => f.fieldName === 'name')?.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-bold text-slate-900 whitespace-nowrap">Date of Birth</td>
                    {uploadedDocs.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800 whitespace-nowrap">
                        {d.fields.dob?.value || '—'}
                      </td>
                    ))}
                    <td className="p-3 font-sans font-bold text-emerald-700 whitespace-nowrap">
                      {analysis.fieldResults.find((f) => f.fieldName === 'dob')?.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-bold text-slate-900 whitespace-nowrap">Father&apos;s Name</td>
                    {uploadedDocs.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800 whitespace-nowrap">
                        {d.fields.fatherName?.value || '—'}
                      </td>
                    ))}
                    <td className="p-3 font-sans font-bold text-emerald-700 whitespace-nowrap">
                      {analysis.fieldResults.find((f) => f.fieldName === 'fatherName')?.status}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Remediation Roadmap */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
              Recommended Remediation Roadmap
            </h5>
            <div className="space-y-2">
              {analysis.remediationPlan.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#0c2340] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">{step.actionTitle}</p>
                    <p className="text-slate-600 leading-relaxed">{step.reason}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Authority: <strong>{step.authority}</strong> • Fee: <strong>{step.verifiedFee}</strong> • Timeline: <strong>{step.verifiedTimeline}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Legal Disclaimer */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-[10px] sm:text-[11px] text-slate-500 space-y-1">
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
  );
};
