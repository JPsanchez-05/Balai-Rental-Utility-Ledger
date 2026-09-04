import React from 'react';

export type MetricType =
  | 'billed'
  | 'collected'
  | 'outstanding'
  | 'occupancy'
  | 'rent'
  | 'profit'
  | 'loss'
  | 'warning'
  | 'danger'
  | 'pump';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  subtitle: string;
  type?: MetricType;
  valueColor?: string;
  secondaryValue?: string;
  badgeText?: string;
  badgeType?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  type = 'billed',
  valueColor,
  secondaryValue,
  badgeText,
  badgeType = 'neutral',
}) => {
  const getValueColor = () => {
    if (valueColor) return valueColor;
    switch (type) {
      case 'collected':
      case 'profit':
        return 'text-[#059669]'; // Rich emerald
      case 'outstanding':
      case 'loss':
      case 'danger':
        return 'text-[#E11D48]'; // Bold rose/red
      case 'warning':
        return 'text-[#D97706]'; // Amber / Warning
      case 'rent':
        return 'text-[#2563EB]'; // Royal blue
      case 'pump':
        return 'text-[#7C3AED]'; // Violet/purple
      case 'billed':
      case 'occupancy':
      default:
        return 'text-[#0F172A]'; // Deep slate
    }
  };

  const getBadgeClasses = () => {
    switch (badgeType) {
      case 'success':
        return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'danger':
        return 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]';
      case 'warning':
        return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
      case 'info':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      case 'neutral':
      default:
        return 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div id={id} className="rl-card metric-card bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="metric-title text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            {title}
          </div>
          {badgeText && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClasses()}`}>
              {badgeText}
            </span>
          )}
        </div>
        <div className={`metric-value text-2xl md:text-[26px] font-extrabold tracking-tight ${getValueColor()}`}>
          {value}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
        <span className="font-medium truncate">{subtitle}</span>
        {secondaryValue && (
          <span className="font-semibold text-[#334155] shrink-0">{secondaryValue}</span>
        )}
      </div>
    </div>
  );
};

