export interface CsvContactRow {
  name?: string;
  phone: string;
  tags?: string[];
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && quoted && line[i + 1] === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value.trim());
  return values;
}

export function parseContactsCsv(content: string): CsvContactRow[] {
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error('CSV fayl bo‘sh.');

  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  const phoneIndex = headers.indexOf('phone');
  const nameIndex = headers.indexOf('name');
  const tagsIndex = headers.indexOf('tags');
  if (phoneIndex === -1) throw new Error('CSV faylda phone ustuni topilmadi.');

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return {
      phone: values[phoneIndex] ?? '',
      name: nameIndex >= 0 ? values[nameIndex] || undefined : undefined,
      tags: tagsIndex >= 0 ? values[tagsIndex]?.split(';').map((tag) => tag.trim()).filter(Boolean) : undefined,
    };
  });
}
