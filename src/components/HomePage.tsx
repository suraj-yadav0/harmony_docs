'use client';

import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { WorkflowId, AcceptanceScenario } from '@/types';
import { WORKFLOWS, ACCEPTANCE_SCENARIOS } from '@/data/scenarios';

interface HomePageProps {
  onStartAudit: (workflowId?: WorkflowId) => void;
  onSelectScenario: (scenario: AcceptanceScenario) => void;
  onOpenPrivacyModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartAudit,
  onSelectScenario,
  onOpenPrivacyModal,
}) => {
  return (
    <div className="space-y-28 sm:space-y-36 py-12 sm:py-20 animate-fade-in text-slate-900">
      
      {/* 1. HERO SECTION (Spacious, Clean, High Contrast) */}
      <section className="relative max-w-4xl mx-auto text-center space-y-8 pt-6 sm:pt-12 pb-4">
        
        {/* Sovereign GovTech Ribbon Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-700 text-xs font-semibold">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="text-[#0c2340] font-bold">DIGITAL INDIA</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">Citizen Identity Precedence & Verification Utility</span>
        </div>

        {/* Big Crisp Headline with Relaxed Leading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0c2340] leading-[1.18] max-w-3xl mx-auto">
          Verify identity consistency across Indian official documents.
        </h1>

        {/* Subtext with Comfortable Spacing */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal pt-1">
          Cross-verify names, dates of birth, and identity records across <strong className="text-slate-900 font-semibold">Aadhaar, PAN, Bank KYC, and Class 10th Marksheets</strong>. Prevent administrative rejections on Income Tax, Passport, and EPFO portals.
        </p>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartAudit('pan_aadhaar_link')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0c2340] hover:bg-[#16375f] text-white font-bold text-sm sm:text-base shadow-lg shadow-slate-900/10 transition-all select-none cursor-pointer active:scale-98"
          >
            <span>Launch Document Check</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>

          <button
            onClick={() => onSelectScenario(ACCEPTANCE_SCENARIOS[1])}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm sm:text-base font-bold transition-all shadow-xs cursor-pointer select-none"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Try Sample Case (AT-02)</span>
          </button>
        </div>

        {/* Sovereign Trust Badges with Generous Margins */}
        <div className="pt-8 sm:pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> 0-Day Data Retention (In-Memory)
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0c2340]" /> 100% Masked Identifiers
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" /> Statutory Precedence Engine
          </span>
        </div>
      </section>

      {/* 2. INTERACTIVE FORENSIC LIVE ENGINE SIMULATION */}
      <section className="max-w-4xl mx-auto rounded-3xl bg-white p-7 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Live Forensic Matching Engine
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#0c2340] mt-2">
              PAN ↔ Aadhaar Character Mismatch Diagnosis
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 w-max">
            Score: 85/100 • Review Required
          </span>
        </div>

        {/* Side by side comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
          {/* Aadhaar Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-slate-600 text-[11px]">
              <span className="font-bold text-slate-900 font-sans">Aadhaar (UIDAI Record)</span>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">[AUTHORITATIVE]</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Extracted Legal Name</span>
              <p className="text-slate-950 font-black text-sm tracking-wide">SURAJ KUMAR YADAV</p>
            </div>
          </div>

          {/* PAN Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-slate-600 text-[11px]">
              <span className="font-bold text-slate-900 font-sans">PAN Card (Income Tax Record)</span>
              <span className="text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded">[DISCREPANCY]</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Extracted Legal Name</span>
              <p className="text-slate-950 font-black text-sm tracking-wide">
                SURAJ <span className="text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded font-black">K</span> YADAV
              </p>
            </div>
          </div>
        </div>

        {/* Token Alignment Highlight */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Diagnosis: Single Middle-Initial Abbreviation Detected</span>
          </div>
          <p className="text-amber-900 leading-relaxed text-xs sm:text-sm pl-6">
            Income Tax Department e-Filing portal validates full string equality against UIDAI databases. The single initial <strong className="font-mono">K</strong> will trigger automated rejection code <strong className="font-mono">ERR_NAME_MISMATCH</strong>. Update PAN via NSDL Form 49A before submitting.
          </p>
        </div>

      </section>

      {/* 3. HOW IT WORKS (3 SOVEREIGN STEPS) */}
      <section className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0c2340] tracking-tight">
            How Document Harmony Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            A 3-step deterministic pipeline adhering to Supreme Court and UIDAI statutory precedence rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {/* Step 1 */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900">Select Purpose Intent</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Choose your target portal (e.g. PAN-Aadhaar linking, Passport reissue, or EPFO Joint Declaration).
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900">Ingest Document Proofs</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload PDF scans or photograph your physical cards. Evaluated strictly in-memory without persistent storage.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900">Follow Official Roadmap</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Review authoritative anchor precedence, character diffs, and the exact government correction sequence.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SUPPORTED WORKFLOWS DIRECTORY */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
              Supported Government Workflows
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a verification purpose to launch the guided diagnostic check.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {WORKFLOWS.map((wf) => (
            <button
              key={wf.id}
              onClick={() => onStartAudit(wf.id)}
              className="text-left p-6 sm:p-7 rounded-3xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-[#0c2340]/40 transition-all flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0c2340]">
                    {wf.title}
                  </h3>
                  {wf.badge && (
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      {wf.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {wf.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Required: {wf.requiredDocs.join(' • ').toUpperCase()}</span>
                <span className="text-[#0c2340] font-sans font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. PRD ACCEPTANCE TEST CASES */}
      <section className="max-w-4xl mx-auto rounded-3xl bg-white p-7 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0c2340] tracking-tight">
              Simulated Acceptance Scenarios (AT-01 to AT-06)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Test real administrative discrepancy patterns (spelling variants, date differences, initial abbreviations).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACCEPTANCE_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s)}
              className="text-left p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{s.title}</span>
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {s.expectedStatus}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Score: {s.expectedScore}/100</span>
                <span className="text-[#0c2340] font-sans font-bold group-hover:translate-x-0.5 transition-transform">
                  Test Case →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. PRIVACY SPECIFICATION BANNER */}
      <section className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#0c2340] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-8 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>0-Day Ephemeral Data Retention Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            All document evaluation and string alignment algorithms execute exclusively inside client-side RAM. No unmasked Aadhaar numbers or files are stored in remote cloud databases.
          </p>
        </div>

        <button
          onClick={onOpenPrivacyModal}
          className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0c2340] text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          View Privacy Architecture
        </button>
      </section>

    </div>
  );
};
