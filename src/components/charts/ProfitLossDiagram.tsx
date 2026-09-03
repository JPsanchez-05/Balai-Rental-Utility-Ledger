import React, { useState, useEffect } from 'react';
import { Sliders, Check, RefreshCw, ChevronDown, ChevronUp, HelpCircle, Edit3 } from 'lucide-react';

export interface ProfitLossDiagramProps {
  totalOccupancyRevenue: number;
  electricityExpense?: number;
  waterExpense?: number;
  waterPumpExpense?: number;
  commonAreaMaintenance?: number;
  initialOverhead?: number;
  isYearly?: boolean;
  timeLabel?: string;
  onSaveOverhead?: (newOverhead: number) => void;
  onSaveUtilities?: (newUtilities: number) => void;
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
  onSaveUtilities,
}) => {
  const calculatedUtilities =
    (electricityExpense || 0) +
    (waterExpense || 0) +
    (waterPumpExpense || 0) +
    (commonAreaMaintenance || 0);

  const [fixedOverhead, setFixedOverhead] = useState<number>(initialOverhead);
  const [customUtilities, setCustomUtilities] = useState<number>(calculatedUtilities);
  const [isEditingUtilities, setIsEditingUtilities] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setFixedOverhead(initialOverhead);
  }, [initialOverhead]);

  useEffect(() => {
    if (!isEditingUtilities) {
      setCustomUtilities(calculatedUtilities);
    }
  }, [calculatedUtilities, isEditingUtilities]);

  const scale = isYearly ? 12 : 1;
  const currentOverhead = fixedOverhead * scale;
  const currentUtilities = customUtilities * scale;

  const totalOperatingExpenses = currentOverhead + currentUtilities;
  const revenue = totalOccupancyRevenue;
  const netSurplusDeficit = revenue - totalOperatingExpenses;
  const isSurplus = netSurplusDeficit >= 0;
  const profitMargin = revenue > 0 ? Math.round((netSurplusDeficit / revenue) * 100) : 0;

  const totalBarDenominator = Math.max(1, totalOperatingExpenses);
  const overheadPct = Math.min(100, Math.max(5, (currentOverhead / totalBarDenominator) * 100));
  const utilitiesPct = 100 - overheadPct;

  const handleSave = () => {
    if (onSaveOverhead) {
      onSaveOverhead(fixedOverhead);
    }
    if (onSaveUtilities && isEditingUtilities) {
      onSaveUtilities(customUtilities);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const resetDefaults = () => {
    setFixedOverhead(initialOverhead);
    setCustomUtilities(calculatedUtilities);
    setIsEditingUtilities(false);
  };

  return (
    <div
      id="profit-loss-diagram-card"
      className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6"
    >
      {/* Card Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Profit & Loss Summary</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {timeLabel || (isYearly ? 'Full Year' : 'Current Month')}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Operating expenses breakdown, revenue tracking, and net surplus analysis
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(fixedOverhead !== initialOverhead || customUtilities !== calculatedUtilities) && (
            <button
              type="button"
              onClick={resetDefaults}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Top 3 High-Contrast Financial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-5 rounded-xl bg-slate-50/80 border border-slate-200/60 items-center">
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
            ₱{totalOperatingExpenses.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {isYearly ? 'Total Annual OpEx' : 'Total Monthly OpEx'}
          </div>
        </div>

        <div className="sm:border-l sm:border-slate-200 sm:pl-6 space-y-1">
          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${
              isSurplus ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isSurplus ? '₱' : '-₱'}
            {Math.abs(netSurplusDeficit).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {isYearly ? 'Net Annual Surplus / Deficit' : 'Net Monthly Surplus / Deficit'}
          </div>
        </div>

        <div className="sm:border-l sm:border-slate-200 sm:pl-6 space-y-1">
          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${
              isSurplus ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {profitMargin}%
          </div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Net Profit Margin
          </div>
        </div>
      </div>

      {/* Section 1: Rental Operating Expenses Breakdown */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 tracking-wide">
            Rental Operating Expenses Breakdown
          </h4>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            ₱{totalOperatingExpenses.toLocaleString()} total
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-200">
          <div
            style={{ width: `${overheadPct}%` }}
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
            title={`Fixed Overhead: ₱${currentOverhead.toLocaleString()}`}
          />
          <div
            style={{ width: `${utilitiesPct}%` }}
            className="h-full bg-teal-600 rounded-r-full transition-all duration-300"
            title={`Utilities & Maintenance: ₱${currentUtilities.toLocaleString()}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <div>
                <span className="text-slate-800 font-semibold block">Property Fixed Overhead</span>
                <span className="text-[11px] text-slate-500">Adjustable via slider below</span>
              </div>
            </div>
            <span className="font-mono font-bold text-slate-900 text-sm">
              ₱{currentOverhead.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
              <div>
                <span className="text-slate-800 font-semibold flex items-center gap-1">
                  Utilities & Maintenance
                  <button
                    type="button"
                    onClick={() => setIsEditingUtilities(!isEditingUtilities)}
                    className="text-emerald-700 hover:text-emerald-900 underline text-[10px] ml-1"
                  >
                    {isEditingUtilities ? 'Lock' : 'Edit'}
                  </button>
                </span>
                <span className="text-[11px] text-slate-500">
                  {isEditingUtilities ? 'Custom value override' : 'Auto from Meter Readings & Settings'}
                </span>
              </div>
            </div>
            {isEditingUtilities ? (
              <input
                type="number"
                value={customUtilities}
                onChange={(e) => setCustomUtilities(Number(e.target.value))}
                className="w-28 px-2 py-1 text-right font-mono text-sm border border-emerald-500 rounded bg-white shadow-xs focus:outline-hidden"
              />
            ) : (
              <span className="font-mono font-bold text-slate-900 text-sm">
                ₱{currentUtilities.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Total Rental Income (Revenue - Strictly Rent) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            {isYearly ? 'Total Annual Rental Income (Revenue)' : 'Total Monthly Rental Income (Revenue)'}
          </label>
          <span className="text-[11px] text-emerald-700 font-medium">
            Strictly Rent (Utility bills are pass-through reimbursements)
          </span>
        </div>
        <div className="w-full bg-emerald-50/60 border border-emerald-200 rounded-xl px-4 py-3.5 text-emerald-950 font-mono font-bold text-lg sm:text-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-lg font-normal">₱</span>
            <span>{revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <span className="text-xs font-semibold text-emerald-800 font-sans bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            {timeLabel || (isYearly ? 'Full Year' : 'Current Month')}
          </span>
        </div>
      </div>

      {/* Section 3: Simple Adjustable Overhead Slider & Input */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Adjust Property Fixed Overhead (Monthly)</span>
          </h5>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">₱</span>
            <input
              type="number"
              min={0}
              max={100000}
              step={100}
              value={fixedOverhead}
              onChange={(e) => setFixedOverhead(Number(e.target.value))}
              className="w-28 px-2.5 py-1 text-right font-mono text-sm font-bold border border-emerald-300 rounded-lg bg-emerald-50 text-emerald-900 shadow-2xs focus:outline-hidden"
            />
            <span className="text-xs text-slate-500 font-medium">/ mo</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>₱0</span>
            <span>₱12,500</span>
            <span>₱25,000</span>
          </div>
          <input
            type="range"
            min={0}
            max={25000}
            step={500}
            value={fixedOverhead}
            onChange={(e) => setFixedOverhead(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>
      </div>

      {/* Formula Breakdown Accordion */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowFormula(!showFormula)}
          className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 py-1 transition-colors font-medium"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            Where do Utilities come from & Formula Methodology
          </span>
          {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFormula && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 text-slate-700 leading-relaxed">
            <div className="font-bold text-slate-900">Utility Bills & Revenue Rule:</div>
            <p>
              Revenue is strictly your <strong>Total Rent Billed</strong>. Utility bills are tenant pass-through reimbursements collected from tenants to pay utility providers ("bills are just for bills, there is no profit there"). Therefore, utility charges do not inflate rental revenue or landlord profit.
            </p>
            <div className="font-bold text-slate-900 pt-1">Net Profit / Loss Formula:</div>
            <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-emerald-800 font-semibold">
              Net Surplus = Total Rental Income (Rent) − Property Operating Expenses
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
