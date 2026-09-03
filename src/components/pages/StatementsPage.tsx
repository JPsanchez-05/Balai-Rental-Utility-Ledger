import React, { useState } from 'react';
import { Header } from '../layout/Header.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { StatementItem } from '../../api/types.ts';
import { Search, ArrowRight } from 'lucide-react';

interface StatementsPageProps {
  statements: StatementItem[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onViewStatement: (statement: StatementItem) => void;
}

export const StatementsPage: React.FC<StatementsPageProps> = ({
  statements,
  selectedMonth,
  onMonthChange,
  onViewStatement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStatements = statements.filter((s) => {
    return (
      s.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tenantEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Header
        title="Statements"
        subtitle={`Tenant billing statements — ${selectedMonth}`}
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
      />

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search room or tenant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rl-input !pl-11"
        />
      </div>

      {/* Statements Table Card */}
      <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="rl-table">
            <thead>
              <tr>
                <th>ROOM</th>
                <th>TENANT</th>
                <th>BILLED</th>
                <th>PAID</th>
                <th>BALANCE</th>
                <th>STATUS</th>
                <th>DUE DATE</th>
                <th className="text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatements.map((stmt) => (
                <tr key={stmt.id} className="hover:bg-[#F8FAFC] transition-colors">
                  {/* Room */}
                  <td>
                    <div className="room-number-cell font-bold text-[#0F172A]">{stmt.roomNumber}</div>
                    <div className="room-sub-info text-xs text-[#64748B]">
                      Floor {stmt.floor}
                    </div>
                  </td>

                  {/* Tenant */}
                  <td>
                    <div className="tenant-name font-semibold text-[#1E293B]">{stmt.tenantName}</div>
                    <div className="tenant-contact text-xs text-[#64748B]">{stmt.tenantEmail}</div>
                  </td>

                  {/* Billed */}
                  <td className="font-semibold text-[#1E293B]">
                    ₱{stmt.totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Paid */}
                  <td className="font-semibold text-[#059669]">
                    ₱{stmt.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Balance */}
                  <td className="font-bold text-[#E11D48]">
                    ₱{stmt.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge status={stmt.status} />
                  </td>

                  {/* Due Date */}
                  <td className="text-xs font-medium text-[#4A5568]">
                    {stmt.dueDate || '7th of month'}
                  </td>

                  {/* Action */}
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => onViewStatement(stmt)}
                      className="view-action-link inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] px-2 py-1 rounded hover:bg-[#EFF6FF] transition-colors"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStatements.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#94A3B8]">
                    No statements found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
