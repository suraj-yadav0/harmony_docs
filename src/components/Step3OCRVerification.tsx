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
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-white p-5 sm:p-7 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              OCR Verification Gate
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#0c2340] mt-1 tracking-tight">
            3. Forensic OCR Attribute Review
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Confirm that machine-parsed strings strictly mirror physical print. Fix optical misreads before running cross-matching.
          </p>
        </div>

        <button
          onClick={handleVerifyAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition-all cursor-pointer select-none shrink-0 w-full sm:w-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Confirm All Extracted Fields</span>
        </button>
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
              className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 sm:px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {doc.title}
                  </h3>
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 font-medium truncate">
                  {doc.fileName}
                </span>
              </div>

              {/* Fields Table */}
              <div className="divide-y divide-slate-100">
                {fieldEntries.map(([fieldName, field]) => {
                  if (!field) return null;
                  const fieldKey = `${doc.type}_${fieldName}`;
                  const isEditing = editingKey === fieldKey;
                  const isLow = field.rawConfidence < 0.85 && !field.userEdited;

                  return (
                    <div
                      key={fieldName}
                      className="p-3.5 sm:p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      {/* Label & Confidence */}
                      <div className="sm:w-52 shrink-0">
                        <span className="font-bold text-slate-800">
                          {friendlyLabels[fieldName] || fieldName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            {(field.rawConfidence * 100).toFixed(0)}% confidence
                          </span>
                          {isLow && (
                            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                              Review Spelling
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
                              className="w-full text-xs font-mono font-bold text-slate-950 px-3 py-1.5 rounded-lg border border-[#0c2340] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(doc.type, fieldName)}
                              className="p-1.5 rounded-lg bg-[#0c2340] text-white hover:bg-[#16375f] transition-colors cursor-pointer shrink-0"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 transition-colors">
                            <span className="font-mono font-bold text-slate-900 truncate">
                              {field.value || '—'}
                            </span>
                            <button
                              onClick={() => handleStartEdit(doc.type, fieldName, field.value)}
                              className="text-slate-400 hover:text-slate-900 p-1 rounded transition-colors cursor-pointer"
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
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerifyField(doc.type, fieldName)}
                            className="text-[11px] font-bold text-[#0c2340] hover:underline cursor-pointer"
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
          );
        })}
      </div>

      {/* Footer Navigation (Responsive Full-Width Stack on Mobile) */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Proofs</span>
        </button>

        <button
          onClick={onNextStep}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none w-full sm:w-auto"
        >
          <span>Calculate Harmony Matrix</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

    </div>
  );
};
