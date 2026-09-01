import React from 'react';
import {
  LayoutDashboard,
  Home,
  FileSpreadsheet,
  CreditCard,
  FileText,
  BarChart2,
  Settings,
  Building2,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'rooms'
  | 'meter-readings'
  | 'payments'
  | 'statements'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  propertyName?: string;
  propertyCity?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  propertyName = 'Dela Cruz Apartelle',
  propertyCity = 'Quezon City',
}) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'rooms', label: 'Rooms', icon: <Building2 className="w-4 h-4" /> },
    { id: 'meter-readings', label: 'Meter Readings', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'statements', label: 'Statements', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="app-sidebar select-none py-5">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
            <Home className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <h1 className="brand-title text-base font-bold text-white leading-tight">Rental Ledger</h1>
            <p className="text-[11px] text-[#94a3b8] font-medium">Property Manager</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectPage(item.id)}
                className={`sidebar-nav-item w-[calc(100%-24px)] text-left ${isActive ? 'active' : ''}`}
                type="button"
              >
                <span className="opacity-90">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Property Location Footer */}
      <div className="px-6 py-3 border-t border-slate-800/60">
        <div className="text-xs font-semibold text-[#e2e8f0]">{propertyName}</div>
        <div className="text-[11px] text-[#94a3b8]">{propertyCity}</div>
      </div>
    </aside>
  );
};
