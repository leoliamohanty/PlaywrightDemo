import * as XLSX from 'xlsx';
import path from 'path';

export function readExcel(fileName: string, sheetName: string) {
  const filePath = path.resolve(__dirname, fileName);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
}

export function writeExcel(fileName: string, sheetName: string, data: any[]) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const filePath = path.resolve(__dirname, fileName);
  XLSX.writeFile(workbook, filePath);
}

export function readExcelsheet(
  filePath: string,
  sheetName: string
): Record<string, any>[] {

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON
  const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  return data;
}

