const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const outDir = path.resolve(__dirname, '..', 'testdata');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'testdata.xlsx');

const data = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'locked_out_user', password: 'secret_sauce' }
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

XLSX.writeFile(wb, outPath);

console.log('Wrote', outPath);
