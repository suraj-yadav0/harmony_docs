export type DocumentType = 'aadhaar' | 'pan' | 'bank_passbook' | 'marksheet' | 'bank_statement' | 'voter_id' | 'passport' | 'driving_licence';

export type TrafficLightStatus = 'GREEN' | 'AMBER' | 'RED' | 'UNAVAILABLE';

export type WorkflowId = 
  | 'pan_aadhaar_link'
  | 'bank_kyc'
  | 'scholarship_dbt'
  | 'epfo_claim'
  | 'employment_verification'
  | 'general_check';

export interface WorkflowConfig {
  id: WorkflowId;
  title: string;
  shortDescription: string;
  requiredDocs: DocumentType[];
  criticalFields: ('name' | 'dob' | 'father_name' | 'gender')[];
  icon: string;
  badge?: string;
}

export interface ExtractedField<T = string> {
  value: T;
  rawConfidence: number; // 0 to 1
  isUserVerified: boolean;
  userEdited?: boolean;
  originalOcrValue?: string;
  boundingRegion?: { x: number; y: number; width: number; height: number };
}

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  title: string;
  fileName?: string;
  fileSize?: string;
  filePreviewUrl?: string;
  isUploaded: boolean;
  isProcessing?: boolean;
  fields: {
    name?: ExtractedField<string>;
    dob?: ExtractedField<string>;
    fatherName?: ExtractedField<string>;
    gender?: ExtractedField<'Male' | 'Female' | 'Other'>;
    docNumberMasked?: ExtractedField<string>;
    bankName?: ExtractedField<string>;
    issueDate?: ExtractedField<string>;
  };
}

export interface DifferenceToken {
  text: string;
  type: 'match' | 'inserted' | 'deleted' | 'abbreviated' | 'transliterated' | 'changed';
}

export interface FieldComparisonResult {
  fieldName: 'name' | 'dob' | 'fatherName' | 'gender';
  fieldLabel: string;
  status: TrafficLightStatus;
  canonicalValue?: string;
  anchorDocType?: DocumentType;
  summary: string;
  technicalDetails: {
    exactMatch: boolean;
    normalizedMatch: boolean;
    differenceType: 
      | 'exact_match' 
      | 'formatting_difference' 
      | 'abbreviation' 
      | 'token_omission' 
      | 'token_reordering' 
      | 'spelling_variation' 
      | 'major_mismatch' 
      | 'competing_clusters'
      | 'missing_field'
      | 'uncertain';
    similarityScore: number;
    editDistance?: number;
    tokenDiffs?: {
      docType: DocumentType;
      docTitle: string;
      raw: string;
      tokens: DifferenceToken[];
    }[];
  };
  docValues: Record<DocumentType, string | undefined>;
}

export interface AnchorAnalysis {
  isDetermined: boolean;
  anchorDocType?: DocumentType;
  anchorDocTitle?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
  hasCompetingClusters: boolean;
  clusters?: {
    value: string;
    corroboratingDocs: DocumentType[];
  }[];
}

export interface RemediationStep {
  stepNumber: number;
  docType: DocumentType;
  docTitle: string;
  fieldToFix: string;
  currentValue: string;
  suggestedCanonicalValue: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionTitle: string;
  reason: string;
  prerequisiteStep?: number;
  authority: string;
  officialUrl: string;
  verifiedFee: string;
  verifiedTimeline: string;
  lastVerifiedDate: string;
  stepsSummary: string[];
}

export interface HarmonyAnalysisResult {
  overallStatus: TrafficLightStatus;
  harmonyScore: number; // 0 - 100
  statusSummary: string;
  fieldResults: FieldComparisonResult[];
  anchorAnalysis: AnchorAnalysis;
  remediationPlan: RemediationStep[];
  workflowSpecificNotes: string[];
  isOcrCorrectionPending: boolean;
}

export interface AcceptanceScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  workflow: WorkflowId;
  documents: DocumentRecord[];
  expectedScore: number;
  expectedStatus: TrafficLightStatus;
  highlights: string[];
}
