'use client';

import React, { useState } from 'react';
import {
  Edit2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { DocumentRecord, DocumentType, ExtractedField } from '@/types';

interface Step3OCRVerificationProps {
  documents: DocumentRecord[];
  onUpdateDocuments: (docs: DocumentRecord[]) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step3OCRVerification: React.FC<Step3OCRVerificationProps> = ({
  documents,
  onUpdateDocuments,
  onPrevStep,
  onNextStep,
}) => {
  const uploadedDocs = documents.filter((d) => d.isUploaded);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleStartEdit = (docType: DocumentType, fieldKey: string, currentValue: string) => {
    setEditingKey(`${docType}_${fieldKey}`);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (docType: DocumentType, fieldName: keyof DocumentRecord['fields']) => {
    const updated = documents.map((d) => {
      if (d.type === docType && d.fields[fieldName]) {
        const prevField = d.fields[fieldName] as ExtractedField<string>;
        return {
          ...d,
          fields: {
            ...d.fields,
            [fieldName]: {
              ...prevField,
              value: editValue,
              userEdited: true,
              isUserVerified: true,
              rawConfidence: 1.0,
            },
          },
        };
      }
      return d;
    });
    onUpdateDocuments(updated);
    setEditingKey(null);
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
  };

  const handleVerifyField = (
    docType: DocumentType,
    fieldName: keyof DocumentRecord['fields']
  ) => {
    const updated = documents.map((d) => {
      if (d.type === docType && d.fields[fieldName]) {
        const prevField = d.fields[fieldName] as ExtractedField<string>;
        return {
          ...d,
          fields: {
            ...d.fields,
            [fieldName]: {
              ...prevField,
              isUserVerified: true,
            },
          },
        };
      }
      return d;
    });
    onUpdateDocuments(updated);
  };

  const handleVerifyAll = () => {
    const updated = documents.map((d) => {
      if (d.isUploaded) {
        const fields = d.fields;
        const verifiedFields: DocumentRecord['fields'] = {
          name: fields.name ? { ...fields.name, isUserVerified: true } : undefined,
          dob: fields.dob ? { ...fields.dob, isUserVerified: true } : undefined,
          fatherName: fields.fatherName ? { ...fields.fatherName, isUserVerified: true } : undefined,
          gender: fields.gender ? { ...fields.gender, isUserVerified: true } : undefined,
          docNumberMasked: fields.docNumberMasked ? { ...fields.docNumberMasked, isUserVerified: true } : undefined,
          bankName: fields.bankName ? { ...fields.bankName, isUserVerified: true } : undefined,
          issueDate: fields.issueDate ? { ...fields.issueDate, isUserVerified: true } : undefined,
        };
        return { ...d, fields: verifiedFields };
      }
      return d;
    });
    onUpdateDocuments(updated);
  };

  const friendlyLabels: Record<string, string> = {
    name: 'Full Name',
    dob: 'Date of Birth (DOB)',
    gender: 'Gender',
    fatherName: "Father's Name",
    docNumberMasked: 'Document Certificate ID',
    bankName: 'Bank Institution Name',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8">
        <div className="rounded-xl bg-[#101014] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                OCR Verification Gate
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight">
              3. Forensic OCR Attribute Review
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Confirm extracted strings match physical records. Fix optical typos before matching.
            </p>
          </div>

          <button
            onClick={handleVerifyAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-all cursor-pointer select-none shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Confirm All Fields</span>
          </button>
        </div>
      </div>

      {/* Extracted Fields by Document */}
      <div className="space-y-4">
        {uploadedDocs.map((doc) => {
          const fieldEntries = Object.entries(doc.fields) as [
            keyof DocumentRecord['fields'],
            ExtractedField<string> | undefined
          ][];

          return (
            <div
              key={doc.id}
              className="rounded-2xl p-1 bg-white/[0.03] border border-white/8 overflow-hidden"
            >
              <div className="rounded-xl bg-[#111115] overflow-hidden">
                
                {/* Header */}
                <div className="px-5 py-3 bg-white/[0.02] border-b border-white/6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-stone-300">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-white">
                      {doc.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-stone-400">
                    {doc.fileName}
                  </span>
                </div>

                {/* Fields Table */}
                <div className="divide-y divide-white/4">
                  {fieldEntries.map(([fieldName, field]) => {
                    if (!field) return null;
                    const fieldKey = `${doc.type}_${fieldName}`;
                    const isEditing = editingKey === fieldKey;
                    const isLow = field.rawConfidence < 0.85 && !field.userEdited;

                    return (
                      <div
                        key={fieldName}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        {/* Label & Confidence */}
                        <div className="sm:w-52 shrink-0">
                          <span className="font-medium text-stone-200">
                            {friendlyLabels[fieldName] || fieldName}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-stone-400">
                              {(field.rawConfidence * 100).toFixed(0)}% confidence
                            </span>
                            {isLow && (
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                                Low confidence
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Value / Quick Editor */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full text-xs font-mono font-bold text-white px-3 py-1.5 rounded-lg border border-white/30 bg-[#0c0c0e] focus:outline-none focus:ring-1 focus:ring-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(doc.type, fieldName)}
                                className="p-1.5 rounded-lg bg-white text-stone-950 hover:bg-stone-200 transition-colors cursor-pointer shrink-0"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 rounded-lg bg-white/[0.06] text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2 bg-white/[0.02] hover:bg-white/[0.04] p-2 rounded-xl border border-white/6 transition-colors">
                              <span className="font-mono font-semibold text-white truncate">
                                {field.value || '—'}
                              </span>
                              <button
                                onClick={() => handleStartEdit(doc.type, fieldName, field.value)}
                                className="text-stone-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                                title="Edit extracted value"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Verification Status */}
                        <div className="sm:w-28 shrink-0 sm:text-right">
                          {field.isUserVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerifyField(doc.type, fieldName)}
                              className="text-[11px] font-mono text-stone-400 hover:text-white underline cursor-pointer"
                            >
                              Mark Valid
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-white/8">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-stone-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Proofs</span>
        </button>

        <button
          onClick={onNextStep}
          className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <span>Calculate Diagnostics</span>
          <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

    </div>
  );
};
