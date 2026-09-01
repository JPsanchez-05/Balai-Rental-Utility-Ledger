import React, { useState } from 'react';
import { Header } from '../layout/Header.tsx';
import { MetricCard } from '../common/MetricCard.tsx';
import { Payment, PaymentMethod, PaymentType } from '../../api/types.ts';
import { Plus, Search } from 'lucide-react';

interface PaymentsPageProps {
  payments: Payment[];
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onOpenAddPayment: () => void;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  payments,
  totalBilled,
  totalCollected,
  outstanding,
  selectedMonth,
  onMonthChange,
  onOpenAddPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'All' | PaymentMethod>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | PaymentType>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === 'All' ? true : p.method === methodFilter;
    const matchesType = typeFilter === 'All' ? true : p.type === typeFilter;

    return matchesSearch && matchesMethod && matchesType;
  });

  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <Header
        title="Payments"
        subtitle={`Ledger for ${selectedMonth}`}
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        actions={
          <button
            id="payments-btn-add-payment"
            type="button"
            onClick={onOpenAddPayment}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment</span>
          </button>
        }
      />

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="TOTAL BILLED"
          value={`₱${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="All rooms billed"
          type="billed"
        />
        <MetricCard
          title="TOTAL COLLECTED"
          value={`₱${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Payments received"
          type="collected"
        />
        <MetricCard
          title="OUTSTANDING"
          value={`₱${outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Remaining unpaid balance"
          type="outstanding"
        />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search tenant, room, or reference..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="rl-input !pl-11"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Method Filters */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg">
            {(['All', 'Cash', 'GCash', 'Bank Transfer'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => {
                  setMethodFilter(method === 'All' ? 'All' : method);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  (methodFilter === 'All' && method === 'All') || methodFilter === method
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {method === 'All' ? 'All methods' : method}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg">
            {(['All', 'Rent', 'Electricity', 'Water + Pump Fee'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTypeFilter(type === 'All' ? 'All' : type as PaymentType);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  (typeFilter === 'All' && type === 'All') || typeFilter === type
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {type === 'All' ? 'All types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Table Card */}
      <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="rl-table">
            <thead>
              <tr>
                <th>ROOM</th>
                <th>TENANT</th>
                <th>DATE</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>METHOD</th>
                <th>REFERENCE</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-bold text-[#2B1744]">{payment.roomNumber}</td>
                  <td className="font-semibold text-[#2D3748]">{payment.tenantName}</td>
                  <td className="text-[#718096] text-xs">{payment.date}</td>
                  <td className="font-medium text-[#4A5568]">{payment.type}</td>
                  <td className="font-bold text-[#1E6B52]">
                    ₱{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-[#4A5568] text-xs font-medium">{payment.method}</td>
                  <td>
                    <span className="reference-text">
                      {payment.reference}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#A0AEC0]">
                    No payments found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="payments-pagination-footer flex items-center justify-between px-6 py-4 border-t border-[#EDF2F7] text-xs text-[#718096]">
          <div>
            {filteredPayments.length > 0
              ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
                  currentPage * pageSize,
                  filteredPayments.length
                )} of ${filteredPayments.length} payments`
              : '0 payments'}
          </div>

          <div className="pagination-controls flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="pagination-btn"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
