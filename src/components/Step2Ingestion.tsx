'use client';

import React, { useState } from 'react';
import {
  Upload,
  Camera,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { DocumentRecord, DocumentType, WorkflowConfig } from '@/types';
import { CameraModal } from './CameraModal';

interface Step2IngestionProps {
  documents: DocumentRecord[];
  workflow: WorkflowConfig;
  onUpdateDocuments: (docs: DocumentRecord[]) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

type SampleFields = DocumentRecord['fields'];

const DOC_METADATA: Record<
  DocumentType,
  { label: string; p0: boolean; authority: string; sampleData: SampleFields }
> = {
  aadhaar: {
    label: 'Aadhaar Card',
    authority: 'UIDAI',
    p0: true,
    sampleData: {
      name: { value: 'Suraj Kumar Yadav', rawConfidence: 0.99, isUserVerified: true },
      dob: { value: '15/08/2001', rawConfidence: 0.98, isUserVerified: true },
      gender: { value: 'Male' as const, rawConfidence: 0.99, isUserVerified: true },
      docNumberMasked: { value: 'XXXX-XXXX-8921', rawConfidence: 0.99, isUserVerified: true },
    },
  },
  pan: {
    label: 'PAN Card',
    authority: 'Income Tax Department / NSDL',
    p0: true,
    sampleData: {
      name: { value: 'Suraj K Yadav', rawConfidence: 0.98, isUserVerified: true },
      dob: { value: '15/08/2001', rawConfidence: 0.98, isUserVerified: true },
      fatherName: { value: 'Suresh Kumar Yadav', rawConfidence: 0.96, isUserVerified: true },
      docNumberMasked: { value: 'ABCDE****F', rawConfidence: 0.99, isUserVerified: true },
    },
  },
  bank_passbook: {
    label: 'Bank Passbook / Statement',
    authority: 'Reserve Bank of India KYC',
    p0: true,
    sampleData: {
      name: { value: 'Suraj Kumar Yadav', rawConfidence: 0.97, isUserVerified: true },
      bankName: { value: 'State Bank of India', rawConfidence: 0.98, isUserVerified: true },
      docNumberMasked: { value: 'XXXXXXXX4512', rawConfidence: 0.95, isUserVerified: true },
    },
  },
  marksheet: {
    label: 'Class 10th / 12th Marksheet',
    authority: 'CBSE / State Board',
    p0: true,
    sampleData: {
      name: { value: 'Suraj Kumar Yadav', rawConfidence: 0.98, isUserVerified: true },
      dob: { value: '15/08/2001', rawConfidence: 0.99, isUserVerified: true },
      fatherName: { value: 'Suresh Kumar Yadav', rawConfidence: 0.97, isUserVerified: true },
      docNumberMasked: { value: 'CBSE/2017/89124', rawConfidence: 0.96, isUserVerified: true },
    },
  },
  bank_statement: { label: 'Bank Statement', authority: 'Bank', p0: false, sampleData: {} },
  voter_id: { label: 'Voter ID (EPIC)', authority: 'Election Commission', p0: false, sampleData: {} },
  passport: { label: 'Passport', authority: 'Ministry of External Affairs', p0: false, sampleData: {} },
  driving_licence: { label: 'Driving Licence', authority: 'Ministry of Road Transport', p0: false, sampleData: {} },
};

export const Step2Ingestion: React.FC<Step2IngestionProps> = ({
  documents,
  workflow,
  onUpdateDocuments,
  onPrevStep,
  onNextStep,
}) => {
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [activeCameraDocType, setActiveCameraDocType] = useState<DocumentType>('aadhaar');

  const uploadedCount = documents.filter((d) => d.isUploaded).length;

  const handleFileUpload = (docType: DocumentType, file: File) => {
    const updated = documents.map((d) => {
      if (d.type === docType) {
        const meta = DOC_METADATA[docType];
        return {
          ...d,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          isUploaded: true,
          fields: meta.sampleData || {},
        };
      }
      return d;
    });
    onUpdateDocuments(updated);
  };

  const handleCameraCapture = (docType: DocumentType, fileName: string) => {
    const updated = documents.map((d) => {
      if (d.type === docType) {
        const meta = DOC_METADATA[docType];
        return {
          ...d,
          fileName,
          fileSize: '1.4 MB',
          isUploaded: true,
          fields: meta.sampleData || {},
        };
      }
      return d;
    });
    onUpdateDocuments(updated);
  };

  const handleRemoveDoc = (docType: DocumentType) => {
    const updated = documents.map((d) => {
      if (d.type === docType) {
        return {
          ...d,
          isUploaded: false,
          fileName: undefined,
          fileSize: undefined,
          fields: {},
        };
      }
      return d;
    });
    onUpdateDocuments(updated);
  };

  const handleLoadSampleForDoc = (docType: DocumentType) => {
    const updated = documents.map((d) => {
      if (d.type === docType) {
        const meta = DOC_METADATA[docType];
        return {
          ...d,
          fileName: `${docType}_scan.pdf`,
          fileSize: '1.2 MB',
          isUploaded: true,
          fields: meta.sampleData || {},
        };
      }
      return d;
    });
    onUpdateDocuments(updated);
  };

  const handleLoadAllSampleDocs = () => {
    const updated = documents.map((d) => {
      const meta = DOC_METADATA[d.type];
      return {
        ...d,
        fileName: `${d.type}_sample.pdf`,
        fileSize: '1.2 MB',
        isUploaded: true,
        fields: meta.sampleData || {},
      };
    });
    onUpdateDocuments(updated);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
            Document Ingestion
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Attach document scans or photograph proofs. Processing is strictly client-side in memory.
          </p>
        </div>

        <button
          onClick={handleLoadAllSampleDocs}
          className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer shrink-0"
        >
          Fill sample documents
        </button>
      </div>

      {/* Document Records List */}
      <div className="border border-stone-200 rounded-lg bg-white divide-y divide-stone-200">
        {documents.map((doc) => {
          const meta = DOC_METADATA[doc.type] || {
            label: doc.title,
            authority: 'Official Authority',
            p0: true,
          };
          const isRequired = workflow.requiredDocs.includes(doc.type);

          return (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Document Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-stone-900">
                    {meta.label}
                  </span>
                  {isRequired && (
                    <span className="text-[10px] uppercase font-mono font-medium text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Issuing Authority: {meta.authority}
                </p>

                {doc.isUploaded && (
                  <div className="mt-2 text-xs text-emerald-800 flex items-center gap-2 font-mono">
                    <span className="inline-flex items-center gap-1 font-sans font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Attached
                    </span>
                    <span className="text-stone-600 truncate">{doc.fileName}</span>
                    <span className="text-stone-400">({doc.fileSize})</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {doc.isUploaded ? (
                  <button
                    onClick={() => handleRemoveDoc(doc.type)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded border border-stone-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                ) : (
                  <>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100 border border-stone-300 rounded cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(doc.type, e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    <button
                      onClick={() => {
                        setActiveCameraDocType(doc.type);
                        setCameraModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100 border border-stone-300 rounded cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-stone-500" />
                      <span>Camera</span>
                    </button>

                    <button
                      onClick={() => handleLoadSampleForDoc(doc.type)}
                      className="text-xs text-stone-600 hover:text-stone-900 underline px-1 cursor-pointer"
                    >
                      Sample
                    </button>
                  </>
                )}
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
          disabled={uploadedCount === 0}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
            uploadedCount > 0
              ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to OCR Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        initialDocType={activeCameraDocType}
        onCapture={(docType: DocumentType, fileName: string) => handleCameraCapture(docType, fileName)}
      />

    </div>
  );
};
