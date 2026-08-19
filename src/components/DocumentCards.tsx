'use client';

import React from 'react';
import { DocumentRecord } from '@/types';
import { CheckCircle2, Shield, QrCode, Building, Award } from 'lucide-react';

interface DocumentPreviewProps {
  document: DocumentRecord;
  isActive?: boolean;
  onSelect?: () => void;
  onUploadClick?: () => void;
}

export const AadhaarCardPreview: React.FC<DocumentPreviewProps> = ({ document, isActive, onSelect }) => {
  const isUploaded = document.isUploaded;
  const name = document.fields.name?.value || 'SURAJ KUMAR YADAV';
  const dob = document.fields.dob?.value || '15/08/2001';
  const gender = document.fields.gender?.value || 'MALE / पुरुष';
  const aadhaarNo = document.fields.docNumberMasked?.value || 'XXXX XXXX 8921';

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 select-none cursor-pointer bg-white shadow-xs border ${
        isActive
          ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-md scale-[1.005]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top Tricolor Ribbon */}
      <div className="h-1.5 w-full tricolor-ribbon" />

      <div className="p-5 sm:p-6 text-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-xs font-black text-red-600 shrink-0">
              आ
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-slate-900 font-sans truncate">
                भारत सरकार / Govt. of India
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 font-medium truncate">
                UIDAI • Unique Identification Authority
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isUploaded ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ATTACHED
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                PENDING
              </span>
            )}
          </div>
        </div>

        {/* Body with Photo Box and Details */}
        <div className="flex gap-4 sm:gap-5 items-center">
          {/* Photo Placeholder */}
          <div className="w-16 h-20 sm:w-18 sm:h-22 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 relative overflow-hidden shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-300 mt-1.5" />
            <div className="w-12 h-10 sm:w-14 sm:h-12 rounded-t-full bg-slate-300 mt-1" />
            <div className="absolute bottom-0 inset-x-0 bg-slate-900 text-[8px] font-mono text-white text-center py-0.5 font-bold">
              PHOTO
            </div>
          </div>

          {/* Extracted Details */}
          <div className="flex-1 min-w-0 space-y-2 font-sans">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Name / नाम</span>
              <p className="font-extrabold text-sm sm:text-base text-slate-950 font-mono tracking-wide truncate">
                {name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">DOB / जन्म तिथि</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-slate-800">{dob}</p>
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Gender / लिंग</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-slate-800">{gender}</p>
              </div>
            </div>
          </div>

          {/* Secure QR Glyph */}
          <div className="hidden xs:flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 text-slate-700 shadow-2xs">
            <QrCode className="w-10 h-10 sm:w-11 sm:h-11 text-slate-800" />
            <span className="text-[7px] font-mono font-bold mt-0.5 text-slate-500">QR</span>
          </div>
        </div>

        {/* Footer 12-Digit Masked ID */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          <div className="text-center w-full">
            <span className="font-mono font-black text-sm sm:text-base tracking-[0.25em] text-[#0c2340]">
              {aadhaarNo}
            </span>
            <p className="text-[9px] sm:text-[10px] font-sans font-medium text-slate-500 mt-0.5">
              मेरा <strong className="text-slate-800">आधार</strong>, मेरी पहचान (Biometric Proof)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PanCardPreview: React.FC<DocumentPreviewProps> = ({ document, isActive, onSelect }) => {
  const isUploaded = document.isUploaded;
  const name = document.fields.name?.value || 'SURAJ K YADAV';
  const fatherName = document.fields.fatherName?.value || 'SURESH KUMAR YADAV';
  const dob = document.fields.dob?.value || '15/08/2001';
  const panNo = document.fields.docNumberMasked?.value || 'ABCDE****F';

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 select-none cursor-pointer bg-white shadow-xs border ${
        isActive
          ? 'ring-2 ring-blue-600 border-blue-600 shadow-md scale-[1.005]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top Navy Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600" />

      <div className="p-5 sm:p-6 text-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-black text-blue-700 shrink-0">
              IT
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-blue-950 font-sans truncate">
                आयकर विभाग / Income Tax Dept.
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono text-blue-700/80 font-medium truncate">
                Govt. of India / भारत सरकार
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isUploaded ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ATTACHED
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                PENDING
              </span>
            )}
          </div>
        </div>

        {/* Body with Photo, Details, and Hologram Strip */}
        <div className="flex gap-4 sm:gap-5 items-center">
          {/* Photo Placeholder */}
          <div className="w-16 h-20 sm:w-18 sm:h-22 rounded-2xl bg-blue-50/50 border border-blue-200 flex flex-col items-center justify-center shrink-0 relative overflow-hidden shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-200 mt-1.5" />
            <div className="w-12 h-10 sm:w-14 sm:h-12 rounded-t-full bg-blue-200 mt-1" />
            <div className="absolute bottom-0 inset-x-0 bg-blue-900 text-[8px] font-mono text-white text-center py-0.5 font-bold">
              PHOTO
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1.5 font-sans">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Name / नाम</span>
              <p className="font-extrabold text-sm sm:text-base text-slate-950 font-mono tracking-wide truncate">
                {name}
              </p>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Father&apos;s Name</span>
              <p className="font-mono text-xs sm:text-sm text-slate-700 font-semibold truncate">{fatherName}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">DOB</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-slate-900">{dob}</p>
              </div>
            </div>
          </div>

          {/* Hologram Simulator */}
          <div className="hidden xs:flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-100 via-sky-100 to-indigo-100 border border-amber-200/80 p-1.5 shrink-0 text-slate-700 text-center shadow-2xs">
            <Shield className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-[7px] font-mono font-bold uppercase tracking-tight text-slate-700">HOLOGRAM</span>
          </div>
        </div>

        {/* Footer 10-Digit PAN */}
        <div className="pt-3 border-t border-blue-100 flex items-center justify-between bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
          <div className="text-center w-full">
            <span className="font-mono font-black text-sm sm:text-base tracking-[0.25em] text-blue-950">
              {panNo}
            </span>
            <p className="text-[9px] sm:text-[10px] font-sans font-medium text-blue-700/90 mt-0.5">
              Permanent Account Number Card (Income Tax Act)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarksheetPreview: React.FC<DocumentPreviewProps> = ({ document, isActive, onSelect }) => {
  const isUploaded = document.isUploaded;
  const name = document.fields.name?.value || 'SURAJ KUMAR YADAV';
  const fatherName = document.fields.fatherName?.value || 'SURESH KUMAR YADAV';
  const dob = document.fields.dob?.value || '15/08/2001';
  const certNo = document.fields.docNumberMasked?.value || 'CBSE/2017/89124';

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 select-none cursor-pointer bg-white shadow-xs border ${
        isActive
          ? 'ring-2 ring-purple-600 border-purple-600 shadow-md scale-[1.005]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600" />

      <div className="p-5 sm:p-6 text-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-xs font-black text-purple-700 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-purple-950 font-sans truncate">
                CBSE • Education Board
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono text-purple-700/80 font-medium truncate">
                CLASS X SECONDARY EXAMINATION
              </p>
            </div>
          </div>

          <span className="text-[10px] sm:text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shrink-0">
            LEGAL ANCHOR (P0)
          </span>
        </div>

        {/* Details Table */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs font-sans">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Candidate Name</span>
            <p className="font-extrabold text-slate-950 font-mono text-xs sm:text-sm truncate">{name}</p>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Roll / Cert No.</span>
            <p className="font-mono text-purple-950 font-bold text-xs sm:text-sm truncate">{certNo}</p>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Father&apos;s Name</span>
            <p className="font-mono text-slate-700 font-semibold text-xs sm:text-sm truncate">{fatherName}</p>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Date of Birth (DOB)</span>
            <p className="font-mono font-black text-emerald-700 text-xs sm:text-sm">{dob}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-[10px] font-mono text-slate-500 bg-purple-50/40 p-2.5 rounded-2xl">
          <span className="truncate">Supreme Court Precedence: Conclusive DOB Proof</span>
          {isUploaded && <span className="text-purple-800 font-bold shrink-0 ml-1">VERIFIED</span>}
        </div>
      </div>
    </div>
  );
};

export const BankPassbookPreview: React.FC<DocumentPreviewProps> = ({ document, isActive, onSelect }) => {
  const isUploaded = document.isUploaded;
  const name = document.fields.name?.value || 'SURAJ KUMAR YADAV';
  const bankName = document.fields.bankName?.value || 'STATE BANK OF INDIA';
  const accountNo = document.fields.docNumberMasked?.value || 'XXXXXXXX4512';

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 select-none cursor-pointer bg-white shadow-xs border ${
        isActive
          ? 'ring-2 ring-teal-600 border-teal-600 shadow-md scale-[1.005]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600" />

      <div className="p-5 sm:p-6 text-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-teal-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xs font-black text-teal-700 shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-teal-950 font-sans truncate">
                {bankName}
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono text-teal-700/80 font-medium truncate">
                SAVINGS BANK PASSBOOK
              </p>
            </div>
          </div>

          <span className="text-[10px] sm:text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 shrink-0">
            RBI KYC SPEC
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs font-sans">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Account Holder</span>
            <p className="font-extrabold text-slate-950 font-mono text-xs sm:text-sm truncate">{name}</p>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Account Number</span>
            <p className="font-mono text-teal-950 font-bold text-xs sm:text-sm truncate">{accountNo}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-teal-100 flex items-center justify-between text-[10px] font-mono text-slate-500 bg-teal-50/40 p-2.5 rounded-2xl">
          <span className="truncate">IFSC: SBIN0001234 • Core Banking Verified</span>
          {isUploaded && <span className="text-teal-800 font-bold shrink-0 ml-1">ATTACHED</span>}
        </div>
      </div>
    </div>
  );
};
