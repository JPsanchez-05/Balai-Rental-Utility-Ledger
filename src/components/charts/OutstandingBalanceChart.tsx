import React from 'react';

interface MonthlyBalance {
  month: string;
  outstanding: number;
}

interface OutstandingBalanceChartProps {
  data?: MonthlyBalance[];
}

export const OutstandingBalanceChart: React.FC<OutstandingBalanceChartProps> = ({
  data = [],
}) => {
  const chartData = data && data.length > 0 ? data : [
    { month: 'Aug', outstanding: 0 },
  ];

  const rawMax = Math.max(...chartData.map((d) => d.outstanding || 0), 0);
  const roundedMax = rawMax > 0 ? Math.ceil(rawMax / 10000) * 10000 : 10000;

  const width = 800;
  const height = 180;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const yTicks = [
    { label: `₱${(roundedMax / 1000).toFixed(0)}k`, val: roundedMax },
    { label: `₱${((roundedMax * 0.5) / 1000).toFixed(0)}k`, val: roundedMax * 0.5 },
    { label: `₱${((roundedMax * 0.25) / 1000).toFixed(0)}k`, val: roundedMax * 0.25 },
    { label: '₱0k', val: 0 },
  ];

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / roundedMax) * chartHeight;
  };

  const groupWidth = chartWidth / chartData.length;
  const barWidth = Math.min(44, Math.max(12, groupWidth * 0.6));

  return (
    <div className="w-full">
      <div className="relative w-full h-[180px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Y-Axis Gridlines */}
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

          {/* Rose Bars for Outstanding Balances */}
          {chartData.map((d, i) => {
            const groupCenterX = paddingLeft + i * groupWidth + groupWidth / 2;
            const barX = groupCenterX - barWidth / 2;
            const barY = getY(d.outstanding || 0);
            const barH = chartHeight - (barY - paddingTop);

            return (
              <g key={i}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={Math.max(0, barH)}
                  fill="#F43F5E"
                  rx="4"
                  className="transition-all hover:opacity-85"
                >
                  <title>{`${d.month} Outstanding: ₱${(d.outstanding || 0).toLocaleString()}`}</title>
                </rect>

                <text
                  x={groupCenterX}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-[#64748B] text-[11px] font-medium"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
