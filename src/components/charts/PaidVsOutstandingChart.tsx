import React from 'react';

interface PaidVsOutstandingChartProps {
  collected?: number;
  outstanding?: number;
}

export const PaidVsOutstandingChart: React.FC<PaidVsOutstandingChartProps> = ({
  collected = 60149,
  outstanding = 28383,
}) => {
  const total = collected + outstanding;
  const collectedPct = total > 0 ? collected / total : 0.68;
  
  // Circumference calculation for SVG circle stroke-dasharray
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const collectedStroke = collectedPct * circumference;
  const outstandingStroke = circumference - collectedStroke;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle (Outstanding - soft slate) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth="18"
          />
          {/* Foreground segment (Collected - Emerald) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#059669"
            strokeWidth="18"
            strokeDasharray={`${collectedStroke} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-[#059669]">
            {Math.round(collectedPct * 100)}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
            Collected
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
          <span className="text-[#1E293B] font-semibold">Collected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]"></span>
          <span className="text-[#64748B] font-medium">Outstanding</span>
        </div>
      </div>
    </div>
  );
};
