// src/components/ui/ImportModal.jsx
import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, Download } from "lucide-react";
import { parseExcelFile, downloadImportTemplate } from "@/lib/exportExcel";

/**
 * ImportModal - Modal untuk import data dari Excel
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onImport - Import handler (parsedData) => Promise
 * @param {Array} props.columns - Expected columns [{header: string, key: string, sample: string, width: number}]
 * @param {string} props.title - Modal title
 * @param {string} props.templateFilename - Template filename
 */
export function ImportModal({
  isOpen,
  onClose,
  onImport,
  columns = [],
  title = "Import Data",
  templateFilename = "template_import",
}) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setError("Format file tidak valid. Gunakan file .xlsx atau .xls");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setParsing(true);
    setSuccess(false);

    try {
      const expectedKeys = columns.map((c) => c.header);
      const result = await parseExcelFile(selectedFile, expectedKeys);
      setParsedData(result);
      
      if (result.data.length === 0) {
        setError("File tidak berisi data yang valid");
      }
    } catch (err) {
      console.error("Parse error:", err);
      setError("Gagal membaca file. Pastikan format file benar.");
      setParsedData(null);
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.data.length === 0) return;

    setImporting(true);
    setError(null);

    try {
      await onImport(parsedData.data);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Import error:", err);
      setError(err.message || "Gagal mengimport data");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleDownloadTemplate = () => {
    downloadImportTemplate(columns, templateFilename);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            disabled={importing}
            className="p-1 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Template Download */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              Download template Excel untuk memastikan format data yang benar:
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          {/* File Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              file
                ? "border-emerald-300 bg-emerald-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileSpreadsheet className="w-10 h-10 text-emerald-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">
                  Klik untuk upload file Excel
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  atau drag & drop file .xlsx / .xls
                </p>
              </>
            )}
          </div>

          {/* Parsing Status */}
          {parsing && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Membaca file...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 rounded-lg text-rose-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Data berhasil diimport!</p>
            </div>
          )}

          {/* Preview */}
          {parsedData && parsedData.data.length > 0 && !success && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Preview Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                Ditemukan <span className="font-semibold">{parsedData.data.length}</span> baris data
              </p>
              
              {/* Preview Table */}
              <div className="overflow-x-auto max-h-48 border border-gray-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-2 py-1.5 text-left font-medium text-gray-700">Row</th>
                      {parsedData.headers.slice(0, 4).map((header, idx) => (
                        <th key={idx} className="px-2 py-1.5 text-left font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                      {parsedData.headers.length > 4 && (
                        <th className="px-2 py-1.5 text-left font-medium text-gray-500">
                          +{parsedData.headers.length - 4} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.data.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="px-2 py-1.5 text-gray-500">{row.rowNumber}</td>
                        {parsedData.headers.slice(0, 4).map((header, hIdx) => (
                          <td key={hIdx} className="px-2 py-1.5 text-gray-800 truncate max-w-[100px]">
                            {row.data[header] || "-"}
                          </td>
                        ))}
                        {parsedData.headers.length > 4 && <td className="px-2 py-1.5 text-gray-400">...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.data.length > 5 && (
                <p className="text-xs text-gray-500 mt-2">
                  ... dan {parsedData.data.length - 5} baris lainnya
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={importing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleImport}
            disabled={!parsedData || parsedData.data.length === 0 || importing || success}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing && <Loader2 className="w-4 h-4 animate-spin" />}
            {importing ? "Mengimport..." : `Import ${parsedData?.data.length || 0} Data`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportModal;
