import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sliders, Sparkles, Check, RefreshCw } from 'lucide-react';

export interface ProfitLossDiagramProps {
  // Core financial values
  totalOccupancyRevenue: number;
  electricityExpense?: number;
  waterExpense?: number;
  waterPumpExpense?: number;
  commonAreaMaintenance?: number;
  initialOverhead?: number;
  isYearly?: boolean;
  timeLabel?: string; // e.g. "Aug 2026" or "Year 2026"
  onSaveOverhead?: (newOverhead: number) => void;
}

export const ProfitLossDiagram: React.FC<ProfitLossDiagramProps> = ({
  totalOccupancyRevenue,
  electricityExpense = 14532,
  waterExpense = 4500,
  waterPumpExpense = 1400,
  commonAreaMaintenance = 1500,
  initialOverhead = 4500,
  isYearly = false,
  timeLabel,
  onSaveOverhead,
}) => {
  // State for adjustable fixed property overhead
  const [fixedOverhead, setFixedOverhead] = useState<number>(initialOverhead);
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Synchronize when initialOverhead prop changes
  useEffect(() => {
    setFixedOverhead(initialOverhead);
  }, [initialOverhead]);

  // Adjust values if yearly mode
  const scale = isYearly ? 12 : 1;
  const currentOverhead = fixedOverhead * scale;
  
  // Total Utility Expenses = Electricity + Water + Pump Fee + Common Area Maintenance
  const utilitiesAndMaintenance =
    ((electricityExpense || 0) +
      (waterExpense || 0) +
      (waterPumpExpense || 0) +
      (commonAreaMaintenance || 0)) * scale;

  // Total Operating Expenses = Fixed Property Overhead + Total Utility Expenses
  const totalOperatingExpenses = currentOverhead + utilitiesAndMaintenance;

  // Revenue
  const revenue = totalOccupancyRevenue;

  // Net Surplus / Deficit (Net Profit/Loss) = Total Occupancy Revenue - Total Operating Expenses
  const netSurplusDeficit = revenue - totalOperatingExpenses;
  const isSurplus = netSurplusDeficit >= 0;

  // Net Profit Margin = (Net Surplus / Total Occupancy Revenue) * 100
  const profitMargin =
    revenue > 0 ? Math.round((netSurplusDeficit / revenue) * 100) : 0;

  // Percentage distribution for the segmented progress bar
  const totalBarDenominator = Math.max(1, totalOperatingExpenses);
  const overheadPct = Math.min(100, Math.max(5, (currentOverhead / totalBarDenominator) * 100));
  const utilitiesPct = 100 - overheadPct;

  const handleSave = () => {
    if (onSaveOverhead) {
      onSaveOverhead(fixedOverhead);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const resetOverhead = () => {
    setFixedOverhead(initialOverhead);
  };

  return (
    <div
      id="profit-loss-diagram-card"
      className="bg-[#0B0F19] text-white rounded-2xl border border-[#1E293B] shadow-xl overflow-hidden p-6 sm:p-7 space-y-6"
    >
      {/* Top 3 High-Contrast Financial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pb-6 border-b border-[#1E293B] items-center text-center sm:text-left">
        {/* 1. Total Operating Expenses */}
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            ₱{totalOperatingExpenses.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-[#94A3B8] font-medium tracking-wide">
            {isYearly ? 'Total Annual Operating Expenses' : 'Total Monthly Operating Expenses'}
          </div>
        </div>

        {/* Divider for desktop */}
        <div className="hidden sm:block border-l border-[#1E293B] h-12 self-center pl-6">
          <div className="space-y-1">
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
                isSurplus ? 'text-[#22C55E]' : 'text-[#EF4444]'
              }`}
            >
              {isSurplus ? '₱' : '-₱'}
              {Math.abs(netSurplusDeficit).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-[#94A3B8] font-medium tracking-wide">
              {isYearly ? 'Net Annual Surplus / Deficit' : 'Net Monthly Surplus / Deficit'}
            </div>
          </div>
        </div>

        {/* Mobile View for Net Surplus */}
        <div className="sm:hidden space-y-1">
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
              isSurplus ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {isSurplus ? '₱' : '-₱'}
            {Math.abs(netSurplusDeficit).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-[#94A3B8] font-medium tracking-wide">
            {isYearly ? 'Net Annual Surplus / Deficit' : 'Net Monthly Surplus / Deficit'}
          </div>
        </div>

        {/* 3. Net Profit Margin */}
        <div className="sm:border-l sm:border-[#1E293B] sm:h-12 sm:self-center sm:pl-6 space-y-1">
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
              isSurplus ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {profitMargin}%
          </div>
          <div className="text-xs text-[#94A3B8] font-medium tracking-wide">
            Net Profit Margin
          </div>
        </div>
      </div>

      {/* Section 1: Rental Operating Expenses with Segmented Bar */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#F1F5F9] tracking-wide">
            Rental Operating Expenses
          </h4>
          <span className="text-[11px] text-[#64748B] font-mono">
            ₱{totalOperatingExpenses.toLocaleString()} total
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="h-3.5 w-full bg-[#1E293B] rounded-full overflow-hidden flex p-0.5 gap-0.5">
          <div
            style={{ width: `${overheadPct}%` }}
            className="h-full bg-[#60A5FA] rounded-l-full transition-all duration-300 relative group"
            title={`Fixed Overhead: ₱${currentOverhead.toLocaleString()} (${Math.round(overheadPct)}%)`}
          />
          <div
            style={{ width: `${utilitiesPct}%` }}
            className="h-full bg-[#22C55E] rounded-r-full transition-all duration-300 relative group"
            title={`Utilities & Maintenance: ₱${utilitiesAndMaintenance.toLocaleString()} (${Math.round(utilitiesPct)}%)`}
          />
        </div>

        {/* Legend Rows */}
        <div className="space-y-2.5 pt-1 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#1E293B]/60">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] inline-block shadow-xs" />
              <span className="text-[#E2E8F0] font-medium">Property Fixed Overhead</span>
            </div>
            <span className="font-mono font-bold text-white text-sm">
              ₱{currentOverhead.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block shadow-xs" />
              <span className="text-[#E2E8F0] font-medium">Utilities & Maintenance</span>
            </div>
            <span className="font-mono font-bold text-white text-sm">
              ₱{utilitiesAndMaintenance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Total Monthly Rental Income (Revenue) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#CBD5E1] tracking-wide block">
            {isYearly ? 'Total Annual Rental Income (Revenue)' : 'Total Monthly Rental Income (Revenue)'}
          </label>
          <span className="text-[11px] text-[#64748B]">
            Occupancy + Utilities Invoiced
          </span>
        </div>
        <div className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-3 text-white font-mono font-bold text-base sm:text-lg flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-[#60A5FA] text-lg font-normal">₱</span>
            <span>{revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <span className="text-xs font-normal text-[#94A3B8] font-sans bg-[#1E293B] px-2.5 py-1 rounded-md">
            {timeLabel || (isYearly ? 'Full Year' : 'Current Month')}
          </span>
        </div>
      </div>

      {/* Section 3: Adjust monthly costs & rent (Interactive Overhead Slider) */}
      <div className="space-y-3.5 pt-2 border-t border-[#1E293B]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Adjust your monthly costs & rent</span>
            </h5>
            <span className="text-xs text-[#E2E8F0] font-medium mt-0.5 block">
              Property Fixed Overhead {isYearly && '(Monthly baseline)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {fixedOverhead !== initialOverhead && (
              <button
                type="button"
                onClick={resetOverhead}
                className="text-[11px] text-[#94A3B8] hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-[#1E293B] transition-colors"
                title="Reset to default overhead"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
            {onSaveOverhead && (
              <button
                type="button"
                onClick={handleSave}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Set as Default</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Slider + Display Value */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              id="overhead-slider"
              type="range"
              min="0"
              max="25000"
              step="250"
              value={fixedOverhead}
              onChange={(e) => setFixedOverhead(Number(e.target.value))}
              className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#60A5FA]"
            />
            {/* Quick Snap Presets */}
            <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-mono">
              <span>₱0</span>
              <button
                type="button"
                onClick={() => setFixedOverhead(2500)}
                className="hover:text-[#60A5FA] cursor-pointer"
              >
                ₱2.5k
              </button>
              <button
                type="button"
                onClick={() => setFixedOverhead(4500)}
                className="hover:text-[#60A5FA] cursor-pointer"
              >
                ₱4.5k (Std)
              </button>
              <button
                type="button"
                onClick={() => setFixedOverhead(10000)}
                className="hover:text-[#60A5FA] cursor-pointer"
              >
                ₱10k
              </button>
              <span>₱25k</span>
            </div>
          </div>

          {/* Direct Input / Value Pill */}
          <div className="relative w-28">
            <div className="bg-[#131B2E] border border-[#2563EB]/50 rounded-xl px-2.5 py-1.5 text-right font-mono font-bold text-white text-sm flex items-center justify-between">
              <span className="text-[#60A5FA] text-xs">₱</span>
              <input
                type="number"
                min="0"
                step="100"
                value={fixedOverhead}
                onChange={(e) => setFixedOverhead(Math.max(0, Number(e.target.value)))}
                className="w-20 bg-transparent text-right outline-none text-white font-mono font-bold text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accordion: Formula Reference & Calculation Breakdown */}
      <div className="pt-2 border-t border-[#1E293B]/70">
        <button
          type="button"
          onClick={() => setShowFormula(!showFormula)}
          className="w-full flex items-center justify-between text-xs text-[#94A3B8] hover:text-[#E2E8F0] py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span>Formula Breakdown & Methodology</span>
          </span>
          {showFormula ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showFormula && (
          <div className="mt-3 p-4 bg-[#070A12] border border-[#1E293B] rounded-xl text-xs space-y-3 font-serif text-[#CBD5E1] animate-fade-in">
            <div className="font-mono text-[13px] text-[#60A5FA] font-bold pb-2 border-b border-[#1E293B]">
              Net Profit/Loss = Total Occupancy Revenue − (Fixed Property Rent + Total Utility Expenses)
            </div>

            <ul className="space-y-2 text-xs font-sans text-[#94A3B8]">
              <li className="flex items-start gap-2">
                <span className="text-[#60A5FA] font-bold">•</span>
                <div>
                  <span className="text-white font-semibold">Total Occupancy Revenue: </span>
                  <span>(Occupied Rooms × Rent per Room) + Utility Surcharges Collected = </span>
                  <span className="text-[#22C55E] font-mono font-bold">₱{revenue.toLocaleString()}</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#60A5FA] font-bold">•</span>
                <div>
                  <span className="text-white font-semibold">Total Utility Expenses: </span>
                  <span>Electricity + Water + Pump Fee + Common Area Maintenance = </span>
                  <span className="text-[#60A5FA] font-mono font-bold">₱{utilitiesAndMaintenance.toLocaleString()}</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#60A5FA] font-bold">•</span>
                <div>
                  <span className="text-white font-semibold">Fixed Property Overhead: </span>
                  <span>Configurable overhead baseline = </span>
                  <span className="text-white font-mono font-bold">₱{currentOverhead.toLocaleString()}</span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
