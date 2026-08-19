'use client';

import React from 'react';
import { FieldComparisonResult } from '@/types';

interface DiffVisualizerProps {
  fieldResult: FieldComparisonResult;
}

export const DiffVisualizer: React.FC<DiffVisualizerProps> = ({ fieldResult }) => {
  const tokenDiffs = fieldResult.technicalDetails.tokenDiffs;
  if (!tokenDiffs || tokenDiffs.length === 0) return null;

  return (
    <div className="border border-stone-200 rounded-lg bg-white overflow-hidden text-xs">
      {/* Header */}
      <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
        <span className="font-semibold text-stone-900">
          Token Alignment: {fieldResult.fieldLabel}
        </span>
        <span className="text-[11px] font-mono text-stone-500">
          {fieldResult.technicalDetails.differenceType.replace('_', ' ')}
        </span>
      </div>

      {/* Token breakdown */}
      <div className="p-4 space-y-2 font-mono">
        {tokenDiffs.map((item) => {
          return (
            <div
              key={item.docType}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-stone-50/50 rounded border border-stone-100"
            >
              <span className="text-stone-600 sm:w-44 shrink-0 font-sans font-medium">
                {item.docTitle}:
              </span>

              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                {item.tokens.map((token, idx) => {
                  if (token.type === 'match') {
                    return (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        {token.text}
                      </span>
                    );
                  }
                  if (token.type === 'abbreviated') {
                    return (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-semibold"
                        title="Abbreviated Initial"
                      >
                        {token.text} (abbrev)
                      </span>
                    );
                  }
                  if (token.type === 'changed' || token.type === 'inserted') {
                    return (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-300 font-semibold"
                        title="Spelling variation"
                      >
                        {token.text} (diff)
                      </span>
                    );
                  }
                  return (
                    <span key={idx} className="text-stone-700">
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="bg-stone-50 px-4 py-2 text-[11px] text-stone-600 border-t border-stone-200">
        <strong className="font-medium text-stone-800">Note:</strong>{' '}
        {fieldResult.technicalDetails.differenceType === 'abbreviation' &&
          'Single initials on secondary records may trigger automated linking rejections on Income Tax or EPFO portals.'}
        {fieldResult.technicalDetails.differenceType === 'spelling_variation' &&
          'A character variation was detected. Update the non-anchor record to match the canonical name.'}
        {fieldResult.technicalDetails.differenceType === 'exact_match' &&
          'All records are character-for-character consistent.'}
      </div>
    </div>
  );
};
