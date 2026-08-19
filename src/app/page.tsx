'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { WizardProgress } from '@/components/WizardProgress';
import { Step1Workflow } from '@/components/Step1Workflow';
import { Step2Ingestion } from '@/components/Step2Ingestion';
import { Step3OCRVerification } from '@/components/Step3OCRVerification';
import { Step4HarmonyReport } from '@/components/Step4HarmonyReport';
import { Step5Remediation } from '@/components/Step5Remediation';
import { ExportReportModal } from '@/components/ExportReportModal';
import { PrivacyModal } from '@/components/PrivacyModal';
import {
  ACCEPTANCE_SCENARIOS,
  INITIAL_EMPTY_DOCUMENTS,
  WORKFLOWS,
} from '@/data/scenarios';
import {
  AcceptanceScenario,
  DocumentRecord,
  WorkflowConfig,
  WorkflowId,
} from '@/types';
import { calculateDocumentHarmony } from '@/utils/matchingEngine';
import { Check } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'wizard'>('home');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<WorkflowId>('pan_aadhaar_link');
  const [documents, setDocuments] = useState<DocumentRecord[]>(
    ACCEPTANCE_SCENARIOS[1].documents // Load AT-02 by default
  );
  const [activeScenarioId, setActiveScenarioId] = useState<string>('AT-02');
  
  // Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [purgeToastVisible, setPurgeToastVisible] = useState(false);

  const currentWorkflow: WorkflowConfig =
    WORKFLOWS.find((w) => w.id === selectedWorkflowId) || WORKFLOWS[0];

  const analysis = calculateDocumentHarmony(documents, selectedWorkflowId);

  const handleStartAudit = (workflowId?: WorkflowId) => {
    if (workflowId) setSelectedWorkflowId(workflowId);
    setCurrentStep(1);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleNextStep = () => {
    const next = Math.min(5, currentStep + 1);
    setCurrentStep(next);
    setMaxStepReached((prev) => Math.max(prev, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWorkflow = (id: WorkflowId) => {
    setSelectedWorkflowId(id);
  };

  const handleSelectScenario = (scenario: AcceptanceScenario) => {
    setSelectedWorkflowId(scenario.workflow);
    setDocuments(JSON.parse(JSON.stringify(scenario.documents)));
    setActiveScenarioId(scenario.id);
    setCurrentView('wizard');
    
    if (scenario.id === 'AT-05') {
      setCurrentStep(3);
      setMaxStepReached(4);
    } else {
      setCurrentStep(4);
      setMaxStepReached(5);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePurgeData = () => {
    setDocuments(INITIAL_EMPTY_DOCUMENTS);
    setActiveScenarioId('');
    setCurrentStep(1);
    setMaxStepReached(1);
    setPurgeToastVisible(true);
    setTimeout(() => setPurgeToastVisible(false), 3000);
  };

  const handleSimulateResolvedCorrection = () => {
    const canonicalName =
      analysis.fieldResults.find((f) => f.fieldName === 'name')?.canonicalValue ||
      'Suraj Kumar Yadav';
    const canonicalDob =
      analysis.fieldResults.find((f) => f.fieldName === 'dob')?.canonicalValue || '15/08/2001';

    const correctedDocs = documents.map((d) => {
      if (!d.isUploaded) return d;
      return {
        ...d,
        fields: {
          ...d.fields,
          name: d.fields.name
            ? { ...d.fields.name, value: canonicalName, userEdited: true, isUserVerified: true }
            : undefined,
          dob: d.fields.dob
            ? { ...d.fields.dob, value: canonicalDob, userEdited: true, isUserVerified: true }
            : undefined,
        },
      };
    });

    setDocuments(correctedDocs);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 relative selection:bg-[#0c2340] selection:text-white">
      
      {/* Subtle GovTech Pattern Background */}
      <div className="fixed inset-0 bg-gov-pattern opacity-60 pointer-events-none" />

      {/* Ephemeral Toast Alert */}
      {purgeToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c2340] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-slate-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Session memory cleared. Client storage purged.</span>
        </div>
      )}

      {/* Sovereign Header */}
      <Header
        currentWorkflowId={selectedWorkflowId}
        onSelectWorkflow={handleSelectWorkflow}
        onSelectScenario={handleSelectScenario}
        onPurgeData={handlePurgeData}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenInfoModal={() => setPrivacyModalOpen(true)}
        activeScenarioId={activeScenarioId}
        isWizardView={currentView === 'wizard'}
        onNavigateHome={() => setCurrentView('home')}
        onStartAudit={() => handleStartAudit()}
      />

      {/* Main Viewport */}
      {currentView === 'home' ? (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 relative z-10">
          <HomePage
            onStartAudit={handleStartAudit}
            onSelectScenario={handleSelectScenario}
            onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pb-20 relative z-10">
          {/* Progress Tab Stepper (Only in Wizard) */}
          <WizardProgress
            currentStep={currentStep}
            onStepClick={handleStepClick}
            maxStepReached={maxStepReached}
          />

          {currentStep === 1 && (
            <Step1Workflow
              selectedWorkflowId={selectedWorkflowId}
              onSelectWorkflow={handleSelectWorkflow}
              onSelectScenario={handleSelectScenario}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2Ingestion
              documents={documents}
              workflow={currentWorkflow}
              onUpdateDocuments={setDocuments}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 3 && (
            <Step3OCRVerification
              documents={documents}
              onUpdateDocuments={setDocuments}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 4 && (
            <Step4HarmonyReport
              analysis={analysis}
              documents={documents}
              workflow={currentWorkflow}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
            />
          )}

          {currentStep === 5 && (
            <Step5Remediation
              analysis={analysis}
              documents={documents}
              workflow={currentWorkflow}
              onPrevStep={handlePrevStep}
              onExportReport={() => setExportModalOpen(true)}
              onSimulateResolvedCorrection={handleSimulateResolvedCorrection}
            />
          )}
        </main>
      )}

      {/* Sovereign GovTech Footer */}
      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-md py-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0c2340] tracking-tight">Document Harmony</span>
            <span className="text-slate-300">•</span>
            <span>Indian Official Record Consistency & Precedence Engine</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Digital Public Infrastructure Spec • 0-Day Client RAM Retention
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        analysis={analysis}
        documents={documents}
        workflow={currentWorkflow}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        onPurgeData={handlePurgeData}
      />

    </div>
  );
}
