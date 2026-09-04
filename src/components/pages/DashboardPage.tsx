import React from 'react';
import { Header } from '../layout/Header.tsx';
import { MetricCard } from '../common/MetricCard.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { MonthlyCollectionsChart } from '../charts/MonthlyCollectionsChart.tsx';
import { PaidVsOutstandingChart } from '../charts/PaidVsOutstandingChart.tsx';
import { RoomPerformanceChart } from '../charts/RoomPerformanceChart.tsx';
import { ProfitLossDiagram } from '../charts/ProfitLossDiagram.tsx';
import { DashboardMetrics, MonthlyTrendData, PropertySettings, RevenueBreakdownData, Room } from '../../api/types.ts';
import { Plus, Clock, FileText, UserPlus } from 'lucide-react';
import { PageId } from '../layout/Sidebar.tsx';

interface DashboardPageProps {
  metrics: DashboardMetrics;
  rooms: Room[];
  settings?: PropertySettings;
  revenueBreakdown?: RevenueBreakdownData;
  monthlyTrends?: MonthlyTrendData[];
  selectedMonth: string;
  availableMonths?: string[];
  onMonthChange: (month: string) => void;
  onOpenAddMonth?: () => void;
  onNavigate: (page: PageId) => void;
  onOpenAddPayment: () => void;
  onOpenAddTenant: () => void;
  onSaveOverhead?: (newOverhead: number) => void;
  onSaveUtilities?: (newUtilities?: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  rooms,
  settings,
  revenueBreakdown,
  monthlyTrends,
  selectedMonth,
  availableMonths,
  onMonthChange,
  onOpenAddMonth,
  onNavigate,
  onOpenAddPayment,
  onOpenAddTenant,
  onSaveOverhead,
  onSaveUtilities,
}) => {
  const outstandingRooms = rooms.filter((r) => r.status === 'Occupied' && r.balance > 0);

  const roomPerformanceData = rooms
    .filter((r) => r.status === 'Occupied')
    .map((r) => ({
      room: r.roomNumber,
      billed: r.billed,
      collected: r.collected,
    }));

  // Dynamic Color Coding Logic:
  // Red when total bills paid < 50% of total bills (or 0); amber when 50%-99%; green only on full payment (100%).
  const totalBilled = metrics.totalBilled ?? 0;
  const totalCollected = metrics.totalCollected ?? 0;
  const billsPaidPct = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

  let billsPaidColor = 'text-[#E11D48]';
  let billsPaidType: 'collected' | 'danger' | 'warning' = 'danger';
  let billsPaidBadgeType: 'success' | 'danger' | 'warning' = 'danger';
  let billsPaidBadgeText = 'Unpaid';

  if (totalBilled > 0 && totalCollected >= totalBilled) {
    billsPaidColor = 'text-[#059669]';
    billsPaidType = 'collected';
    billsPaidBadgeType = 'success';
    billsPaidBadgeText = 'Cleared';
  } else if (totalBilled > 0 && billsPaidPct >= 50) {
    billsPaidColor = 'text-[#D97706]';
    billsPaidType = 'warning';
    billsPaidBadgeType = 'warning';
    billsPaidBadgeText = `${Math.round(billsPaidPct)}% Paid`;
  } else {
    billsPaidColor = 'text-[#E11D48]';
    billsPaidType = 'danger';
    billsPaidBadgeType = 'danger';
    billsPaidBadgeText = totalCollected > 0 ? `${Math.round(billsPaidPct)}% Paid` : 'Unpaid';
  }

  // Same color coding logic for Total Rent Paid:
  const rentBilled = metrics.totalRentBilled ?? 0;
  const rentPaid = metrics.totalRentPaid ?? 0;
  const rentPaidPct = rentBilled > 0 ? (rentPaid / rentBilled) * 100 : 0;

  let rentPaidColor = 'text-[#E11D48]';
  let rentPaidType: 'collected' | 'danger' | 'warning' = 'danger';
  let rentPaidBadgeType: 'success' | 'danger' | 'warning' = 'danger';
  let rentPaidBadgeText = 'Unpaid';

  if (rentBilled > 0 && rentPaid >= rentBilled) {
    rentPaidColor = 'text-[#059669]';
    rentPaidType = 'collected';
    rentPaidBadgeType = 'success';
    rentPaidBadgeText = 'Rent Collected';
  } else if (rentBilled > 0 && rentPaidPct >= 50) {
    rentPaidColor = 'text-[#D97706]';
    rentPaidType = 'warning';
    rentPaidBadgeType = 'warning';
    rentPaidBadgeText = `${Math.round(rentPaidPct)}% Paid`;
  } else {
    rentPaidColor = 'text-[#E11D48]';
    rentPaidType = 'danger';
    rentPaidBadgeType = 'danger';
    rentPaidBadgeText = rentPaid > 0 ? `${Math.round(rentPaidPct)}% Paid` : 'Unpaid';
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <Header
        title="Dashboard"
        subtitle={`Overview for ${selectedMonth}`}
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        onMonthChange={onMonthChange}
        onOpenAddMonth={onOpenAddMonth}
      />

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          id="dashboard-btn-add-payment"
          type="button"
          onClick={onOpenAddPayment}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment</span>
        </button>

        <button
          id="dashboard-btn-enter-meter"
          type="button"
          onClick={() => onNavigate('meter-readings')}
          className="btn-outline"
        >
          <Clock className="w-4 h-4 text-[#718096]" />
          <span>Enter Meter Readings</span>
        </button>

        <button
          id="dashboard-btn-view-statements"
          type="button"
          onClick={() => onNavigate('statements')}
          className="btn-outline"
        >
          <FileText className="w-4 h-4 text-[#718096]" />
          <span>View Statements</span>
        </button>

        <button
          id="dashboard-btn-add-tenant"
          type="button"
          onClick={onOpenAddTenant}
          className="btn-outline"
        >
          <UserPlus className="w-4 h-4 text-[#718096]" />
          <span>Add Tenant</span>
        </button>
      </div>

      {/* 4 Key Billing & Rent Financial Metric Cards */}
      <div className="metrics-grid-4">
        <MetricCard
          id="metric-total-billed"
          title="TOTAL BILLS"
          value={`₱${(metrics.totalBilled ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`${metrics.occupiedRoomsCount ?? 0} units billed`}
          secondaryValue={`${metrics.collectionRate ?? 0}% rate`}
          type="billed"
          badgeText="Invoiced"
          badgeType="neutral"
        />
        <MetricCard
          id="metric-total-collected"
          title="TOTAL BILLS PAID"
          value={`₱${(metrics.totalCollected ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`Due: ₱${(metrics.outstanding ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          secondaryValue={`${metrics.roomsWithBalance ?? 0} balances`}
          type={billsPaidType}
          valueColor={billsPaidColor}
          badgeText={billsPaidBadgeText}
          badgeType={billsPaidBadgeType}
        />
        <MetricCard
          id="metric-total-rent"
          title="TOTAL RENT"
          value={`₱${(metrics.totalRentBilled ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`Scheduled base rent`}
          secondaryValue={`${metrics.occupiedRoomsCount ?? 0} units`}
          type="rent"
          badgeText="Scheduled"
          badgeType="info"
        />
        <MetricCard
          id="metric-total-rent-paid"
          title="TOTAL RENT PAID"
          value={`₱${(metrics.totalRentPaid ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`Bal: ₱${Math.max(0, (metrics.totalRentBilled ?? 0) - (metrics.totalRentPaid ?? 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          secondaryValue={`${rentBilled > 0 ? Math.min(100, Math.round(rentPaidPct)) : 0}% paid`}
          type={rentPaidType}
          valueColor={rentPaidColor}
          badgeText={rentPaidBadgeText}
          badgeType={rentPaidBadgeType}
        />
      </div>

      {/* Profit & Loss Interactive Diagram Visualization with Formula & Adjustable Overhead */}
      <ProfitLossDiagram
        totalOccupancyRevenue={metrics.totalOccupancyRevenue ?? metrics.totalBilled}
        electricityExpense={revenueBreakdown?.electricity ?? (metrics.totalUtilitiesBilled > 0 ? Math.round(metrics.totalUtilitiesBilled * 0.72) : 0)}
        waterExpense={revenueBreakdown?.water ?? (metrics.totalUtilitiesBilled > 0 ? Math.round(metrics.totalUtilitiesBilled * 0.28) : 0)}
        waterPumpExpense={metrics.waterPumpFeeTotal ?? 0}
        commonAreaMaintenance={metrics.commonAreaMaintenance ?? 0}
        initialOverhead={settings?.fixedPropertyOverhead ?? metrics.fixedPropertyOverhead ?? 0}
        initialCustomUtilities={settings?.customUtilitiesExpense}
        timeLabel={selectedMonth}
        onSaveOverhead={onSaveOverhead}
        onSaveUtilities={onSaveUtilities}
      />

      {/* Row of 2 Charts: Monthly Collections & Paid vs Outstanding */}
      <div className="charts-row">
        {/* Monthly Collections Line Chart */}
        <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Monthly Collections</h3>
          </div>
          <div className="chart-card-body">
            <MonthlyCollectionsChart data={monthlyTrends} />
          </div>
        </div>

        {/* Paid vs Outstanding Donut Chart */}
        <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Paid vs Outstanding</h3>
          </div>
          <div className="chart-card-body">
            <PaidVsOutstandingChart
              collected={metrics.totalCollected}
              outstanding={metrics.outstanding}
            />
          </div>
        </div>
      </div>

      {/* Room Performance Bar Chart Card */}
      <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] room-performance-chart-card">
        <div className="mb-3">
          <h3 className="chart-card-title">Room Performance — {selectedMonth}</h3>
        </div>
        <RoomPerformanceChart data={roomPerformanceData} />
      </div>

      {/* Outstanding Tenants Table Card */}
      <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] outstanding-tenants-card">
        <div className="outstanding-tenants-header">
          <h3 className="chart-card-title">Outstanding Tenants</h3>
          <span className="outstanding-badge-count">
            {outstandingRooms.length} with balance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="rl-table">
            <thead>
              <tr>
                <th>ROOM</th>
                <th>TENANT</th>
                <th>BILLED</th>
                <th>COLLECTED</th>
                <th>BALANCE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {outstandingRooms.map((room) => (
                <tr key={room.id}>
                  <td className="font-bold text-[#2B1744]">{room.roomNumber}</td>
                  <td className="font-medium text-[#2D3748]">{room.tenant?.name || '—'}</td>
                  <td className="font-medium">
                    ₱{room.billed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-semibold text-[#1E6B52]">
                    ₱{room.collected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-bold text-[#D92D20]">
                    ₱{room.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <StatusBadge status={room.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
