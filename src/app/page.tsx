'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<WorkflowId>('pan_aadhaar_link');
  const [documents, setDocuments] = useState<DocumentRecord[]>(
    ACCEPTANCE_SCENARIOS[1].documents // Default load AT-02
  );
  const [activeScenarioId, setActiveScenarioId] = useState<string>('AT-02');
  
  // Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [purgeToastVisible, setPurgeToastVisible] = useState(false);

  const currentWorkflow: WorkflowConfig =
    WORKFLOWS.find((w) => w.id === selectedWorkflowId) || WORKFLOWS[0];

  const analysis = calculateDocumentHarmony(documents, selectedWorkflowId);

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleNextStep = () => {
    const next = Math.min(5, currentStep + 1);
    setCurrentStep(next);
    setMaxStepReached((prev) => Math.max(prev, next));
  };

  const handlePrevStep = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
  };

  const handleSelectWorkflow = (id: WorkflowId) => {
    setSelectedWorkflowId(id);
  };

  const handleSelectScenario = (scenario: AcceptanceScenario) => {
    setSelectedWorkflowId(scenario.workflow);
    setDocuments(JSON.parse(JSON.stringify(scenario.documents)));
    setActiveScenarioId(scenario.id);
    
    if (scenario.id === 'AT-05') {
      setCurrentStep(3);
      setMaxStepReached(4);
    } else {
      setCurrentStep(4);
      setMaxStepReached(5);
    }
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
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] relative selection:bg-white selection:text-stone-950">
      
      {/* Ambient background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Ephemeral purge toast */}
      {purgeToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900/90 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-white/10 backdrop-blur-md animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Session memory cleared.</span>
        </div>
      )}

      {/* Floating Island Header */}
      <Header
        currentWorkflowId={selectedWorkflowId}
        onSelectWorkflow={handleSelectWorkflow}
        onSelectScenario={handleSelectScenario}
        onPurgeData={handlePurgeData}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenInfoModal={() => setPrivacyModalOpen(true)}
        activeScenarioId={activeScenarioId}
      />

      {/* Hardware Tab Stepper */}
      <WizardProgress
        currentStep={currentStep}
        onStepClick={handleStepClick}
        maxStepReached={maxStepReached}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pb-20 relative z-10">
        
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

      {/* Sleek Minimalist Footer */}
      <footer className="border-t border-white/8 bg-[#09090b]/80 backdrop-blur-md py-6 text-xs text-stone-400 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">Document Harmony</span>
            <span className="text-stone-600">•</span>
            <span>Indian Official Record Consistency Engine</span>
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            In-Memory Client Diagnostic • 0-Day Retention
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
