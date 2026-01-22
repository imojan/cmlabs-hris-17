// src/lib/exportExcel.js
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

// HRIS Brand Colors
const HRIS_BLUE = "1D395E";
const HRIS_LIGHT_BLUE = "7CA6BF";

// Common styles
const styles = {
  // Title style (Company Name)
  companyName: {
    font: { bold: true, sz: 16, color: { rgb: HRIS_BLUE } },
    alignment: { horizontal: "center", vertical: "center" },
  },
  // Subtitle style (Report Title)
  reportTitle: {
    font: { bold: true, sz: 14, color: { rgb: HRIS_BLUE } },
    alignment: { horizontal: "center", vertical: "center" },
  },
  // Info text style
  infoText: {
    font: { sz: 11, color: { rgb: "666666" } },
    alignment: { horizontal: "left", vertical: "center" },
  },
  // Table header style - Blue background with white text
  tableHeader: {
    font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: HRIS_BLUE } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  },
  // Table cell style - with borders
  tableCell: {
    font: { sz: 10 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  },
  // Table cell centered
  tableCellCenter: {
    font: { sz: 10 },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  },
  // Alternating row style
  tableCellAlt: {
    font: { sz: 10 },
    fill: { fgColor: { rgb: "F5F7FA" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  },
  tableCellAltCenter: {
    font: { sz: 10 },
    fill: { fgColor: { rgb: "F5F7FA" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  },
};

/**
 * Export data to Excel with HRIS branding and styling
 * @param {Object} options - Export options
 * @param {string} options.title - Report title (e.g., "DATA KARYAWAN")
 * @param {string} options.companyName - Company name
 * @param {string} options.reportDate - Report generation date
 * @param {Array} options.columns - Column definitions [{header: string, key: string, width: number}]
 * @param {Array} options.data - Data array
 * @param {string} options.filename - Output filename (without extension)
 */
export function exportToExcel({
  title = "DATA HRIS",
  companyName = "CMLABS INDONESIA",
  reportDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  columns = [],
  data = [],
  filename = "export_data",
}) {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Calculate total columns for merging
  const totalCols = columns.length;

  // Build worksheet data with styles
  const wsData = [];

  // Row 1: Company Name (will be merged)
  wsData.push([{ v: companyName, s: styles.companyName }]);

  // Row 2: Report Title (will be merged)
  wsData.push([{ v: title, s: styles.reportTitle }]);

  // Row 3: Empty row
  wsData.push([]);

  // Row 4: Report Date
  wsData.push([{ v: `Tanggal Laporan: ${reportDate}`, s: styles.infoText }]);

  // Row 5: Total Records
  wsData.push([{ v: `Total Data: ${data.length} records`, s: styles.infoText }]);

  // Row 6: Empty row
  wsData.push([]);

  // Row 7: Table Headers with styling
  const headerRow = columns.map((col) => ({
    v: col.header,
    s: styles.tableHeader,
  }));
  wsData.push(headerRow);

  // Data rows with alternating colors
  data.forEach((item, rowIndex) => {
    const isAlt = rowIndex % 2 === 1;
    const row = columns.map((col, colIndex) => {
      let value;
      if (col.key === "no") {
        value = rowIndex + 1;
      } else {
        value = item[col.key];
        if (value === null || value === undefined) {
          value = "-";
        }
      }

      // Determine style based on column position and row
      const isFirstCol = colIndex === 0; // No. column should be centered
      let cellStyle;
      if (isAlt) {
        cellStyle = isFirstCol ? styles.tableCellAltCenter : styles.tableCellAlt;
      } else {
        cellStyle = isFirstCol ? styles.tableCellCenter : styles.tableCell;
      }

      return { v: value, s: cellStyle };
    });
    wsData.push(row);
  });

  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws["!cols"] = columns.map((col) => ({ wch: col.width || 15 }));

  // Set row heights
  ws["!rows"] = [
    { hpt: 25 }, // Company name row
    { hpt: 22 }, // Title row
    { hpt: 15 }, // Empty
    { hpt: 18 }, // Date
    { hpt: 18 }, // Total
    { hpt: 15 }, // Empty
    { hpt: 25 }, // Header row
    ...data.map(() => ({ hpt: 20 })), // Data rows
  ];

  // Merge cells for title rows
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }, // Company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } }, // Title
    { s: { r: 3, c: 0 }, e: { r: 3, c: totalCols - 1 } }, // Report date
    { s: { r: 4, c: 0 }, e: { r: 4, c: totalCols - 1 } }, // Total data
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // Generate file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  // Download file
  const formattedDate = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  saveAs(blob, `${filename}_${formattedDate}.xlsx`);
}

/**
 * Parse Excel file for import
 * @param {File} file - Excel file to parse
 * @param {Array} expectedColumns - Expected column keys for validation
 * @returns {Promise<{data: Array, errors: Array}>}
 */
export async function parseExcelFile(file, expectedColumns = []) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Find header row (skip company info rows)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(10, jsonData.length); i++) {
          const row = jsonData[i];
          if (row && row.length >= expectedColumns.length) {
            // Check if this looks like a header row
            const isHeader = expectedColumns.some((col) =>
              row.some(
                (cell) =>
                  cell &&
                  String(cell).toLowerCase().includes(col.toLowerCase())
              )
            );
            if (isHeader) {
              headerRowIndex = i;
              break;
            }
          }
        }

        // Parse header
        const headers = jsonData[headerRowIndex] || [];

        // Parse data rows
        const parsedData = [];
        const errors = [];

        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0 || row.every((cell) => !cell)) {
            continue; // Skip empty rows
          }

          const rowData = {};
          headers.forEach((header, index) => {
            if (header) {
              rowData[String(header).trim()] = row[index];
            }
          });

          parsedData.push({
            rowNumber: i + 1,
            data: rowData,
          });
        }

        resolve({
          data: parsedData,
          headers: headers.filter(Boolean),
          errors,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate sample import template with styling
 * @param {Array} columns - Column definitions
 * @param {string} filename - Output filename
 */
export function downloadImportTemplate(columns, filename = "template_import") {
  const wb = XLSX.utils.book_new();
  const totalCols = columns.length;

  const wsData = [];

  // Title row
  wsData.push([{ v: "TEMPLATE IMPORT DATA", s: styles.reportTitle }]);

  // Instruction row
  wsData.push([{ v: "Silakan isi data mulai dari baris ke-4", s: styles.infoText }]);

  // Empty row
  wsData.push([]);

  // Header row with styling
  const headerRow = columns.map((col) => ({
    v: col.header,
    s: styles.tableHeader,
  }));
  wsData.push(headerRow);

  // Sample row
  const sampleRow = columns.map((col) => ({
    v: col.sample || "",
    s: styles.tableCell,
  }));
  wsData.push(sampleRow);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws["!cols"] = columns.map((col) => ({ wch: col.width || 15 }));

  // Set row heights
  ws["!rows"] = [
    { hpt: 25 },
    { hpt: 18 },
    { hpt: 15 },
    { hpt: 25 },
    { hpt: 20 },
  ];

  // Merge title rows
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Template");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `${filename}.xlsx`);
}
