import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { CalendarPlus, Users, RotateCcw } from 'lucide-react';

interface AddMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  availableMonths: string[];
  onMonthAdded: (newMonthKey: string, sourceMonthKey: string, importData: boolean) => void;
}

export const AddMonthModal: React.FC<AddMonthModalProps> = ({
  isOpen,
  onClose,
  currentMonth,
  availableMonths,
  onMonthAdded,
}) => {
  const monthsNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Derive initial next month
  const [selectedMonthName, setSelectedMonthName] = useState('Sep');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [sourceMonth, setSourceMonth] = useState(currentMonth);
  const [importTenantsAndRooms, setImportTenantsAndRooms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMonthKey = `${selectedMonthName} ${selectedYear}`;
    onMonthAdded(newMonthKey, sourceMonth, importTenantsAndRooms);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Billing Month"
      subtitle="Create a fresh billing and meter reading ledger for a new month"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Month and Year Selection */}
        <div>
          <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
            New Billing Period
          </label>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedMonthName}
              onChange={(e) => setSelectedMonthName(e.target.value)}
              className="rl-input font-medium"
            >
              {monthsNames.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rl-input font-medium"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </div>
        </div>

        {/* Source Month to Copy From */}
        <div>
          <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
            Reference Previous Month
          </label>
          <select
            value={sourceMonth}
            onChange={(e) => setSourceMonth(e.target.value)}
            className="rl-input"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Import Checkbox Card */}
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={importTenantsAndRooms}
              onChange={(e) => setImportTenantsAndRooms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#2563EB] border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-semibold text-[#0F172A] block">
                Import tenants and room info from {sourceMonth}
              </span>
              <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                Carries over all assigned tenants, monthly rent rates, and automatically rolls over previous meter readings into the baseline for {selectedMonthName} {selectedYear}. Payments start fresh with zero balance collected.
              </p>
            </div>
          </label>
        </div>

        {/* Features preview badge */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-2 rounded-lg">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Meters auto-rolled over</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-2 rounded-lg">
            <CalendarPlus className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span>Clean blank records</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF2F7]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Create Month Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
