'use client';

import React from 'react';
import { FieldComparisonResult } from '@/types';
import { Terminal } from 'lucide-react';

interface DiffVisualizerProps {
  fieldResult: FieldComparisonResult;
}

export const DiffVisualizer: React.FC<DiffVisualizerProps> = ({ fieldResult }) => {
  const tokenDiffs = fieldResult.technicalDetails.tokenDiffs;
  if (!tokenDiffs || tokenDiffs.length === 0) return null;

  return (
    <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8 overflow-hidden text-xs">
      <div className="rounded-xl bg-[#0d0d10] overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-white tracking-tight">
              Token Alignment Matrix: {fieldResult.fieldLabel}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/6">
            {fieldResult.technicalDetails.differenceType.replace('_', ' ')}
          </span>
        </div>

        {/* Breakdown */}
        <div className="p-4 space-y-2.5 font-mono">
          {tokenDiffs.map((item) => {
            return (
              <div
                key={item.docType}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white/[0.02] rounded-lg border border-white/5"
              >
                <span className="text-stone-400 sm:w-44 shrink-0 font-sans font-medium text-xs">
                  {item.docTitle}:
                </span>

                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {item.tokens.map((token, idx) => {
                    if (token.type === 'match') {
                      return (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold"
                        >
                          {token.text}
                        </span>
                      );
                    }
                    if (token.type === 'abbreviated') {
                      return (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
                          title="Abbreviated Initial"
                        >
                          {token.text} <span className="text-[9px] font-sans opacity-70 uppercase">[abbrev]</span>
                        </span>
                      );
                    }
                    if (token.type === 'changed' || token.type === 'inserted') {
                      return (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold"
                          title="Spelling variation"
                        >
                          {token.text} <span className="text-[9px] font-sans opacity-70 uppercase">[diff]</span>
                        </span>
                      );
                    }
                    return (
                      <span key={idx} className="text-stone-300">
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
        <div className="px-4 py-2.5 bg-white/[0.02] text-[11px] text-stone-400 border-t border-white/6 leading-relaxed">
          <strong className="text-stone-200">Precedence Note:</strong>{' '}
          {fieldResult.technicalDetails.differenceType === 'abbreviation' &&
            'Single-letter initials on secondary records trigger automated linking rejections on Income Tax and EPFO portals.'}
          {fieldResult.technicalDetails.differenceType === 'spelling_variation' &&
            'A character spelling variance was detected. Standardize records to the authoritative anchor to pass database validation.'}
          {fieldResult.technicalDetails.differenceType === 'exact_match' &&
            'All records are character-for-character consistent across normalized representations.'}
        </div>

      </div>
    </div>
  );
};
