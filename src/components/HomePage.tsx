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
    <div className="space-y-24 py-6 sm:py-12 animate-fade-in text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative max-w-4xl mx-auto text-center space-y-6 pt-6 sm:pt-10">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-stone-300 text-xs font-mono backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GovTech India • Client-Side Identity Consistency Engine</span>
        </div>

        {/* Big Crisp Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Detect identity discrepancies before government portals reject you.
        </h1>

        {/* Concise Subtext */}
        <p className="text-base sm:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Cross-verify names, dates of birth, and parent details across <strong className="text-stone-200 font-medium">Aadhaar, PAN, Bank Passbooks, and 10th Marksheets</strong>. Get character-level diffs and an official fix sequence.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onStartAudit('pan_aadhaar_link')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-bold text-sm shadow-xl transition-all select-none cursor-pointer active:scale-95"
          >
            <span>Start Free Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectScenario(ACCEPTANCE_SCENARIOS[1])}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-stone-200 border border-white/10 text-sm font-semibold transition-all cursor-pointer select-none"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Try Demo (AT-02 Initial Discrepancy)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> 0-Day Storage (In-Memory Only)
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> 100% Masked Identifiers
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Client Processing
          </span>
        </div>
      </section>

      {/* 2. INTERACTIVE LIVE PRODUCT DEMO PREVIEW */}
      <section className="max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-white/15 to-white/5 border border-white/10 shadow-2xl">
        <div className="rounded-[calc(1.5rem-2px)] bg-[#0d0d10] p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/8 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Live Forensic Engine Simulation
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                PAN ↔ Aadhaar Character Mismatch Detection
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 w-max">
              Score: 85/100 • Action Needed
            </span>
          </div>

          {/* Side by side cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Aadhaar Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-[11px]">
                <span className="font-bold text-white">Aadhaar (UIDAI)</span>
                <span className="text-emerald-400 font-bold">[AUTHORITATIVE]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/6 space-y-1">
                <span className="text-[10px] text-stone-500 block uppercase">Extracted Name</span>
                <p className="text-white font-bold text-sm tracking-wide">SURAJ KUMAR YADAV</p>
              </div>
            </div>

            {/* PAN Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-2">
              <div className="flex items-center justify-between text-stone-400 text-[11px]">
                <span className="font-bold text-white">PAN Card (ITD)</span>
                <span className="text-amber-400 font-bold">[DISCREPANCY]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/6 space-y-1">
                <span className="text-[10px] text-stone-500 block uppercase">Extracted Name</span>
                <p className="text-white font-bold text-sm tracking-wide">
                  SURAJ <span className="text-amber-300 bg-amber-500/20 px-1 rounded">K</span> YADAV
                </p>
              </div>
            </div>
          </div>

          {/* Token Alignment Highlight */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-sans font-semibold text-white">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Mismatch Diagnosis: Single Middle-Initial Abbreviation</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px] font-sans">
              Income Tax Department e-Filing portal validates full string equality. The single initial <code>K</code> will trigger automated linking rejection code <code>ERR_NAME_MISMATCH</code>. Update PAN via NSDL Form 49A before submitting.
            </p>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Document Harmony Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            A 3-step deterministic pipeline designed specifically for Indian administrative portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/8 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm text-white">Select Application Intent</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Choose your target portal (e.g. PAN-Aadhaar linking, Passport reissue, or Bank KYC).
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/8 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm text-white">Attach Identity Proofs</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Upload PDF scans or photograph your physical cards. Evaluated strictly in-memory.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/8 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm text-white">Get Official Fix Sequence</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Review authoritative anchor precedence, character diffs, and exact correction roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SUPPORTED WORKFLOWS SELECTION */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-baseline justify-between border-b border-white/8 pb-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Supported Verification Workflows
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Select a verification purpose to launch the guided checker.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WORKFLOWS.map((wf) => (
            <button
              key={wf.id}
              onClick={() => onStartAudit(wf.id)}
              className="text-left p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-white group-hover:text-stone-100">
                    {wf.title}
                  </h3>
                  {wf.badge && (
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300 border border-white/10">
                      {wf.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {wf.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-stone-500">
                <span>Required: {wf.requiredDocs.join(' • ').toUpperCase()}</span>
                <span className="text-white font-sans font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Launch <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. PRD TEST SUITE SCENARIOS */}
      <section className="max-w-4xl mx-auto rounded-3xl p-1 bg-white/[0.04] border border-white/8 space-y-3">
        <div className="rounded-[calc(1.5rem-2px)] bg-[#0f0f13] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/8 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Simulated Acceptance Scenarios (AT-01 to AT-06)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Explore real edge cases (typos, date differences, initial abbreviations).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ACCEPTANCE_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectScenario(s)}
                className="text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/6 hover:border-white/12 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-white">{s.title}</span>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-stone-300">
                      {s.expectedStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2">
                    {s.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/6 flex items-center justify-between text-[10px] font-mono text-stone-500">
                  <span>Score: {s.expectedScore}/100</span>
                  <span className="text-white font-sans font-semibold group-hover:translate-x-0.5 transition-transform">
                    Run →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRIVACY & SECURITY BANNER */}
      <section className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 to-[#101014] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>0-Day Ephemeral Data Guarantee</span>
          </div>
          <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
            All document processing, text parsing, and character diff calculations execute purely within client-side memory. No unmasked Aadhaar numbers or scans are ever saved.
          </p>
        </div>

        <button
          onClick={onOpenPrivacyModal}
          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer shrink-0"
        >
          View Privacy Architecture
        </button>
      </section>

    </div>
  );
};
