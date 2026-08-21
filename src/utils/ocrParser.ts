import { DocumentRecord, DocumentType } from '@/types';

export interface ParsedDocumentData {
  fields: DocumentRecord['fields'];
  rawText: string;
  detectedDocType?: DocumentType;
}

/**
 * Clean and normalize OCR string lines
 */
function cleanOcrText(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/**
 * Normalizes extracted DOB to standard DD/MM/YYYY
 */
export function formatOcrDob(dobStr?: string): string | undefined {
  if (!dobStr) return undefined;
  const clean = dobStr.replace(/[.\-]/g, '/').trim();
  const match = clean.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const year = match[3];
    return `${day}/${month}/${year}`;
  }
  // If only year is found (common on older Aadhaar cards)
  const yMatch = clean.match(/\b(19\d{2}|20\d{2})\b/);
  if (yMatch) {
    return `01/01/${yMatch[1]}`;
  }
  return clean;
}

/**
 * Parse PAN Card OCR Text
 */
function parsePanCard(lines: string[], rawText: string): DocumentRecord['fields'] {
  const fields: DocumentRecord['fields'] = {};

  // 1. PAN Number: 5 uppercase letters + 4 digits + 1 letter (e.g., ABCDE1234F)
  const panRegex = /\b([A-Z]{5}[0-9]{4}[A-Z])\b/i;
  const panMatch = rawText.match(panRegex);
  if (panMatch) {
    const pan = panMatch[1].toUpperCase();
    const masked = `${pan.slice(0, 5)}****${pan.slice(-1)}`;
    fields.docNumberMasked = {
      value: masked,
      rawConfidence: 0.98,
      isUserVerified: false,
      originalOcrValue: pan,
    };
  }

  // 2. Date of Birth: DD/MM/YYYY
  const dobRegex = /\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\b/;
  const dobMatch = rawText.match(dobRegex);
  if (dobMatch) {
    const formattedDob = formatOcrDob(dobMatch[1]);
    if (formattedDob) {
      fields.dob = {
        value: formattedDob,
        rawConfidence: 0.96,
        isUserVerified: false,
        originalOcrValue: dobMatch[1],
      };
    }
  }

  // 3. Name & Father's Name extraction
  // Often in PAN: Line containing "Name" or lines before "Father's Name"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for explicit "Name" label
    if (/^NAME\b[:\s-]*/i.test(line) && !/FATHER/i.test(line)) {
      const nameVal = line.replace(/^NAME\b[:\s-]*/i, '').trim();
      if (nameVal && nameVal.length >= 2) {
        fields.name = {
          value: nameVal.toUpperCase(),
          rawConfidence: 0.95,
          isUserVerified: false,
          originalOcrValue: nameVal,
        };
      } else if (i + 1 < lines.length && !lines[i + 1].includes(':')) {
        fields.name = {
          value: lines[i + 1].trim().toUpperCase(),
          rawConfidence: 0.92,
          isUserVerified: false,
          originalOcrValue: lines[i + 1],
        };
      }
    }

    // Look for explicit "Father's Name" label
    if (/FATH(ER|OR)['’]?S?\s*NAME\b[:\s-]*/i.test(line)) {
      const fatherVal = line.replace(/.*FATH(ER|OR)['’]?S?\s*NAME\b[:\s-]*/i, '').trim();
      if (fatherVal && fatherVal.length >= 2) {
        fields.fatherName = {
          value: fatherVal.toUpperCase(),
          rawConfidence: 0.94,
          isUserVerified: false,
          originalOcrValue: fatherVal,
        };
      } else if (i + 1 < lines.length && !lines[i + 1].includes(':')) {
        fields.fatherName = {
          value: lines[i + 1].trim().toUpperCase(),
          rawConfidence: 0.91,
          isUserVerified: false,
          originalOcrValue: lines[i + 1],
        };
      }
    }
  }

  // Fallback for Name if not found via labels:
  // Look for prominent capital strings that are not header keywords
  if (!fields.name) {
    const ignoredKeywords = [
      'INCOME', 'TAX', 'DEPARTMENT', 'GOVT', 'INDIA', 'PERMANENT',
      'ACCOUNT', 'NUMBER', 'CARD', 'SIGNATURE', 'DIGITALLY', 'FATHER'
    ];
    for (const line of lines) {
      const cleanLine = line.replace(/[^A-Za-z\s]/g, '').trim();
      const tokens = cleanLine.split(/\s+/);
      const isHeader = tokens.some((t) => ignoredKeywords.includes(t.toUpperCase()));
      if (!isHeader && tokens.length >= 2 && tokens.length <= 4 && cleanLine.length >= 5) {
        fields.name = {
          value: cleanLine.toUpperCase(),
          rawConfidence: 0.85,
          isUserVerified: false,
          originalOcrValue: line,
        };
        break;
      }
    }
  }

  return fields;
}

/**
 * Parse Aadhaar Card OCR Text
 */
function parseAadhaarCard(lines: string[], rawText: string): DocumentRecord['fields'] {
  const fields: DocumentRecord['fields'] = {};

  // 1. Aadhaar Number: 12 digits (often in 4 4 4 grouping: e.g. 1234 5678 9012)
  const aadhaarRegex = /\b(\d{4}\s\d{4}\s\d{4})\b/;
  const unspacedAadhaarRegex = /\b(\d{12})\b/;
  const aadhaarMatch = rawText.match(aadhaarRegex) || rawText.match(unspacedAadhaarRegex);
  
  if (aadhaarMatch) {
    const rawDigits = aadhaarMatch[1].replace(/\s+/g, '');
    const masked = `XXXX-XXXX-${rawDigits.slice(-4)}`;
    fields.docNumberMasked = {
      value: masked,
      rawConfidence: 0.99,
      isUserVerified: false,
      originalOcrValue: aadhaarMatch[1],
    };
  }

  // 2. Date of Birth or Year of Birth
  const dobRegex = /(?:DOB|D\.O\.B|जन्म\s*तिथि|Date\s*of\s*Birth)\s*[:\-\s]\s*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i;
  const dobMatch = rawText.match(dobRegex) || rawText.match(/\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\b/);
  if (dobMatch) {
    const formatted = formatOcrDob(dobMatch[1]);
    if (formatted) {
      fields.dob = {
        value: formatted,
        rawConfidence: 0.97,
        isUserVerified: false,
        originalOcrValue: dobMatch[1],
      };
    }
  } else {
    // Year of birth only
    const yobMatch = rawText.match(/(?:Year\s*of\s*Birth|जन्म\s*वर्ष)\s*[:\-\s]\s*(\d{4})/i);
    if (yobMatch) {
      fields.dob = {
        value: `01/01/${yobMatch[1]}`,
        rawConfidence: 0.85,
        isUserVerified: false,
        originalOcrValue: yobMatch[1],
      };
    }
  }

  // 3. Gender (MALE / FEMALE / TRANSGENDER / पुरुष / महिला)
  if (/\b(MALE|पुरुष)\b/i.test(rawText) && !/\bFEMALE\b/i.test(rawText)) {
    fields.gender = {
      value: 'Male',
      rawConfidence: 0.98,
      isUserVerified: false,
      originalOcrValue: 'Male',
    };
  } else if (/\b(FEMALE|महिला)\b/i.test(rawText)) {
    fields.gender = {
      value: 'Female',
      rawConfidence: 0.98,
      isUserVerified: false,
      originalOcrValue: 'Female',
    };
  } else if (/\b(TRANSGENDER|OTHER)\b/i.test(rawText)) {
    fields.gender = {
      value: 'Other',
      rawConfidence: 0.95,
      isUserVerified: false,
      originalOcrValue: 'Other',
    };
  }

  // 4. Name extraction
  // Name is typically above the DOB line or after Government of India header
  const ignoreKeywords = [
    'GOVERNMENT', 'INDIA', 'BHARAT', 'SARKAR', 'UIDAI', 'ENROLMENT',
    'UNIQUE', 'IDENTIFICATION', 'AUTHORITY', 'MALE', 'FEMALE', 'DOB',
    'YEAR', 'BIRTH', 'AADHAAR', 'HELP', 'ADDRESS', 'VID'
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^NAME\b[:\s-]*/i.test(line)) {
      const nameVal = line.replace(/^NAME\b[:\s-]*/i, '').trim();
      if (nameVal && nameVal.length >= 3) {
        fields.name = {
          value: nameVal.toUpperCase(),
          rawConfidence: 0.96,
          isUserVerified: false,
          originalOcrValue: nameVal,
        };
        break;
      }
    }
  }

  if (!fields.name) {
    for (const line of lines) {
      const cleanLine = line.replace(/[^A-Za-z\s]/g, '').trim();
      const tokens = cleanLine.split(/\s+/);
      const isHeader = tokens.some((t) => ignoreKeywords.includes(t.toUpperCase()));
      if (!isHeader && tokens.length >= 2 && tokens.length <= 4 && cleanLine.length >= 5) {
        fields.name = {
          value: cleanLine.toUpperCase(),
          rawConfidence: 0.88,
          isUserVerified: false,
          originalOcrValue: line,
        };
        break;
      }
    }
  }

  return fields;
}

/**
 * Parse Class 10th / 12th Marksheet OCR Text
 */
function parseMarksheet(lines: string[], rawText: string): DocumentRecord['fields'] {
  const fields: DocumentRecord['fields'] = {};

  // 1. Candidate Name
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/(?:CANDIDATE['’]?S?\s*NAME|STUDENT['’]?S?\s*NAME|NAME\s*OF\s*CANDIDATE)\s*[:\-\s]+/i.test(line)) {
      const val = line.replace(/.*(?:NAME)\s*[:\-\s]+/i, '').trim();
      if (val && val.length >= 3) {
        fields.name = {
          value: val.toUpperCase(),
          rawConfidence: 0.96,
          isUserVerified: false,
          originalOcrValue: val,
        };
      }
    }

    if (/FATHER['’]?S?\s*NAME\s*[:\-\s]+/i.test(line)) {
      const fVal = line.replace(/.*FATHER['’]?S?\s*NAME\s*[:\-\s]+/i, '').trim();
      if (fVal && fVal.length >= 3) {
        fields.fatherName = {
          value: fVal.toUpperCase(),
          rawConfidence: 0.95,
          isUserVerified: false,
          originalOcrValue: fVal,
        };
      }
    }
  }

  // 2. Date of Birth
  const dobMatch = rawText.match(/(?:DATE\s*OF\s*BIRTH|DOB)\s*[:\-\s]\s*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i) ||
                   rawText.match(/\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\b/);
  if (dobMatch) {
    const formatted = formatOcrDob(dobMatch[1]);
    if (formatted) {
      fields.dob = {
        value: formatted,
        rawConfidence: 0.98,
        isUserVerified: false,
        originalOcrValue: dobMatch[1],
      };
    }
  }

  // 3. Roll / Certificate Number
  const rollMatch = rawText.match(/(?:ROLL\s*NO|CERTIFICATE\s*NO|REGISTRATION\s*NO)\s*[:\-\s]*([A-Z0-9\/-]+)/i);
  if (rollMatch) {
    fields.docNumberMasked = {
      value: rollMatch[1].trim(),
      rawConfidence: 0.95,
      isUserVerified: false,
      originalOcrValue: rollMatch[1],
    };
  }

  return fields;
}

/**
 * Parse Bank Passbook / Statement OCR Text
 */
function parseBankPassbook(lines: string[], rawText: string): DocumentRecord['fields'] {
  const fields: DocumentRecord['fields'] = {};

  // 1. Bank Name detection
  const bankPatterns = [
    'STATE BANK OF INDIA',
    'HDFC BANK',
    'ICICI BANK',
    'PUNJAB NATIONAL BANK',
    'BANK OF BARODA',
    'CANARA BANK',
    'UNION BANK OF INDIA',
    'AXIS BANK',
    'KOTAK MAHINDRA BANK',
    'INDIAN BANK',
    'CENTRAL BANK OF INDIA',
  ];

  for (const b of bankPatterns) {
    if (new RegExp(b, 'i').test(rawText)) {
      fields.bankName = {
        value: b,
        rawConfidence: 0.98,
        isUserVerified: false,
        originalOcrValue: b,
      };
      break;
    }
  }

  // 2. Account Holder Name
  for (const line of lines) {
    if (/(?:ACCOUNT\s*HOLDER|A\/C\s*NAME|CUSTOMER\s*NAME|NAME)\s*[:\-\s]+/i.test(line)) {
      const nameVal = line.replace(/.*(?:NAME)\s*[:\-\s]+/i, '').trim();
      if (nameVal && nameVal.length >= 3 && !/BANK|BRANCH|IFSC/i.test(nameVal)) {
        fields.name = {
          value: nameVal.toUpperCase(),
          rawConfidence: 0.93,
          isUserVerified: false,
          originalOcrValue: nameVal,
        };
        break;
      }
    }
  }

  // 3. Account Number
  const acMatch = rawText.match(/(?:A\/C\s*NO|ACCOUNT\s*NO|A\/C\s*NUMBER)\s*[:\-\s]*([0-9X*]{8,18})/i);
  if (acMatch) {
    const raw = acMatch[1].trim();
    const masked = raw.length > 4 ? `XXXXXXXX${raw.slice(-4)}` : raw;
    fields.docNumberMasked = {
      value: masked,
      rawConfidence: 0.96,
      isUserVerified: false,
      originalOcrValue: raw,
    };
  }

  return fields;
}

/**
 * Universal Indian Document OCR Parser Dispatcher
 */
export function parseIndianDocument(
  rawOcrText: string,
  targetDocType: DocumentType
): ParsedDocumentData {
  const lines = cleanOcrText(rawOcrText);

  let fields: DocumentRecord['fields'] = {};

  switch (targetDocType) {
    case 'pan':
      fields = parsePanCard(lines, rawOcrText);
      break;
    case 'aadhaar':
      fields = parseAadhaarCard(lines, rawOcrText);
      break;
    case 'marksheet':
      fields = parseMarksheet(lines, rawOcrText);
      break;
    case 'bank_passbook':
    case 'bank_statement':
      fields = parseBankPassbook(lines, rawOcrText);
      break;
    default:
      // General heuristic parser
      fields = parseAadhaarCard(lines, rawOcrText);
      break;
  }

  return {
    fields,
    rawText: rawOcrText,
    detectedDocType: targetDocType,
  };
}
