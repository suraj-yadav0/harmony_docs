'use client';

import React from 'react';
import { FieldComparisonResult } from '@/types';
import { SplitSquareVertical, FileText, AlertCircle } from 'lucide-react';

interface DiffVisualizerProps {
  fieldResult: FieldComparisonResult;
}

export const DiffVisualizer: React.FC<DiffVisualizerProps> = ({ fieldResult }) => {
  const tokenDiffs = fieldResult.technicalDetails.tokenDiffs;
  if (!tokenDiffs || tokenDiffs.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden text-xs">
      
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SplitSquareVertical className="w-4 h-4 text-[#0c2340]" />
          <span className="font-extrabold text-slate-900 tracking-tight">
            Character & Token Alignment Matrix: {fieldResult.fieldLabel}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
          {fieldResult.technicalDetails.differenceType.replace('_', ' ')}
        </span>
      </div>

      {/* Breakdown */}
      <div className="p-5 space-y-3 font-mono">
        {tokenDiffs.map((item) => {
          return (
            <div
              key={item.docType}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80"
            >
              <div className="flex items-center gap-2 sm:w-48 shrink-0">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-800 font-sans font-bold text-xs">
                  {item.docTitle}:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                {item.tokens.map((token, idx) => {
                  if (token.type === 'match') {
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs"
                      >
                        {token.text}
                      </span>
                    );
                  }
                  if (token.type === 'abbreviated') {
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-bold shadow-2xs flex items-center gap-1"
                        title="Abbreviated Initial detected"
                      >
                        <span>{token.text}</span>
                        <span className="text-[9px] font-sans font-black bg-amber-300 text-amber-950 px-1 rounded uppercase">
                          ABBREV
                        </span>
                      </span>
                    );
                  }
                  if (token.type === 'changed' || token.type === 'inserted') {
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 border border-rose-300 font-bold shadow-2xs flex items-center gap-1"
                        title="Spelling variation detected"
                      >
                        <span>{token.text}</span>
                        <span className="text-[9px] font-sans font-black bg-rose-200 text-rose-900 px-1 rounded uppercase">
                          DIFF
                        </span>
                      </span>
                    );
                  }
                  return (
                    <span key={idx} className="text-slate-700 px-1">
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="px-5 py-3 bg-slate-50/70 text-xs text-slate-600 border-t border-slate-200 flex items-start gap-2 leading-relaxed font-sans">
        <AlertCircle className="w-4 h-4 text-[#0c2340] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-bold">Regulatory Guidance:</strong>{' '}
          {fieldResult.technicalDetails.differenceType === 'abbreviation' &&
            'Single-letter initials on secondary records will fail exact match verification on Income Tax and EPFO portals. Standardize to full expanded name.'}
          {fieldResult.technicalDetails.differenceType === 'spelling_variation' &&
            'A character spelling variance (edit distance = 1) was detected. Update non-anchor records to mirror the authoritative anchor.'}
          {fieldResult.technicalDetails.differenceType === 'exact_match' &&
            'All records are character-for-character consistent across normalized representations.'}
        </div>
      </div>

    </div>
  );
};
