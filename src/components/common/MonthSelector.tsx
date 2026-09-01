import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
  availableMonths?: string[];
  onOpenAddMonth?: () => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  value,
  onChange,
  availableMonths,
  onOpenAddMonth,
}) => {
  const defaultMonths = [
    'Aug 2026',
    'Jul 2026',
    'Jun 2026',
    'May 2026',
    'Apr 2026',
    'Mar 2026',
    'Feb 2026',
    'Jan 2026',
  ];

  const months = availableMonths && availableMonths.length > 0 ? availableMonths : defaultMonths;
  // Ensure the current value is present in the list
  const displayMonths = months.includes(value) ? months : [value, ...months];

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative inline-block">
        <select
          id="month-selector-dropdown"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="month-select pr-8 appearance-none bg-white font-medium text-xs md:text-[13px] text-[#0F172A] border border-[#E2E8F0] rounded-lg py-2 px-3 focus:outline-none focus:border-[#2563eb] shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          {displayMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {onOpenAddMonth && (
        <button
          type="button"
          onClick={onOpenAddMonth}
          title="Add New Billing Month"
          className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-[#2563EB] border border-[#E2E8F0] hover:border-blue-300 text-xs font-semibold px-2.5 py-2 rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Month</span>
        </button>
      )}
    </div>
  );
};
