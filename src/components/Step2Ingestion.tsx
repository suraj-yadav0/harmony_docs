'use client';

import React, { useState } from 'react';
import {
  Upload,
  Camera,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { DocumentRecord, DocumentType, WorkflowConfig } from '@/types';
import { CameraModal } from './CameraModal';
import {
  AadhaarCardPreview,
  PanCardPreview,
  MarksheetPreview,
  BankPassbookPreview,
} from './DocumentCards';

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
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('aadhaar');

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

  const renderDocCard = (doc: DocumentRecord) => {
    const isSelected = selectedDocType === doc.type;
    switch (doc.type) {
      case 'aadhaar':
        return (
          <AadhaarCardPreview
            key={doc.id}
            document={doc}
            isActive={isSelected}
            onSelect={() => setSelectedDocType(doc.type)}
          />
        );
      case 'pan':
        return (
          <PanCardPreview
            key={doc.id}
            document={doc}
            isActive={isSelected}
            onSelect={() => setSelectedDocType(doc.type)}
          />
        );
      case 'marksheet':
        return (
          <MarksheetPreview
            key={doc.id}
            document={doc}
            isActive={isSelected}
            onSelect={() => setSelectedDocType(doc.type)}
          />
        );
      case 'bank_passbook':
        return (
          <BankPassbookPreview
            key={doc.id}
            document={doc}
            isActive={isSelected}
            onSelect={() => setSelectedDocType(doc.type)}
          />
        );
      default:
        return null;
    }
  };

  const currentSelectedDoc = documents.find((d) => d.type === selectedDocType) || documents[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-white p-5 sm:p-7 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {workflow.title}
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">
              {uploadedCount} of {documents.length} Proofs Loaded
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#0c2340] mt-1 tracking-tight">
            2. Ingest Official Identity Proofs
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Click any physical card below to upload high-resolution scans or take photos via camera.
          </p>
        </div>

        <button
          onClick={handleLoadAllSampleDocs}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-200 transition-all cursor-pointer select-none shrink-0 w-full sm:w-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Autofill All Proofs</span>
        </button>
      </div>

      {/* Interactive Document Physical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {documents.map((doc) => renderDocCard(doc))}
      </div>

      {/* Selected Document Action Bar */}
      {currentSelectedDoc && (
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              Active Selection:
            </span>
            <h4 className="text-sm font-bold text-[#0c2340] mt-0.5 truncate">
              {DOC_METADATA[currentSelectedDoc.type]?.label || currentSelectedDoc.title}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 font-mono truncate">
              {currentSelectedDoc.isUploaded
                ? `Attached: ${currentSelectedDoc.fileName} (${currentSelectedDoc.fileSize})`
                : 'No document file currently uploaded for this proof.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            {currentSelectedDoc.isUploaded ? (
              <button
                onClick={() => handleRemoveDoc(currentSelectedDoc.type)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Proof</span>
              </button>
            ) : (
              <>
                <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0c2340] hover:bg-[#16375f] text-white cursor-pointer transition-colors shadow-xs flex-1 sm:flex-none">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(currentSelectedDoc.type, e.target.files[0]);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={() => {
                    setActiveCameraDocType(currentSelectedDoc.type);
                    setCameraModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer flex-1 sm:flex-none"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span>Camera</span>
                </button>

                <button
                  onClick={() => handleLoadSampleForDoc(currentSelectedDoc.type)}
                  className="text-xs text-slate-600 hover:text-slate-950 underline px-2 py-1 cursor-pointer font-medium"
                >
                  Sample
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer Navigation (Responsive Full-Width Stack on Mobile) */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Intent</span>
        </button>

        <button
          onClick={onNextStep}
          disabled={uploadedCount === 0}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all select-none w-full sm:w-auto ${
            uploadedCount > 0
              ? 'bg-[#0c2340] hover:bg-[#16375f] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          <span>Verify Extracted Attributes</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
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
