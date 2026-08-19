import {
  AnchorAnalysis,
  DifferenceToken,
  DocumentRecord,
  DocumentType,
  FieldComparisonResult,
  HarmonyAnalysisResult,
  RemediationStep,
  TrafficLightStatus,
  WorkflowId,
} from '@/types';
import { OFFICIAL_AUTHORITIES } from '@/data/scenarios';

// Normalizes strings for robust comparison
export function normalizeString(str?: string): string {
  if (!str) return '';
  return str
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalizes various Indian date formats to YYYY-MM-DD
export function normalizeDate(dateStr?: string): { canonical?: string; isParsed: boolean } {
  if (!dateStr) return { isParsed: false };
  const clean = dateStr.trim().replace(/[.\-\/]/g, '/');
  
  // DD/MM/YYYY or D/M/YYYY
  const dmyMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return { canonical: `${year}-${month}-${day}`, isParsed: true };
  }

  // YYYY/MM/DD
  const ymdMatch = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return { canonical: `${year}-${month}-${day}`, isParsed: true };
  }

  return { canonical: clean, isParsed: false };
}

// Levenshtein distance calculation
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b[j - 1] === a[i - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Generates token diffs between values for UI highlighting
export function generateTokenDiffs(
  docValues: { docType: DocumentType; docTitle: string; raw: string }[],
  canonicalValue: string
): { docType: DocumentType; docTitle: string; raw: string; tokens: DifferenceToken[] }[] {
  const normCanonicalTokens = normalizeString(canonicalValue).split(' ').filter(Boolean);

  return docValues.map(item => {
    const rawTokens = item.raw.split(/\s+/).filter(Boolean);
    const normTokens = normalizeString(item.raw).split(' ').filter(Boolean);

    const tokens: DifferenceToken[] = rawTokens.map((rawToken, idx) => {
      const normToken = normTokens[idx] || normalizeString(rawToken);

      // Exact match in canonical
      if (normCanonicalTokens.includes(normToken)) {
        return { text: rawToken, type: 'match' };
      }

      // Check if it's an initial of a canonical token (e.g., "K" for "Kumar")
      const isInitial = normCanonicalTokens.some(ct => ct.length > 1 && normToken.length === 1 && ct.startsWith(normToken));
      if (isInitial) {
        return { text: rawToken, type: 'abbreviated' };
      }

      // Check if canonical has an initial for this full token
      const isExpansion = normCanonicalTokens.some(ct => ct.length === 1 && normToken.length > 1 && normToken.startsWith(ct));
      if (isExpansion) {
        return { text: rawToken, type: 'abbreviated' };
      }

      // Check single character difference (e.g., "Yadava" vs "Yadav")
      const closeMatch = normCanonicalTokens.some(ct => levenshteinDistance(ct, normToken) === 1);
      if (closeMatch) {
        return { text: rawToken, type: 'changed' };
      }

      return { text: rawToken, type: 'inserted' };
    });

    return {
      docType: item.docType,
      docTitle: item.docTitle,
      raw: item.raw,
      tokens,
    };
  });
}

// Compare names across documents
export function compareNames(docs: DocumentRecord[]): FieldComparisonResult {
  const uploadedDocs = docs.filter(d => d.isUploaded && d.fields.name?.value);
  const docValuesMap: Record<DocumentType, string | undefined> = {
    aadhaar: undefined,
    pan: undefined,
    bank_passbook: undefined,
    marksheet: undefined,
    bank_statement: undefined,
    voter_id: undefined,
    passport: undefined,
    driving_licence: undefined,
  };

  uploadedDocs.forEach(d => {
    docValuesMap[d.type] = d.fields.name?.value;
  });

  if (uploadedDocs.length <= 1) {
    return {
      fieldName: 'name',
      fieldLabel: 'Full Name',
      status: 'GREEN',
      summary: 'Only one document available with name field.',
      technicalDetails: {
        exactMatch: true,
        normalizedMatch: true,
        differenceType: 'exact_match',
        similarityScore: 1.0,
      },
      docValues: docValuesMap,
    };
  }

  const rawValues = uploadedDocs.map(d => ({
    docType: d.type,
    docTitle: d.title,
    raw: d.fields.name!.value,
    norm: normalizeString(d.fields.name!.value),
  }));

  // Check unique normalized values
  const uniqueNorms = Array.from(new Set(rawValues.map(v => v.norm)));

  if (uniqueNorms.length === 1) {
    // All match exactly or with minor case/punctuation variations
    return {
      fieldName: 'name',
      fieldLabel: 'Full Name',
      status: 'GREEN',
      canonicalValue: rawValues[0].raw,
      summary: 'Full name matches consistently across all uploaded records.',
      technicalDetails: {
        exactMatch: rawValues.every(v => v.raw === rawValues[0].raw),
        normalizedMatch: true,
        differenceType: 'exact_match',
        similarityScore: 1.0,
        tokenDiffs: generateTokenDiffs(rawValues, rawValues[0].raw),
      },
      docValues: docValuesMap,
    };
  }

  // Count frequencies
  const clusterCounts: Record<string, { count: number; docs: DocumentType[]; sampleRaw: string }> = {};
  rawValues.forEach(v => {
    if (!clusterCounts[v.norm]) {
      clusterCounts[v.norm] = { count: 0, docs: [], sampleRaw: v.raw };
    }
    clusterCounts[v.norm].count += 1;
    clusterCounts[v.norm].docs.push(v.docType);
  });

  const sortedClusters = Object.entries(clusterCounts).sort((a, b) => b[1].count - a[1].count);

  // Check 50-50 conflicting clusters (e.g. 2 vs 2 split in AT-06)
  if (sortedClusters.length > 1 && sortedClusters[0][1].count === sortedClusters[1][1].count) {
    return {
      fieldName: 'name',
      fieldLabel: 'Full Name',
      status: 'RED',
      summary: `Conflicting identity clusters detected (${sortedClusters.map(c => `"${c[1].sampleRaw}"`).join(' vs ')}). Unable to automatically determine canonical name.`,
      technicalDetails: {
        exactMatch: false,
        normalizedMatch: false,
        differenceType: 'competing_clusters',
        similarityScore: 0.5,
        tokenDiffs: generateTokenDiffs(rawValues, sortedClusters[0][1].sampleRaw),
      },
      docValues: docValuesMap,
    };
  }

  // Primary canonical candidate
  const canonicalRaw = sortedClusters[0][1].sampleRaw;
  const canonicalNorm = sortedClusters[0][0];

  // Inspect the differences against canonical
  let hasAbbreviation = false;
  let hasSingleCharSpellingDiff = false;
  let hasMajorMismatch = false;

  const canonicalTokens = canonicalNorm.split(' ').filter(Boolean);

  rawValues.forEach(v => {
    if (v.norm === canonicalNorm) return;

    const vTokens = v.norm.split(' ').filter(Boolean);

    // Check abbreviation (e.g. "K" vs "Kumar")
    const isAbbrev = (canonicalTokens.length === vTokens.length) && canonicalTokens.every((ct, i) => {
      const vt = vTokens[i];
      if (ct === vt) return true;
      if ((ct.length === 1 && vt.startsWith(ct)) || (vt.length === 1 && ct.startsWith(vt))) {
        return true;
      }
      return false;
    });

    if (isAbbrev) {
      hasAbbreviation = true;
      return;
    }

    // Check single character difference (edit distance 1)
    const dist = levenshteinDistance(canonicalNorm, v.norm);
    if (dist <= 1) {
      hasSingleCharSpellingDiff = true;
      return;
    }

    hasMajorMismatch = true;
  });

  let status: TrafficLightStatus = 'AMBER';
  let diffType: FieldComparisonResult['technicalDetails']['differenceType'] = 'spelling_variation';
  let summary = '';

  if (hasMajorMismatch) {
    status = 'RED';
    diffType = 'major_mismatch';
    summary = 'Significant name mismatch detected across documents.';
  } else if (hasAbbreviation) {
    status = 'AMBER';
    diffType = 'abbreviation';
    summary = 'Abbreviation / initial variation detected (e.g. middle name abbreviated).';
  } else if (hasSingleCharSpellingDiff) {
    status = 'AMBER';
    diffType = 'spelling_variation';
    summary = 'Single character spelling variation detected (1 character edit distance).';
  }

  return {
    fieldName: 'name',
    fieldLabel: 'Full Name',
    status,
    canonicalValue: canonicalRaw,
    summary,
    technicalDetails: {
      exactMatch: false,
      normalizedMatch: false,
      differenceType: diffType,
      similarityScore: 0.85,
      tokenDiffs: generateTokenDiffs(rawValues, canonicalRaw),
    },
    docValues: docValuesMap,
  };
}

// Compare Date of Birth
export function compareDOB(docs: DocumentRecord[]): FieldComparisonResult {
  const uploadedDocs = docs.filter(d => d.isUploaded && d.fields.dob?.value);
  const docValuesMap: Record<DocumentType, string | undefined> = {
    aadhaar: undefined,
    pan: undefined,
    bank_passbook: undefined,
    marksheet: undefined,
    bank_statement: undefined,
    voter_id: undefined,
    passport: undefined,
    driving_licence: undefined,
  };

  docs.forEach(d => {
    docValuesMap[d.type] = d.fields.dob?.value;
  });

  if (uploadedDocs.length <= 1) {
    return {
      fieldName: 'dob',
      fieldLabel: 'Date of Birth',
      status: 'GREEN',
      canonicalValue: uploadedDocs[0]?.fields.dob?.value,
      summary: uploadedDocs.length === 1 ? 'DOB available on 1 record.' : 'DOB not provided.',
      technicalDetails: {
        exactMatch: true,
        normalizedMatch: true,
        differenceType: 'exact_match',
        similarityScore: 1.0,
      },
      docValues: docValuesMap,
    };
  }

  const parsed = uploadedDocs.map(d => ({
    docType: d.type,
    raw: d.fields.dob!.value,
    ...normalizeDate(d.fields.dob!.value),
  }));

  const uniqueCanonicals = Array.from(new Set(parsed.map(p => p.canonical)));

  if (uniqueCanonicals.length === 1) {
    const isExact = parsed.every(p => p.raw === parsed[0].raw);
    return {
      fieldName: 'dob',
      fieldLabel: 'Date of Birth',
      status: 'GREEN',
      canonicalValue: parsed[0].raw,
      summary: isExact
        ? 'Date of Birth matches identically across all records.'
        : 'Date of Birth matches across all records (formatting normalized).',
      technicalDetails: {
        exactMatch: isExact,
        normalizedMatch: true,
        differenceType: isExact ? 'exact_match' : 'formatting_difference',
        similarityScore: 1.0,
      },
      docValues: docValuesMap,
    };
  }

  // Mismatch in DOB is RED blocking
  return {
    fieldName: 'dob',
    fieldLabel: 'Date of Birth',
    status: 'RED',
    canonicalValue: parsed[0].raw,
    summary: `Material Date of Birth discrepancy found (${parsed.map(p => `${p.docType.toUpperCase()}: ${p.raw}`).join(' vs ')}). High risk of rejection.`,
    technicalDetails: {
      exactMatch: false,
      normalizedMatch: false,
      differenceType: 'major_mismatch',
      similarityScore: 0.0,
    },
    docValues: docValuesMap,
  };
}

// Compare Father's Name
export function compareFatherName(docs: DocumentRecord[]): FieldComparisonResult {
  const uploadedDocs = docs.filter(d => d.isUploaded && d.fields.fatherName?.value);
  const docValuesMap: Record<DocumentType, string | undefined> = {
    aadhaar: undefined,
    pan: undefined,
    bank_passbook: undefined,
    marksheet: undefined,
    bank_statement: undefined,
    voter_id: undefined,
    passport: undefined,
    driving_licence: undefined,
  };

  docs.forEach(d => {
    docValuesMap[d.type] = d.fields.fatherName?.value;
  });

  if (uploadedDocs.length <= 1) {
    return {
      fieldName: 'fatherName',
      fieldLabel: "Father's / Guardian Name",
      status: 'GREEN',
      canonicalValue: uploadedDocs[0]?.fields.fatherName?.value,
      summary: uploadedDocs.length === 1 ? "Father's name provided on 1 document." : "Father's name legitimately absent on other documents.",
      technicalDetails: {
        exactMatch: true,
        normalizedMatch: true,
        differenceType: 'exact_match',
        similarityScore: 1.0,
      },
      docValues: docValuesMap,
    };
  }

  const rawValues = uploadedDocs.map(d => ({
    docType: d.type,
    docTitle: d.title,
    raw: d.fields.fatherName!.value,
    norm: normalizeString(d.fields.fatherName!.value),
  }));

  const uniqueNorms = Array.from(new Set(rawValues.map(v => v.norm)));

  if (uniqueNorms.length === 1) {
    return {
      fieldName: 'fatherName',
      fieldLabel: "Father's / Guardian Name",
      status: 'GREEN',
      canonicalValue: rawValues[0].raw,
      summary: "Father's name is consistent across records.",
      technicalDetails: {
        exactMatch: rawValues.every(v => v.raw === rawValues[0].raw),
        normalizedMatch: true,
        differenceType: 'exact_match',
        similarityScore: 1.0,
        tokenDiffs: generateTokenDiffs(rawValues, rawValues[0].raw),
      },
      docValues: docValuesMap,
    };
  }

  // Check abbreviation or difference
  const canonical = rawValues[0].raw;
  return {
    fieldName: 'fatherName',
    fieldLabel: "Father's / Guardian Name",
    status: 'AMBER',
    canonicalValue: canonical,
    summary: "Father's name differs across records. Review before official submission.",
    technicalDetails: {
      exactMatch: false,
      normalizedMatch: false,
      differenceType: 'abbreviation',
      similarityScore: 0.85,
      tokenDiffs: generateTokenDiffs(rawValues, canonical),
    },
    docValues: docValuesMap,
  };
}

// Anchor Document Analysis
export function analyzeAnchorDocument(
  docs: DocumentRecord[],
  nameComparison: FieldComparisonResult,
  dobComparison: FieldComparisonResult,
  workflow: WorkflowId
): AnchorAnalysis {
  const uploadedDocs = docs.filter(d => d.isUploaded);

  if (nameComparison.technicalDetails.differenceType === 'competing_clusters') {
    return {
      isDetermined: false,
      confidence: 'LOW',
      rationale: 'Conflicting identity records detected with equal corroboration. The system will not arbitrarily select an anchor record.',
      hasCompetingClusters: true,
    };
  }

  // Preference for Aadhaar or Marksheet as anchor based on official workflow rules
  const marksheetDoc = uploadedDocs.find(d => d.type === 'marksheet');
  const aadhaarDoc = uploadedDocs.find(d => d.type === 'aadhaar');

  if (workflow === 'pan_aadhaar_link') {
    if (aadhaarDoc) {
      return {
        isDetermined: true,
        anchorDocType: 'aadhaar',
        anchorDocTitle: 'Aadhaar Card',
        confidence: 'HIGH',
        rationale: 'In PAN-Aadhaar linking, UIDAI Aadhaar serves as the primary demographic anchor record under CBDT guidelines.',
        hasCompetingClusters: false,
      };
    }
  }

  if (marksheetDoc && (workflow === 'scholarship_dbt' || workflow === 'employment_verification')) {
    return {
      isDetermined: true,
      anchorDocType: 'marksheet',
      anchorDocTitle: 'Class 10th Marksheet',
      confidence: 'HIGH',
      rationale: 'Class 10th certificate is legally authoritative for Date of Birth & Canonical Name in educational and employment verifications.',
      hasCompetingClusters: false,
    };
  }

  if (aadhaarDoc) {
    return {
      isDetermined: true,
      anchorDocType: 'aadhaar',
      anchorDocTitle: 'Aadhaar Card',
      confidence: 'HIGH',
      rationale: 'Aadhaar is corroborated by majority records and serves as the national digital identity reference.',
      hasCompetingClusters: false,
    };
  }

  return {
    isDetermined: true,
    anchorDocType: uploadedDocs[0]?.type || 'aadhaar',
    anchorDocTitle: uploadedDocs[0]?.title || 'Primary Record',
    confidence: 'MEDIUM',
    rationale: 'Selected based on available corroborating documents.',
    hasCompetingClusters: false,
  };
}

// Generate Remediation Sequence
export function generateRemediationPlan(
  docs: DocumentRecord[],
  fieldResults: FieldComparisonResult[],
  anchor: AnchorAnalysis,
  workflow: WorkflowId
): RemediationStep[] {
  const steps: RemediationStep[] = [];
  let stepCounter = 1;

  const panDoc = docs.find(d => d.type === 'pan' && d.isUploaded);
  const aadhaarDoc = docs.find(d => d.type === 'aadhaar' && d.isUploaded);
  const bankDoc = docs.find(d => d.type === 'bank_passbook' && d.isUploaded);

  const nameResult = fieldResults.find(f => f.fieldName === 'name');
  const dobResult = fieldResults.find(f => f.fieldName === 'dob');

  // Case 1: PAN Name or DOB Mismatch
  if (panDoc && aadhaarDoc && (nameResult?.status === 'AMBER' || nameResult?.status === 'RED' || dobResult?.status === 'RED')) {
    const panName = panDoc.fields.name?.value;
    const aadhaarName = aadhaarDoc.fields.name?.value;
    const panDob = panDoc.fields.dob?.value;
    const aadhaarDob = aadhaarDoc.fields.dob?.value;

    const isPanNameDiff = normalizeString(panName) !== normalizeString(aadhaarName);
    const isPanDobDiff = panDob && aadhaarDob && normalizeDate(panDob).canonical !== normalizeDate(aadhaarDob).canonical;

    if (isPanNameDiff || isPanDobDiff) {
      const fixField = isPanNameDiff && isPanDobDiff ? 'Name & Date of Birth' : isPanNameDiff ? 'Name' : 'Date of Birth';
      const targetVal = isPanNameDiff ? (aadhaarName || '') : (aadhaarDob || '');
      const currentVal = isPanNameDiff ? (panName || '') : (panDob || '');

      steps.push({
        stepNumber: stepCounter++,
        docType: 'pan',
        docTitle: 'PAN Card',
        fieldToFix: fixField,
        currentValue: currentVal,
        suggestedCanonicalValue: targetVal,
        priority: dobResult?.status === 'RED' ? 'HIGH' : 'MEDIUM',
        actionTitle: `Update ${fixField} on PAN Card via NSDL / Protean`,
        reason: `Your PAN record (${currentVal}) differs from Aadhaar (${targetVal}). Updating PAN to match Aadhaar is required before linking.`,
        authority: OFFICIAL_AUTHORITIES.pan_nsdl.authority,
        officialUrl: OFFICIAL_AUTHORITIES.pan_nsdl.officialUrl,
        verifiedFee: OFFICIAL_AUTHORITIES.pan_nsdl.verifiedFee,
        verifiedTimeline: OFFICIAL_AUTHORITIES.pan_nsdl.verifiedTimeline,
        lastVerifiedDate: OFFICIAL_AUTHORITIES.pan_nsdl.lastVerifiedDate,
        stepsSummary: OFFICIAL_AUTHORITIES.pan_nsdl.stepsSummary,
      });

      steps.push({
        stepNumber: stepCounter++,
        docType: 'pan',
        docTitle: 'PAN Card',
        fieldToFix: 'Database Reflection',
        currentValue: 'Pending',
        suggestedCanonicalValue: 'Updated in Income Tax Database',
        priority: 'MEDIUM',
        prerequisiteStep: stepCounter - 2,
        actionTitle: 'Wait for PAN database reflection & SMS confirmation',
        reason: 'Income Tax Department systems take approx. 5 to 15 days to synchronize changes across Protean/UTIITSL and UTI databases.',
        authority: 'Income Tax e-Filing Database',
        officialUrl: 'https://www.incometax.gov.in/iec/foportal/',
        verifiedFee: 'Included in initial application',
        verifiedTimeline: '5 to 15 working days',
        lastVerifiedDate: '2026-08-19',
        stepsSummary: [
          'Track status online using your 15-digit acknowledgement number',
          'Wait for SMS "Your PAN data has been updated"',
          'Verify updated e-PAN on the e-filing portal before proceeding',
        ],
      });
    }
  }

  // Case 2: Bank Account mismatch
  if (bankDoc && aadhaarDoc && nameResult?.status !== 'GREEN') {
    const bankName = bankDoc.fields.name?.value;
    const aadhaarName = aadhaarDoc.fields.name?.value;
    if (bankName && aadhaarName && normalizeString(bankName) !== normalizeString(aadhaarName)) {
      steps.push({
        stepNumber: stepCounter++,
        docType: 'bank_passbook',
        docTitle: 'Bank Account Passbook',
        fieldToFix: 'Account Holder Name',
        currentValue: bankName,
        suggestedCanonicalValue: aadhaarName,
        priority: 'MEDIUM',
        actionTitle: 'Synchronize Bank Account Name with Aadhaar (Re-KYC)',
        reason: `Bank record (${bankName}) has minor differences from Aadhaar (${aadhaarName}), which may interrupt Direct Benefit Transfer (DBT) or automated KYC.`,
        authority: OFFICIAL_AUTHORITIES.bank_branch.authority,
        officialUrl: OFFICIAL_AUTHORITIES.bank_branch.officialUrl,
        verifiedFee: OFFICIAL_AUTHORITIES.bank_branch.verifiedFee,
        verifiedTimeline: OFFICIAL_AUTHORITIES.bank_branch.verifiedTimeline,
        lastVerifiedDate: OFFICIAL_AUTHORITIES.bank_branch.lastVerifiedDate,
        stepsSummary: OFFICIAL_AUTHORITIES.bank_branch.stepsSummary,
      });
    }
  }

  // Final Step: Re-check and Execute Target Workflow
  steps.push({
    stepNumber: stepCounter++,
    docType: 'aadhaar',
    docTitle: 'All Documents',
    fieldToFix: 'Workflow Completion',
    currentValue: 'Mismatch Identified',
    suggestedCanonicalValue: '100% Harmony',
    priority: 'HIGH',
    prerequisiteStep: steps.length > 0 ? steps[steps.length - 1].stepNumber : undefined,
    actionTitle: workflow === 'pan_aadhaar_link' ? 'Perform PAN-Aadhaar Link on e-Filing Portal' : 'Submit Target Application with verified documents',
    reason: 'Once all documents are in harmony, your target government or financial transaction can be executed with zero risk of identity rejection.',
    authority: 'Income Tax e-Filing Portal / Relevant Authority',
    officialUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar',
    verifiedFee: 'Standard government portal fee (if applicable)',
    verifiedTimeline: 'Instant to 48 hours',
    lastVerifiedDate: '2026-08-19',
    stepsSummary: [
      'Re-run Document Harmony Checker to ensure all fields are Green (🟢)',
      'Navigate to the official portal link',
      'Submit your application with 100% consistency',
    ],
  });

  return steps;
}

// Master Harmony Analysis function
export function calculateDocumentHarmony(
  docs: DocumentRecord[],
  workflow: WorkflowId
): HarmonyAnalysisResult {
  const uploadedDocs = docs.filter(d => d.isUploaded);

  // Check if any OCR field is unverified
  const isOcrCorrectionPending = uploadedDocs.some(d =>
    Object.values(d.fields).some(f => f && (!f.isUserVerified || f.rawConfidence < 0.7))
  );

  const nameResult = compareNames(docs);
  const dobResult = compareDOB(docs);
  const fatherResult = compareFatherName(docs);

  const fieldResults = [nameResult, dobResult, fatherResult];

  // Overall Status Calculation
  let overallStatus: TrafficLightStatus = 'GREEN';
  if (fieldResults.some(f => f.status === 'RED')) {
    overallStatus = 'RED';
  } else if (fieldResults.some(f => f.status === 'AMBER')) {
    overallStatus = 'AMBER';
  }

  // Harmony Score heuristic
  let harmonyScore = 100;
  if (dobResult.status === 'RED') {
    harmonyScore -= 50;
  }
  if (nameResult.status === 'RED') {
    harmonyScore -= 45;
  } else if (nameResult.status === 'AMBER') {
    harmonyScore -= 15;
  }
  if (fatherResult.status === 'AMBER') {
    harmonyScore -= 8;
  }
  if (isOcrCorrectionPending) {
    harmonyScore -= 10;
  }
  harmonyScore = Math.max(0, Math.min(100, harmonyScore));

  const anchorAnalysis = analyzeAnchorDocument(docs, nameResult, dobResult, workflow);
  const remediationPlan = generateRemediationPlan(docs, fieldResults, anchorAnalysis, workflow);

  let statusSummary = 'All document fields are in optimal harmony.';
  if (overallStatus === 'RED') {
    statusSummary = 'High-risk discrepancies detected that are likely to cause rejection on government/KYC portals.';
  } else if (overallStatus === 'AMBER') {
    statusSummary = 'Minor differences detected (e.g. abbreviations or spelling variations) that require review.';
  }

  const workflowSpecificNotes: string[] = [];
  if (workflow === 'pan_aadhaar_link') {
    workflowSpecificNotes.push('Under CBDT regulations, PAN and Aadhaar require matching Name, DOB, and Gender.');
    if (dobResult.status === 'RED') {
      workflowSpecificNotes.push('Warning: DOB difference will cause immediate automated linking failure on Income Tax portal.');
    }
  }

  return {
    overallStatus,
    harmonyScore,
    statusSummary,
    fieldResults,
    anchorAnalysis,
    remediationPlan,
    workflowSpecificNotes,
    isOcrCorrectionPending,
  };
}
