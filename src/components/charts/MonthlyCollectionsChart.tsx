import React, { useState } from 'react';

interface MonthlyCollectionsChartProps {
  data?: { month: string; billed: number; collected: number }[];
}

export const MonthlyCollectionsChart: React.FC<MonthlyCollectionsChartProps> = ({
  data = [],
}) => {
  const chartData = data && data.length > 0 ? data : [
    { month: 'Aug', billed: 0, collected: 0 },
  ];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const rawMax = Math.max(
    ...chartData.map((d) => Math.max(d.billed || 0, d.collected || 0)),
    0
  );
  const maxVal = rawMax > 0 ? Math.ceil(rawMax / 10000) * 10000 : 10000;
  const width = 600;
  const height = 220;
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
    return paddingTop + chartHeight - (val / maxVal) * chartHeight;
  };

  // Generate smooth SVG paths
  const billedPoints = chartData.map((d, i) => `${getX(i)},${getY(d.billed)}`).join(' ');
  const collectedPoints = chartData.map((d, i) => `${getX(i)},${getY(d.collected)}`).join(' ');

  const yTicks = [
    { label: `₱${(maxVal / 1000).toFixed(0)}k`, val: maxVal },
    { label: `₱${((maxVal * 0.75) / 1000).toFixed(0)}k`, val: maxVal * 0.75 },
    { label: `₱${((maxVal * 0.5) / 1000).toFixed(0)}k`, val: maxVal * 0.5 },
    { label: `₱${((maxVal * 0.25) / 1000).toFixed(0)}k`, val: maxVal * 0.25 },
    { label: '₱0k', val: 0 },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Horizontal Gridlines & Y-Axis Labels */}
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

          {/* X-Axis Month Labels */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="fill-[#718096] text-[11px] font-medium"
              >
                {d.month}
              </text>
            );
          })}

          {/* Billed Line (Blue) */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={billedPoints}
          />

          {/* Collected Line (Emerald Green) */}
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={collectedPoints}
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const yBilled = getY(d.billed);
            const yCollected = getY(d.collected);
            const isHovered = hoveredIdx === i;

            return (
              <g key={i}>
                {/* Billed Circle */}
                <circle
                  cx={x}
                  cy={yBilled}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />
                {/* Collected Circle */}
                <circle
                  cx={x}
                  cy={yCollected}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#059669"
                  strokeWidth="2.5"
                />
                {/* Invisible hover zone */}
                <rect
                  x={x - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute z-10 bg-white border border-[#E2E8F0] rounded-lg p-2.5 shadow-lg text-xs pointer-events-none transition-all"
            style={{
              left: `${(getX(hoveredIdx) / width) * 100}%`,
              top: '20%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-[#0F172A] mb-1">
              {data[hoveredIdx].month} 2026
            </div>
            <div className="flex items-center gap-2 text-[#2563EB]">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
              <span>Billed: ₱{data[hoveredIdx].billed.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span>Collected: ₱{data[hoveredIdx].collected.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs font-medium text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-[#3B82F6] rounded-full inline-block"></span>
          <span className="text-[#2563EB]">Billed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-[#059669] rounded-full inline-block"></span>
          <span className="text-[#059669]">Collected</span>
        </div>
      </div>
    </div>
  );
};
