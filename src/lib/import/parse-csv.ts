export interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

const HEADER_ALIASES: Record<string, string> = {
  company: "company",
  "company name": "company",
  firma: "company",
  website: "website",
  url: "website",
  web: "website",
  email: "email",
  "e-mail": "email",
  phone: "phone",
  telephone: "phone",
  tel: "phone",
  city: "city",
  ort: "city",
  industry: "industry",
  branche: "industry",
  notes: "notes",
  note: "notes",
  comments: "notes",
};

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function detectDelimiter(line: string): "," | ";" {
  let commaCount = 0;
  let semicolonCount = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes) {
      if (char === ",") commaCount++;
      if (char === ";") semicolonCount++;
    }
  }

  return semicolonCount > commaCount ? ";" : ",";
}

function parseCsvLine(line: string, delimiter: "," | ";"): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvRows(text: string, delimiter: "," | ";"): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        current += char;
      }
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      if (current.trim()) {
        rows.push(parseCsvLine(current, delimiter));
      }
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    rows.push(parseCsvLine(current, delimiter));
  }

  return rows;
}

export function normalizeHeader(header: string): string | null {
  const key = header.trim().toLowerCase();
  return HEADER_ALIASES[key] ?? null;
}

export function parseCsv(text: string): ParsedCsv {
  const cleaned = stripBom(text.trim());
  if (!cleaned) {
    return { headers: [], rows: [] };
  }

  const firstLine = cleaned.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = detectDelimiter(firstLine);
  const parsedRows = parseCsvRows(cleaned, delimiter);

  if (parsedRows.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = parsedRows[0];
  const headers = rawHeaders.map((header) => normalizeHeader(header) ?? header.trim().toLowerCase());
  const rows = parsedRows.slice(1).filter((row) => row.some((cell) => cell.trim()));

  return { headers, rows };
}
