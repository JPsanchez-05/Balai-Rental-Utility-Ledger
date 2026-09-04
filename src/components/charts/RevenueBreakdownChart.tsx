import React from 'react';

interface RevenueBreakdownProps {
  rent?: number;
  electricity?: number;
  water?: number;
  waterPump?: number;
  waterAndPump?: number;
}

export const RevenueBreakdownChart: React.FC<RevenueBreakdownProps> = ({
  rent = 0,
  electricity = 0,
  water = 0,
  waterPump = 0,
  waterAndPump,
}) => {
  const combinedWaterAndPump = waterAndPump !== undefined ? waterAndPump : (water + waterPump);
  const actualTotal = (rent || 0) + (electricity || 0) + (combinedWaterAndPump || 0);
  const total = Math.max(1, actualTotal);
  const rentPct = (rent || 0) / total;
  const elecPct = (electricity || 0) / total;
  const waterPumpPct = (combinedWaterAndPump || 0) / total;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const rentStroke = rentPct * circumference;
  const elecStroke = elecPct * circumference;
  const waterPumpStroke = waterPumpPct * circumference;

  const rentOffset = 0;
  const elecOffset = -rentStroke;
  const waterPumpOffset = -(rentStroke + elecStroke);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-3 px-2">
      {/* Donut Chart */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background neutral ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="14"
          />
          {/* Rent Segment (Primary Blue) */}
          {rent > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth="14"
              strokeDasharray={`${rentStroke} ${circumference}`}
              strokeDashoffset={rentOffset}
            />
          )}
          {/* Electricity Segment (Amber) */}
          {electricity > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="14"
              strokeDasharray={`${elecStroke} ${circumference}`}
              strokeDashoffset={elecOffset}
            />
          )}
          {/* Water + Pump Fee Segment (Teal/Cyan) */}
          {combinedWaterAndPump > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#06B6D4"
              strokeWidth="14"
              strokeDasharray={`${waterPumpStroke} ${circumference}`}
              strokeDashoffset={waterPumpOffset}
            />
          )}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Total</span>
          <span className="text-xs font-extrabold text-[#0F172A]">
            ₱{actualTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Breakdown Legend with Currency Values */}
      <div className="w-full max-w-xs flex flex-col gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0"></span>
            <span className="text-[#475569] font-medium">Rent</span>
          </div>
          <span className="font-bold text-[#0F172A] font-mono">
            ₱{(rent ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0"></span>
            <span className="text-[#475569] font-medium">Electricity</span>
          </div>
          <span className="font-bold text-[#0F172A] font-mono">
            ₱{(electricity ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shrink-0"></span>
            <span className="text-[#475569] font-medium">Water + Pump Fee</span>
          </div>
          <span className="font-bold text-[#0F172A] font-mono">
            ₱{(combinedWaterAndPump ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

