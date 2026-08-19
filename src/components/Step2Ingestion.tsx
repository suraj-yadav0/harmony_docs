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
              Click any document card below to attach scans or verify details in real-time.
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

      {/* Interactive Document Physical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {documents.map((doc) => renderDocCard(doc))}
      </div>

      {/* Selected Document Action Bar */}
      {currentSelectedDoc && (
        <div className="rounded-2xl p-1 bg-white/[0.04] border border-white/10">
          <div className="rounded-xl bg-[#121216] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-stone-400 tracking-wider">
                Active Selection:
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {DOC_METADATA[currentSelectedDoc.type]?.label || currentSelectedDoc.title}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                {currentSelectedDoc.isUploaded
                  ? `File attached: ${currentSelectedDoc.fileName} (${currentSelectedDoc.fileSize})`
                  : 'No file currently attached for this proof.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentSelectedDoc.isUploaded ? (
                <button
                  onClick={() => handleRemoveDoc(currentSelectedDoc.type)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Proof</span>
                </button>
              ) : (
                <>
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-stone-950 hover:bg-stone-200 cursor-pointer transition-colors shadow-sm">
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-stone-400" />
                    <span>Scan with Camera</span>
                  </button>

                  <button
                    onClick={() => handleLoadSampleForDoc(currentSelectedDoc.type)}
                    className="text-xs text-stone-400 hover:text-white underline px-1 cursor-pointer"
                  >
                    Sample
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
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
