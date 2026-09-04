import React, { useState } from 'react';

interface TrendItem {
  month: string;
  billed: number;
  collected: number;
  outstanding: number;
}

interface CollectionTrendChartProps {
  data?: TrendItem[];
}

export const CollectionTrendChart: React.FC<CollectionTrendChartProps> = ({
  data = [],
}) => {
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jan', billed: 0, collected: 0, outstanding: 0 },
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(Math.min(0, chartData.length - 1));

  const rawMax = Math.max(
    ...chartData.map((d) => Math.max(d.billed || 0, d.collected || 0, d.outstanding || 0)),
    0
  );
  const roundedMax = rawMax > 0 ? Math.ceil(rawMax / 10000) * 10000 : 10000;

  const width = 650;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (chartData.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (chartData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / roundedMax) * chartHeight;
  };

  const billedPoints = chartData.map((d, i) => `${getX(i)},${getY(d.billed || 0)}`).join(' ');
  const collectedPoints = chartData.map((d, i) => `${getX(i)},${getY(d.collected || 0)}`).join(' ');
  const outstandingPoints = chartData.map((d, i) => `${getX(i)},${getY(d.outstanding || 0)}`).join(' ');

  const yTicks = [
    { label: `₱${(roundedMax / 1000).toFixed(0)}k`, val: roundedMax },
    { label: `₱${((roundedMax * 0.75) / 1000).toFixed(0)}k`, val: roundedMax * 0.75 },
    { label: `₱${((roundedMax * 0.5) / 1000).toFixed(0)}k`, val: roundedMax * 0.5 },
    { label: `₱${((roundedMax * 0.25) / 1000).toFixed(0)}k`, val: roundedMax * 0.25 },
    { label: '₱0k', val: 0 },
  ];

  const currentHovered = hoveredIdx !== null && chartData[hoveredIdx] ? chartData[hoveredIdx] : null;

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full h-[240px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Gridlines */}
          {yTicks.map((tick, i) => {
            const y = getY(tick.val);
            return (
              <g key={i}>
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#A0AEC0] text-[11px] font-medium"
                >
                  {tick.label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F0F4F8"
                  strokeWidth="1"
                  strokeDasharray={tick.val === 0 ? undefined : '3,3'}
                />
              </g>
            );
          })}

          {/* Month labels */}
          {chartData.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={height - 10}
              textAnchor="middle"
              className="fill-[#718096] text-[11px] font-medium"
            >
              {d.month}
            </text>
          ))}

          {/* Billed (Blue) */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={billedPoints}
          />

          {/* Collected (Emerald Green) */}
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={collectedPoints}
          />

          {/* Outstanding (Dashed Rose/Red) */}
          <polyline
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2"
            strokeDasharray="4,4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={outstandingPoints}
          />

          {/* Interactive Nodes */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIdx === i;

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={getY(d.billed || 0)}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <circle
                  cx={x}
                  cy={getY(d.collected || 0)}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke="#059669"
                  strokeWidth="2"
                />
                <circle
                  cx={x}
                  cy={getY(d.outstanding || 0)}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke="#F43F5E"
                  strokeWidth="2"
                />
                <rect
                  x={x - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onClick={() => setHoveredIdx(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {currentHovered && hoveredIdx !== null && (
          <div
            className="absolute z-20 bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xl pointer-events-none transition-all"
            style={{
              left: `${Math.min(75, Math.max(20, (getX(hoveredIdx) / width) * 100))}%`,
              top: '15%',
              transform: 'translateX(-50%)',
              minWidth: '175px',
            }}
          >
            <div className="font-bold text-[#0F172A] text-xs mb-1.5">
              {currentHovered.month}
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-[#2563EB] flex items-center justify-between">
                <span>Billed :</span>
                <span className="font-semibold">
                  ₱{(currentHovered.billed || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-[#059669] flex items-center justify-between">
                <span>Collected :</span>
                <span className="font-semibold">
                  ₱{(currentHovered.collected || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-[#E11D48] flex items-center justify-between">
                <span>Outstanding :</span>
                <span className="font-semibold">
                  ₱{(currentHovered.outstanding || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-[#3B82F6] rounded-full inline-block"></span>
          <span className="text-[#2563EB]">Billed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-[#059669] rounded-full inline-block"></span>
          <span className="text-[#059669]">Collected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-b border-dashed border-[#F43F5E] inline-block"></span>
          <span className="text-[#E11D48]">Outstanding</span>
        </div>
      </div>
    </div>
  );
};
