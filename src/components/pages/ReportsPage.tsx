import React, { useState } from 'react';
import { Header } from '../layout/Header.tsx';
import { MetricCard } from '../common/MetricCard.tsx';
import { CollectionTrendChart } from '../charts/CollectionTrendChart.tsx';
import { RevenueBreakdownChart } from '../charts/RevenueBreakdownChart.tsx';
import { OutstandingBalanceChart } from '../charts/OutstandingBalanceChart.tsx';
import { ProfitLossDiagram } from '../charts/ProfitLossDiagram.tsx';
import { DashboardMetrics, MonthlyTrendData, PropertySettings, RevenueBreakdownData, YearlyReportData } from '../../api/types.ts';
import { ExportModal } from '../modals/ExportModal.tsx';
import { FileSpreadsheet, FileText, Calendar, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ReportsPageProps {
  metrics: DashboardMetrics;
  revenueBreakdown: RevenueBreakdownData;
  yearlyData?: YearlyReportData;
  monthlyTrends?: MonthlyTrendData[];
  settings?: PropertySettings;
  selectedMonth: string;
  availableMonths?: string[];
  onMonthChange: (month: string) => void;
  onOpenAddMonth?: () => void;
  onSaveOverhead?: (newOverhead: number) => void;
  onSaveUtilities?: (newUtilities?: number) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  metrics,
  revenueBreakdown,
  yearlyData,
  monthlyTrends,
  settings,
  selectedMonth,
  availableMonths,
  onMonthChange,
  onOpenAddMonth,
  onSaveOverhead,
  onSaveUtilities,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [exportModalFormat, setExportModalFormat] = useState<'csv' | 'pdf' | null>(null);

  // Extract year from selectedMonth (e.g. "2026" from "Aug 2026")
  const currentYear = selectedMonth.split(' ')[1] || '2026';

  // Yearly chart datasets from real yearlyData
  const yearlyTrendData = yearlyData?.monthlyBreakdown?.map((m) => ({
    month: m.monthName,
    billed: m.totalBilled,
    collected: m.totalCollected,
    outstanding: Math.max(0, m.totalBilled - m.totalCollected),
  })) || [];

  const yearlyBalanceData = yearlyData?.monthlyBreakdown?.map((m) => ({
    month: m.monthName,
    outstanding: Math.max(0, m.totalBilled - m.totalCollected),
  })) || [];

  // Monthly chart datasets from actual data
  const monthlyTrendData = monthlyTrends && monthlyTrends.length > 0
    ? monthlyTrends.map((m) => ({
        month: m.month,
        billed: m.billed,
        collected: m.collected,
        outstanding: m.outstanding,
      }))
    : [
        {
          month: selectedMonth.split(' ')[0] || 'Aug',
          billed: metrics.totalBilled || 0,
          collected: metrics.totalCollected || 0,
          outstanding: metrics.outstanding || 0,
        },
      ];

  const monthlyBalanceData = monthlyTrends && monthlyTrends.length > 0
    ? monthlyTrends.map((m) => ({
        month: m.month,
        outstanding: m.outstanding,
      }))
    : [
        {
          month: selectedMonth.split(' ')[0] || 'Aug',
          outstanding: metrics.outstanding || 0,
        },
      ];

  const isYearly = viewMode === 'yearly';

  return (
    <div className="space-y-6">
      <Header
        title="Reports & Analytics"
        subtitle={
          isYearly
            ? `Annual comprehensive financial performance — Year ${yearlyData?.year || currentYear}`
            : `Monthly financial summary & performance — ${selectedMonth}`
        }
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        onMonthChange={onMonthChange}
        onOpenAddMonth={onOpenAddMonth}
        showMonthSelector={!isYearly}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Monthly / Yearly View Mode Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('monthly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  !isYearly
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Monthly View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('yearly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  isYearly
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Yearly View ({currentYear})</span>
              </button>
            </div>

            <button
              id="reports-btn-export-csv"
              type="button"
              onClick={() => setExportModalFormat('csv')}
              className="btn-outline flex items-center gap-1.5 text-xs font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#718096]" />
              <span>Export CSV</span>
            </button>
            <button
              id="reports-btn-export-pdf"
              type="button"
              onClick={() => setExportModalFormat('pdf')}
              className="btn-outline flex items-center gap-1.5 text-xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5 text-[#718096]" />
              <span>Export PDF</span>
            </button>
          </div>
        }
      />

      {/* 4 Financial Metric Summary Cards */}
      {(() => {
        const currentBilled = isYearly ? (yearlyData?.annualBilled ?? 0) : (metrics.totalBilled ?? 0);
        const currentCollected = isYearly ? (yearlyData?.annualCollected ?? 0) : (metrics.totalCollected ?? 0);
        const billsPaidPct = currentBilled > 0 ? (currentCollected / currentBilled) * 100 : 0;

        let billsPaidColor = 'text-[#E11D48]';
        let billsPaidType: 'collected' | 'danger' | 'warning' = 'danger';
        let billsPaidBadgeType: 'success' | 'danger' | 'warning' = 'danger';
        let billsPaidBadgeText = 'Unpaid';

        if (currentBilled > 0 && currentCollected >= currentBilled) {
          billsPaidColor = 'text-[#059669]';
          billsPaidType = 'collected';
          billsPaidBadgeType = 'success';
          billsPaidBadgeText = isYearly ? 'Annual Cleared' : 'Cleared';
        } else if (currentBilled > 0 && billsPaidPct >= 50) {
          billsPaidColor = 'text-[#D97706]';
          billsPaidType = 'warning';
          billsPaidBadgeType = 'warning';
          billsPaidBadgeText = `${Math.round(billsPaidPct)}% Paid`;
        } else {
          billsPaidColor = 'text-[#E11D48]';
          billsPaidType = 'danger';
          billsPaidBadgeType = 'danger';
          billsPaidBadgeText = currentCollected > 0 ? `${Math.round(billsPaidPct)}% Paid` : 'Unpaid';
        }

        const currentRentBilled = isYearly ? (yearlyData?.annualRentBilled ?? 0) : (metrics.totalRentBilled ?? 0);
        const currentRentPaid = isYearly ? (yearlyData?.annualRentPaid ?? 0) : (metrics.totalRentPaid ?? 0);
        const rentPaidPct = currentRentBilled > 0 ? (currentRentPaid / currentRentBilled) * 100 : 0;

        let rentPaidColor = 'text-[#E11D48]';
        let rentPaidType: 'collected' | 'danger' | 'warning' = 'danger';
        let rentPaidBadgeType: 'success' | 'danger' | 'warning' = 'danger';
        let rentPaidBadgeText = 'Unpaid';

        if (currentRentBilled > 0 && currentRentPaid >= currentRentBilled) {
          rentPaidColor = 'text-[#059669]';
          rentPaidType = 'collected';
          rentPaidBadgeType = 'success';
          rentPaidBadgeText = 'Rent Collected';
        } else if (currentRentBilled > 0 && rentPaidPct >= 50) {
          rentPaidColor = 'text-[#D97706]';
          rentPaidType = 'warning';
          rentPaidBadgeType = 'warning';
          rentPaidBadgeText = `${Math.round(rentPaidPct)}% Paid`;
        } else {
          rentPaidColor = 'text-[#E11D48]';
          rentPaidType = 'danger';
          rentPaidBadgeType = 'danger';
          rentPaidBadgeText = currentRentPaid > 0 ? `${Math.round(rentPaidPct)}% Paid` : 'Unpaid';
        }

        return (
          <div className="metrics-grid-4">
            <MetricCard
              id="report-metric-billed"
              title="TOTAL BILLS"
              value={`₱${currentBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle={isYearly ? 'Full year invoiced' : `${metrics.occupiedRoomsCount ?? 0} units billed`}
              secondaryValue={`${isYearly ? (yearlyData?.averageCollectionRate ?? 0) : (metrics.collectionRate ?? 0)}% rate`}
              type="billed"
              badgeText={isYearly ? 'Annual Total' : 'Billed'}
              badgeType="neutral"
            />

            <MetricCard
              id="report-metric-collected"
              title="TOTAL BILLS PAID"
              value={`₱${currentCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle={
                isYearly
                  ? `Due: ₱${Math.max(0, (yearlyData?.annualBilled || 0) - (yearlyData?.annualCollected || 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
                  : `Due: ₱${(metrics.outstanding ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
              }
              secondaryValue={isYearly ? 'Cleared payments' : `${metrics.roomsWithBalance ?? 0} balances`}
              type={billsPaidType}
              valueColor={billsPaidColor}
              badgeText={billsPaidBadgeText}
              badgeType={billsPaidBadgeType}
            />

            <MetricCard
              id="report-metric-rent"
              title="TOTAL RENT"
              value={`₱${currentRentBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle={isYearly ? 'Scheduled annual base rent' : 'Scheduled base rent'}
              secondaryValue={isYearly ? '12 months' : `${metrics.occupiedRoomsCount ?? 0} units`}
              type="rent"
              badgeText="Scheduled"
              badgeType="info"
            />

            <MetricCard
              id="report-metric-rent-paid"
              title="TOTAL RENT PAID"
              value={`₱${currentRentPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle={
                isYearly
                  ? `Bal: ₱${Math.max(0, (yearlyData?.annualRentBilled || 0) - (yearlyData?.annualRentPaid || 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
                  : `Bal: ₱${Math.max(0, (metrics.totalRentBilled ?? 0) - (metrics.totalRentPaid ?? 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
              }
              secondaryValue={
                isYearly
                  ? `${(yearlyData?.annualRentBilled || 0) > 0 ? Math.min(100, Math.round(((yearlyData?.annualRentPaid || 0) / (yearlyData?.annualRentBilled || 1)) * 100)) : 0}% paid`
                  : `${(metrics.totalRentBilled ?? 0) > 0 ? Math.min(100, Math.round(((metrics.totalRentPaid ?? 0) / (metrics.totalRentBilled || 1)) * 100)) : 0}% paid`
              }
              type={rentPaidType}
              valueColor={rentPaidColor}
              badgeText={rentPaidBadgeText}
              badgeType={rentPaidBadgeType}
            />
          </div>
        );
      })()}

      {/* Profit & Loss Interactive Diagram Visualization with Formula & Adjustable Overhead */}
      <ProfitLossDiagram
        totalOccupancyRevenue={
          isYearly
            ? (yearlyData?.annualOccupancyRevenue ?? (yearlyData?.annualBilled || 0))
            : (metrics.totalOccupancyRevenue ?? metrics.totalBilled)
        }
        electricityExpense={
          isYearly
            ? (yearlyData?.annualElectricity ? Math.round(yearlyData.annualElectricity / 12) : 0)
            : (revenueBreakdown?.electricity ?? (metrics.totalUtilitiesBilled > 0 ? Math.round(metrics.totalUtilitiesBilled * 0.72) : 0))
        }
        waterExpense={
          isYearly
            ? (yearlyData?.annualWaterAndPump ? Math.round((yearlyData.annualWaterAndPump * 0.75) / 12) : 0)
            : (revenueBreakdown?.water ?? (metrics.totalUtilitiesBilled > 0 ? Math.round(metrics.totalUtilitiesBilled * 0.28) : 0))
        }
        waterPumpExpense={metrics.waterPumpFeeTotal ?? 0}
        commonAreaMaintenance={metrics.commonAreaMaintenance ?? 0}
        initialOverhead={settings?.fixedPropertyOverhead ?? metrics.fixedPropertyOverhead ?? 0}
        initialCustomUtilities={settings?.customUtilitiesExpense}
        isYearly={isYearly}
        timeLabel={isYearly ? `Year ${yearlyData?.year || currentYear}` : selectedMonth}
        onSaveOverhead={onSaveOverhead}
        onSaveUtilities={onSaveUtilities}
      />

      {/* Charts Grid: Monthly/Yearly Collection Trend & Revenue Breakdown */}
      <div className="reports-charts-grid">
        {/* Collection Trend Chart */}
        <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              {isYearly ? `Annual Collection Trend (${currentYear})` : 'Monthly Collection Trend'}
            </h3>
          </div>
          <div className="chart-card-body">
            <CollectionTrendChart data={isYearly ? yearlyTrendData : monthlyTrendData} />
          </div>
        </div>

        {/* Revenue Breakdown Donut Chart */}
        <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              {isYearly ? `Annual Revenue Breakdown (${currentYear})` : 'Revenue Breakdown'}
            </h3>
          </div>
          <div className="chart-card-body">
            <RevenueBreakdownChart
              rent={isYearly ? (yearlyData?.annualRentBilled || 0) : revenueBreakdown.rent}
              electricity={isYearly ? (yearlyData?.annualElectricity || 0) : revenueBreakdown.electricity}
              waterAndPump={
                isYearly
                  ? (yearlyData?.annualWaterAndPump || 0)
                  : (revenueBreakdown.waterAndPump ?? (revenueBreakdown.water + revenueBreakdown.waterPump))
              }
            />
          </div>
        </div>
      </div>

      {/* Outstanding Balance Trend Bar Chart */}
      <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] p-6">
        <div className="mb-3">
          <h3 className="chart-card-title">
            {isYearly ? `12-Month Outstanding Balance Trend (${currentYear})` : 'Outstanding Balance Trend'}
          </h3>
        </div>
        <OutstandingBalanceChart data={isYearly ? yearlyBalanceData : monthlyBalanceData} />
      </div>

      {/* When in Yearly Mode: 12-Month Detailed Performance Table */}
      {isYearly && yearlyData?.monthlyBreakdown && (
        <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden">
          <div className="p-5 border-b border-[#EDF2F7] flex items-center justify-between">
            <div>
              <h3 className="chart-card-title text-base font-bold text-[#0F172A]">
                12-Month Financial Performance Table ({currentYear})
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Full breakdown of rent, utility contributions, operating expenses, and net profit per month
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4 text-right">Invoiced (₱)</th>
                  <th className="py-3 px-4 text-right">Collected (₱)</th>
                  <th className="py-3 px-4 text-right">Rent Paid (₱)</th>
                  <th className="py-3 px-4 text-right">Electricity (₱)</th>
                  <th className="py-3 px-4 text-right">Water + Pump (₱)</th>
                  <th className="py-3 px-4 text-right">OpEx (₱)</th>
                  <th className="py-3 px-4 text-right">Net Profit (₱)</th>
                  <th className="py-3 px-4 text-center">Rate</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {yearlyData.monthlyBreakdown.map((m) => (
                  <tr
                    key={m.monthKey}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                      <div className="flex items-center gap-2">
                        <span>{m.monthKey}</span>
                        {m.hasData && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-50 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {m.occupiedUnits} / {m.totalUnits}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-[#0F172A]">
                      ₱{m.totalBilled.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#059669]">
                      ₱{m.totalCollected.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#64748B]">
                      ₱{m.rentPaid.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#64748B]">
                      ₱{m.electricityBilled.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#64748B]">
                      ₱{m.waterAndPumpBilled.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#64748B]">
                      ₱{m.operatingExpense.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={m.isNetProfit ? 'text-[#059669]' : 'text-[#E11D48]'}>
                        ₱{(m.isNetProfit ? m.netProfit : -m.netLoss).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {m.collectionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          onMonthChange(m.monthKey);
                          setViewMode('monthly');
                        }}
                        className="btn-outline py-1 px-2.5 text-xs text-[#2563EB] hover:bg-blue-50 inline-flex items-center gap-1 font-semibold"
                      >
                        <span>View Month</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportModalFormat && (
        <ExportModal
          isOpen={true}
          onClose={() => setExportModalFormat(null)}
          defaultFormat={exportModalFormat}
          month={isYearly ? `Year ${currentYear}` : selectedMonth}
        />
      )}
    </div>
  );
};

