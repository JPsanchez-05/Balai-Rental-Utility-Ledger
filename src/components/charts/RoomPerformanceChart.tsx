import React from 'react';

interface RoomPerformanceData {
  room: string;
  billed: number;
  collected: number;
}

interface RoomPerformanceChartProps {
  data?: RoomPerformanceData[];
}

export const RoomPerformanceChart: React.FC<RoomPerformanceChartProps> = ({
  data = [
    { room: 'Rm 1', billed: 9854, collected: 8409 },
    { room: 'Rm 2', billed: 10493, collected: 6500 },
    { room: 'Rm 3', billed: 14201, collected: 12076 },
    { room: 'Rm 4', billed: 10451, collected: 0 },
    { room: 'Rm 5', billed: 15949, collected: 10000 },
    { room: 'Rm 6', billed: 10901, collected: 9117 },
    { room: 'Rm 7', billed: 16683, collected: 14047 },
  ],
}) => {
  const maxVal = 18000;
  const width = 800;
  const height = 200;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const yTicks = [
    { label: '₱18k', val: 18000 },
    { label: '₱9k', val: 9000 },
    { label: '₱5k', val: 5000 },
    { label: '₱0k', val: 0 },
  ];

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / maxVal) * chartHeight;
  };

  const groupWidth = chartWidth / data.length;
  const barWidth = Math.min(28, groupWidth * 0.35);

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full h-[200px]">
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

          {/* Bars */}
          {data.map((d, i) => {
            const groupCenterX = paddingLeft + i * groupWidth + groupWidth / 2;
            const billedX = groupCenterX - barWidth - 2;
            const collectedX = groupCenterX + 2;

            const billedY = getY(d.billed);
            const billedH = chartHeight - (billedY - paddingTop);

            const collectedY = getY(d.collected);
            const collectedH = chartHeight - (collectedY - paddingTop);

            return (
              <g key={i}>
                {/* Billed Bar (Blue) */}
                <rect
                  x={billedX}
                  y={billedY}
                  width={barWidth}
                  height={Math.max(0, billedH)}
                  fill="#3B82F6"
                  rx="3"
                >
                  <title>{`${d.room} Billed: ₱${d.billed.toLocaleString()}`}</title>
                </rect>

                {/* Collected Bar (Emerald) */}
                <rect
                  x={collectedX}
                  y={collectedY}
                  width={barWidth}
                  height={Math.max(0, collectedH)}
                  fill="#059669"
                  rx="3"
                >
                  <title>{`${d.room} Collected: ₱${d.collected.toLocaleString()}`}</title>
                </rect>

                {/* Room Label */}
                <text
                  x={groupCenterX}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-[#64748B] text-[11px] font-medium"
                >
                  {d.room}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#3B82F6] rounded-sm inline-block"></span>
          <span className="text-[#64748B]">Billed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#059669] rounded-sm inline-block"></span>
          <span className="text-[#64748B]">Collected</span>
        </div>
      </div>
    </div>
  );
};
