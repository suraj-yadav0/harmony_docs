'use client';

import React, { useState } from 'react';
import {
  Upload,
  Camera,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  Sparkles,
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
  { label: string; p0: boolean; authority: string; code: string; sampleData: SampleFields }
> = {
  aadhaar: {
    label: 'Aadhaar Card',
    authority: 'Unique Identification Authority of India',
    code: 'UIDAI',
    p0: true,
    sampleData: {
      name: { value: 'Suraj Kumar Yadav', rawConfidence: 0.99, isUserVerified: true },
      dob: { value: '15/08/2001', rawConfidence: 0.98, isUserVerified: true },
      gender: { value: 'Male' as const, rawConfidence: 0.99, isUserVerified: true },
      docNumberMasked: { value: 'XXXX-XXXX-8921', rawConfidence: 0.99, isUserVerified: true },
    },
  },
  pan: {
    label: 'Permanent Account Number (PAN)',
    authority: 'Income Tax Department / Protean',
    code: 'ITD/NSDL',
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
    authority: 'Reserve Bank of India KYC Spec',
    code: 'RBI/KYC',
    p0: true,
    sampleData: {
      name: { value: 'Suraj Kumar Yadav', rawConfidence: 0.97, isUserVerified: true },
      bankName: { value: 'State Bank of India', rawConfidence: 0.98, isUserVerified: true },
      docNumberMasked: { value: 'XXXXXXXX4512', rawConfidence: 0.95, isUserVerified: true },
    },
  },
  marksheet: {
    label: 'Class 10th / 12th Marksheet',
    authority: 'Central / State Education Board',
    code: 'CBSE/BOARD',
    p0: true,
    sampleData: {
      name: { value: 'Suraj Kumar Yadav', rawConfidence: 0.98, isUserVerified: true },
      dob: { value: '15/08/2001', rawConfidence: 0.99, isUserVerified: true },
      fatherName: { value: 'Suresh Kumar Yadav', rawConfidence: 0.97, isUserVerified: true },
      docNumberMasked: { value: 'CBSE/2017/89124', rawConfidence: 0.96, isUserVerified: true },
    },
  },
  bank_statement: { label: 'Bank Statement', authority: 'Bank', code: 'BANK', p0: false, sampleData: {} },
  voter_id: { label: 'Voter ID (EPIC)', authority: 'Election Commission', code: 'ECI', p0: false, sampleData: {} },
  passport: { label: 'Passport', authority: 'Ministry of External Affairs', code: 'MEA', p0: false, sampleData: {} },
  driving_licence: { label: 'Driving Licence', authority: 'Ministry of Road Transport', code: 'SARATHI', p0: false, sampleData: {} },
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
          fileName: `${docType}_verified_scan.pdf`,
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
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/8">
        <div className="rounded-xl bg-[#101014] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.06] text-stone-300 border border-white/10">
                {workflow.title}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {uploadedCount} of {documents.length} Proofs Loaded
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight">
              2. Ingest Official Identity Proofs
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Files are evaluated in-memory. Zero document transmission to persistent cloud storage.
            </p>
          </div>

          <button
            onClick={handleLoadAllSampleDocs}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/10 transition-all cursor-pointer select-none shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-300" />
            <span>Autofill All Proofs</span>
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const meta = DOC_METADATA[doc.type] || {
            label: doc.title,
            authority: 'Official Authority',
            code: 'DOC',
            p0: true,
          };
          const isRequired = workflow.requiredDocs.includes(doc.type);

          return (
            <div
              key={doc.id}
              className={`rounded-2xl p-1 transition-all ${
                doc.isUploaded
                  ? 'bg-gradient-to-b from-emerald-500/20 to-transparent border border-emerald-500/30'
                  : isRequired
                  ? 'bg-white/[0.04] border border-white/10'
                  : 'bg-white/[0.02] border border-white/5 opacity-70'
              }`}
            >
              <div className="h-full rounded-xl bg-[#111115] p-5 flex flex-col justify-between space-y-4">
                
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-stone-400">
                          [{meta.code}]
                        </span>
                        <h3 className="font-bold text-sm text-white">
                          {meta.label}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {meta.authority}
                      </p>
                    </div>

                    {doc.isUploaded ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Attached
                      </span>
                    ) : isRequired ? (
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-400 bg-white/[0.06] px-2 py-0.5 rounded">
                        Required
                      </span>
                    ) : null}
                  </div>

                  {/* Upload State Box */}
                  {doc.isUploaded ? (
                    <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {doc.fileName || `${doc.type}_scan.pdf`}
                          </p>
                          <p className="text-[10px] font-mono text-stone-400">
                            {doc.fileSize || '1.1 MB'} • Memory Ingested
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveDoc(doc.type)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-stone-950 hover:bg-stone-200 cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Scan</span>
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-stone-200 border border-white/10 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-stone-400" />
                        <span>Camera</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Sample Trigger */}
                {!doc.isUploaded && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-mono">Quick test?</span>
                    <button
                      onClick={() => handleLoadSampleForDoc(doc.type)}
                      className="text-stone-300 hover:text-white font-medium underline underline-offset-2 cursor-pointer"
                    >
                      Fill sample {meta.code}
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 flex items-center justify-between border-t border-white/8">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-stone-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Intent</span>
        </button>

        <button
          onClick={onNextStep}
          disabled={uploadedCount === 0}
          className={`group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full font-bold text-xs sm:text-sm shadow-xl transition-all select-none active:scale-[0.98] ${
            uploadedCount > 0
              ? 'bg-white hover:bg-stone-200 text-stone-950 cursor-pointer'
              : 'bg-white/10 text-stone-500 cursor-not-allowed border border-white/5'
          }`}
        >
          <span>Verify Extracted Attributes</span>
          <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
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
