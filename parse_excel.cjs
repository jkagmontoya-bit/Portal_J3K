const xlsx = require('xlsx');

const filePath = 'C:\\Users\\juan.montoya\\Downloads\\COT N° 2026-01-003.xlsx';
const workbook = xlsx.readFile(filePath);

console.log("Hojas disponibles:", workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
  console.log(`\n--- Hoja: ${sheetName} ---`);
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  // Muestra las primeras 20 filas para entender la estructura
  data.slice(0, 20).forEach(row => {
    console.log(JSON.stringify(row));
  });
});
