import React from 'react';
import { MonthSelector } from '../common/MonthSelector.tsx';

interface HeaderProps {
  title: string;
  subtitle: string;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  showMonthSelector?: boolean;
  availableMonths?: string[];
  onOpenAddMonth?: () => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  selectedMonth = 'Aug 2026',
  onMonthChange,
  showMonthSelector = true,
  availableMonths,
  onOpenAddMonth,
  actions,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="page-title text-2xl md:text-[26px] font-bold text-[#0F172A] tracking-tight">
          {title}
        </h1>
        <p className="text-xs md:text-[13px] text-[#64748B] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {actions}
        {showMonthSelector && (
          <MonthSelector
            value={selectedMonth}
            onChange={(val) => onMonthChange && onMonthChange(val)}
            availableMonths={availableMonths}
            onOpenAddMonth={onOpenAddMonth}
          />
        )}
      </div>
    </header>
  );
};
