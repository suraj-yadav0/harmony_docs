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
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 select-none cursor-pointer border ${
        isActive
          ? 'ring-2 ring-emerald-400 border-emerald-400/80 shadow-[0_0_30px_rgba(52,211,153,0.2)]'
          : 'border-white/10 hover:border-white/20 bg-gradient-to-b from-stone-900 to-[#121216]'
      }`}
    >
      {/* Top Tricolor Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="p-4 sm:p-5 text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[10px] font-black text-red-400">
              आ
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-stone-300 font-sans">
                भारत सरकार / Government of India
              </p>
              <p className="text-[9px] font-mono text-stone-400">
                Unique Identification Authority of India (UIDAI)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isUploaded ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-stone-500 bg-white/5 px-2 py-0.5 rounded-full">
                EMPTY
              </span>
            )}
          </div>
        </div>

        {/* Body with Photo Box and Details */}
        <div className="flex gap-4 items-center">
          {/* Photo Placeholder */}
          <div className="w-16 h-20 rounded-lg bg-stone-800 border border-white/15 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-stone-700 mt-2" />
            <div className="w-12 h-10 rounded-t-full bg-stone-700 mt-1" />
            <div className="absolute bottom-0 inset-x-0 bg-stone-900/90 text-[8px] font-mono text-stone-400 text-center py-0.5">
              PHOTO
            </div>
          </div>

          {/* Extracted Details */}
          <div className="flex-1 min-w-0 space-y-1.5 font-sans">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400">Name / नाम</span>
              <p className="font-bold text-xs sm:text-sm text-white font-mono tracking-wide truncate">
                {name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400">DOB / जन्म तिथि</span>
                <p className="font-mono text-xs font-semibold text-stone-200">{dob}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400">Gender / लिंग</span>
                <p className="font-mono text-xs font-semibold text-stone-200">{gender}</p>
              </div>
            </div>
          </div>

          {/* Secure QR Glyph */}
          <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-stone-800 border border-white/10 p-1 shrink-0 text-stone-400">
            <QrCode className="w-10 h-10 text-stone-300" />
            <span className="text-[7px] font-mono mt-0.5">SECURE QR</span>
          </div>
        </div>

        {/* Footer 12-Digit Masked ID */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="text-center w-full">
            <span className="font-mono font-bold text-sm sm:text-base tracking-[0.25em] text-emerald-400">
              {aadhaarNo}
            </span>
            <p className="text-[9px] font-sans text-stone-400 mt-0.5">
              मेरा <strong className="text-stone-300">आधार</strong>, मेरी पहचान (Proof of Identity)
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
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 select-none cursor-pointer border ${
        isActive
          ? 'ring-2 ring-blue-400 border-blue-400/80 shadow-[0_0_30px_rgba(96,165,250,0.2)]'
          : 'border-white/10 hover:border-white/20 bg-gradient-to-b from-[#0c1424] to-[#090e1a]'
      }`}
    >
      {/* Top Navy Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-400 to-sky-500" />

      <div className="p-4 sm:p-5 text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[10px] font-black text-blue-300">
              IT
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-blue-200 font-sans">
                आयकर विभाग / INCOME TAX DEPARTMENT
              </p>
              <p className="text-[9px] font-mono text-blue-400/80">
                GOVT. OF INDIA / भारत सरकार
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isUploaded ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-400/30">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-stone-500 bg-white/5 px-2 py-0.5 rounded-full">
                EMPTY
              </span>
            )}
          </div>
        </div>

        {/* Body with Photo, Details, and Hologram Strip */}
        <div className="flex gap-4 items-center">
          {/* Photo Placeholder */}
          <div className="w-16 h-20 rounded-lg bg-slate-900 border border-blue-500/30 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-slate-700 mt-2" />
            <div className="w-12 h-10 rounded-t-full bg-slate-700 mt-1" />
            <div className="absolute bottom-0 inset-x-0 bg-blue-950 text-[8px] font-mono text-blue-300 text-center py-0.5">
              PHOTO
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1 font-sans">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-blue-300/70">Name / नाम</span>
              <p className="font-bold text-xs sm:text-sm text-white font-mono tracking-wide truncate">
                {name}
              </p>
            </div>

            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-blue-300/70">Father&apos;s Name / पिता का नाम</span>
              <p className="font-mono text-xs text-stone-300 truncate">{fatherName}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-blue-300/70">DOB</span>
                <p className="font-mono text-xs font-semibold text-stone-200">{dob}</p>
              </div>
            </div>
          </div>

          {/* Hologram / Signature Simulator */}
          <div className="hidden sm:flex flex-col items-center justify-center w-14 h-16 rounded-lg bg-gradient-to-tr from-amber-500/20 via-sky-400/20 to-purple-500/20 border border-white/20 p-1 shrink-0 text-stone-300 text-center">
            <Shield className="w-5 h-5 text-amber-300 mb-1" />
            <span className="text-[7px] font-mono uppercase tracking-tight text-stone-300">HOLOGRAM</span>
          </div>
        </div>

        {/* Footer 10-Digit PAN */}
        <div className="pt-2 border-t border-blue-500/20 flex items-center justify-between">
          <div className="text-center w-full">
            <span className="font-mono font-black text-sm sm:text-base tracking-[0.25em] text-blue-300">
              {panNo}
            </span>
            <p className="text-[9px] font-sans text-blue-400/80 mt-0.5">
              Permanent Account Number Card
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
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 select-none cursor-pointer border ${
        isActive
          ? 'ring-2 ring-purple-400 border-purple-400/80 shadow-[0_0_30px_rgba(192,132,252,0.2)]'
          : 'border-white/10 hover:border-white/20 bg-gradient-to-b from-[#170e24] to-[#100a1a]'
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500" />

      <div className="p-4 sm:p-5 text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-[10px] font-black text-purple-300">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-purple-200 font-sans">
                CENTRAL BOARD OF SECONDARY EDUCATION
              </p>
              <p className="text-[9px] font-mono text-purple-400/80">
                CLASS X SECONDARY SCHOOL EXAMINATION CERTIFICATE
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-400/30">
            LEGAL ANCHOR (P0)
          </span>
        </div>

        {/* Details Table */}
        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-purple-300/70">Candidate Name</span>
            <p className="font-bold text-white font-mono truncate">{name}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-purple-300/70">Roll / Cert No.</span>
            <p className="font-mono text-purple-200 font-semibold">{certNo}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-purple-300/70">Father&apos;s Name</span>
            <p className="font-mono text-stone-300 truncate">{fatherName}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-purple-300/70">Date of Birth (DOB)</span>
            <p className="font-mono font-bold text-emerald-400">{dob}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span>Supreme Court Precedence: Primary Anchor for DOB</span>
          {isUploaded && <span className="text-purple-300 font-bold">VERIFIED</span>}
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
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 select-none cursor-pointer border ${
        isActive
          ? 'ring-2 ring-teal-400 border-teal-400/80 shadow-[0_0_30px_rgba(45,212,191,0.2)]'
          : 'border-white/10 hover:border-white/20 bg-gradient-to-b from-[#0c1c1a] to-[#091413]'
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500" />

      <div className="p-4 sm:p-5 text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-[10px] font-black text-teal-300">
              <Building className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-teal-200 font-sans">
                {bankName}
              </p>
              <p className="text-[9px] font-mono text-teal-400/80">
                SAVINGS BANK ACCOUNT PASSBOOK / STATEMENT
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-400/30">
            RBI KYC SPEC
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-teal-300/70">Account Holder Name</span>
            <p className="font-bold text-white font-mono truncate">{name}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-teal-300/70">Account Number (Masked)</span>
            <p className="font-mono text-teal-200 font-semibold">{accountNo}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span>IFSC: SBIN0001234 • Core Banking Verified</span>
          {isUploaded && <span className="text-teal-300 font-bold">ATTACHED</span>}
        </div>
      </div>
    </div>
  );
};
