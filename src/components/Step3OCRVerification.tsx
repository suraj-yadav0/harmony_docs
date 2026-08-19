'use client';

import React, { useState } from 'react';
import {
  Edit2,
  ArrowRight,
  ArrowLeft,
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
    dob: 'Date of Birth',
    gender: 'Gender',
    fatherName: "Father's Name",
    docNumberMasked: 'Document Number',
    bankName: 'Bank Name',
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
            OCR Verification
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Verify that machine-extracted values exactly match the printed text on your physical proofs.
          </p>
        </div>

        <button
          onClick={handleVerifyAll}
          className="text-xs text-stone-700 hover:text-stone-950 font-medium underline underline-offset-2 cursor-pointer shrink-0"
        >
          Confirm all extracted fields
        </button>
      </div>

      {/* Extracted Fields by Document */}
      <div className="space-y-6">
        {uploadedDocs.map((doc) => {
          const fieldEntries = Object.entries(doc.fields) as [
            keyof DocumentRecord['fields'],
            ExtractedField<string> | undefined
          ][];

          return (
            <div
              key={doc.id}
              className="border border-stone-200 rounded-lg bg-white overflow-hidden"
            >
              {/* Document Header */}
              <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
                <span className="font-semibold text-xs text-stone-900">
                  {doc.title}
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {doc.fileName}
                </span>
              </div>

              {/* Fields Table */}
              <div className="divide-y divide-stone-100">
                {fieldEntries.map(([fieldName, field]) => {
                  if (!field) return null;
                  const fieldKey = `${doc.type}_${fieldName}`;
                  const isEditing = editingKey === fieldKey;
                  const isLow = field.rawConfidence < 0.85 && !field.userEdited;

                  return (
                    <div
                      key={fieldName}
                      className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      {/* Label & confidence */}
                      <div className="sm:w-48 shrink-0">
                        <span className="font-medium text-stone-800">
                          {friendlyLabels[fieldName] || fieldName}
                        </span>
                        <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                          {(field.rawConfidence * 100).toFixed(0)}% confidence
                          {isLow && (
                            <span className="ml-1.5 text-amber-700 font-sans font-medium">
                              (Check spelling)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Value / Input */}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full text-xs font-mono px-2.5 py-1 rounded border border-stone-400 bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(doc.type, fieldName)}
                              className="px-2 py-1 rounded bg-stone-900 text-white text-xs font-medium cursor-pointer shrink-0"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 rounded bg-stone-100 text-stone-700 text-xs font-medium cursor-pointer shrink-0"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 font-mono text-stone-900">
                            <span className="truncate">{field.value || '—'}</span>
                            <button
                              onClick={() => handleStartEdit(doc.type, fieldName, field.value)}
                              className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                              title="Edit value"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="sm:w-24 shrink-0 sm:text-right">
                        {field.isUserVerified ? (
                          <span className="text-[11px] font-mono text-stone-600">
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerifyField(doc.type, fieldName)}
                            className="text-[11px] text-stone-600 hover:text-stone-900 underline cursor-pointer"
                          >
                            Verify
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

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={onNextStep}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <span>Run Harmony Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
