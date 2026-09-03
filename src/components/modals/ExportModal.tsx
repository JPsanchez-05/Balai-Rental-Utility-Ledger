import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFormat?: 'csv' | 'pdf';
  month: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  defaultFormat = 'csv',
  month,
}) => {
  const [format, setFormat] = useState<'csv' | 'pdf'>(defaultFormat);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Trigger dummy download
      const filename = `Balai_Report_${month.replace(' ', '_')}.${format}`;
      const blob = new Blob([`Report for ${month} generated from Balai Rental Utility`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Financial Report"
      subtitle={`Export monthly revenue and tenant balances for ${month}`}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {/* CSV Option */}
          <button
            type="button"
            onClick={() => setFormat('csv')}
            className={`p-4 rounded-xl border text-left flex flex-col items-center gap-2 transition-all ${
              format === 'csv'
                ? 'border-[#2563eb] bg-[#EFF6FF] ring-2 ring-[#2563eb]/20'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <FileSpreadsheet className={`w-8 h-8 ${format === 'csv' ? 'text-[#2563eb]' : 'text-[#64748B]'}`} />
            <div className="text-center">
              <div className="font-bold text-sm text-[#0F172A]">CSV Spreadsheet</div>
              <div className="text-xs text-[#64748B]">Raw rows & financial data</div>
            </div>
          </button>

          {/* PDF Option */}
          <button
            type="button"
            onClick={() => setFormat('pdf')}
            className={`p-4 rounded-xl border text-left flex flex-col items-center gap-2 transition-all ${
              format === 'pdf'
                ? 'border-[#2563eb] bg-[#EFF6FF] ring-2 ring-[#2563eb]/20'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <FileText className={`w-8 h-8 ${format === 'pdf' ? 'text-[#2563eb]' : 'text-[#64748B]'}`} />
            <div className="text-center">
              <div className="font-bold text-sm text-[#0F172A]">PDF Document</div>
              <div className="text-xs text-[#64748B]">Formatted executive report</div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF2F7]">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : `Export ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
