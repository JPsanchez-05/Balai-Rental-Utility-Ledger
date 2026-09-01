import React from 'react';
import { RoomStatus, PaymentStatus } from '../../api/types.ts';

interface StatusBadgeProps {
  status: RoomStatus | PaymentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyle = 'badge-inactive';

  switch (status) {
    case 'Occupied':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      break;
    case 'Available':
      badgeStyle = 'bg-blue-50 text-blue-700 border border-blue-200';
      break;
    case 'Inactive':
      badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200';
      break;
    case 'Paid':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      break;
    case 'Partial':
      badgeStyle = 'bg-amber-50 text-amber-700 border border-amber-200';
      break;
    case 'Unpaid':
      badgeStyle = 'bg-rose-50 text-rose-700 border border-rose-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}>
      {status}
    </span>
  );
};
