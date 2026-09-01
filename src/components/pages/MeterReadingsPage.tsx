import React, { useState } from 'react';
import { Header } from '../layout/Header.tsx';
import { Room, PropertySettings } from '../../api/types.ts';
import { Zap, Droplets, Check } from 'lucide-react';

interface MeterReadingsPageProps {
  rooms: Room[];
  settings: PropertySettings;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onUpdateReading: (roomId: string, currentElec: number, currentWater: number) => void;
}

export const MeterReadingsPage: React.FC<MeterReadingsPageProps> = ({
  rooms,
  settings,
  selectedMonth,
  onMonthChange,
  onUpdateReading,
}) => {
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied');

  // Track local edits per room
  const [localReadings, setLocalReadings] = useState<{
    [roomId: string]: { currentElec: number; currentWater: number };
  }>(() => {
    const map: { [roomId: string]: { currentElec: number; currentWater: number } } = {};
    occupiedRooms.forEach((r) => {
      map[r.id] = {
        currentElec: r.meterReading.currentElectricity,
        currentWater: r.meterReading.currentWater,
      };
    });
    return map;
  });

  const [savedStatus, setSavedStatus] = useState<{ [roomId: string]: boolean }>({});

  const handleElecChange = (roomId: string, val: number) => {
    setLocalReadings((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        currentElec: val,
      },
    }));
    onUpdateReading(
      roomId,
      val,
      localReadings[roomId]?.currentWater || 0
    );
    triggerSavedIndicator(roomId);
  };

  const handleWaterChange = (roomId: string, val: number) => {
    setLocalReadings((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        currentWater: val,
      },
    }));
    onUpdateReading(
      roomId,
      localReadings[roomId]?.currentElec || 0,
      val
    );
    triggerSavedIndicator(roomId);
  };

  const triggerSavedIndicator = (roomId: string) => {
    setSavedStatus((prev) => ({ ...prev, [roomId]: true }));
    setTimeout(() => {
      setSavedStatus((prev) => ({ ...prev, [roomId]: false }));
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <Header
        title="Meter Readings"
        subtitle="Enter this month's electricity and water readings"
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
      />

      <div className="meter-readings-list space-y-4">
        {occupiedRooms.map((room) => {
          const reading = localReadings[room.id] || {
            currentElec: room.meterReading.currentElectricity,
            currentWater: room.meterReading.currentWater,
          };

          const elecUsage = Math.max(0, reading.currentElec - room.meterReading.previousElectricity);
          const elecCost = Math.round(elecUsage * settings.electricityRate);

          const waterUsage = Math.max(0, reading.currentWater - room.meterReading.previousWater);
          const waterCost = Math.round(waterUsage * settings.waterRate);

          const totalCharge = room.monthlyRent + elecCost + waterCost;

          return (
            <div
              key={room.id}
              className="rl-card meter-card bg-white rounded-xl border border-[#EDF2F7] p-6"
            >
              {/* Card Header */}
              <div className="meter-card-header flex items-center justify-between pb-4 border-b border-[#F7FAFC]">
                <div className="flex items-center gap-2">
                  <span className="meter-room-no font-bold text-base text-[#0F172A]">
                    {room.roomNumber}
                  </span>
                  <span className="text-[#94A3B8]">•</span>
                  <span className="text-xs font-semibold text-[#64748B]">
                    Floor {room.floor}
                  </span>
                  <span className="text-[#1E293B] font-semibold ml-2">
                    {room.tenant?.name}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-[#718096] uppercase tracking-wider font-semibold">
                    Total charge
                  </div>
                  <div className="text-xl font-black text-[#2B1744]">
                    ₱{totalCharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-[#A0AEC0]">
                    incl. ₱{room.monthlyRent.toLocaleString()} rent
                  </div>
                </div>
              </div>

              {/* Utility Grid */}
              <div className="meter-utilities-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {/* Electricity Block */}
                <div className="utility-block bg-[#FAFBFD] border border-[#EDF2F7] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="utility-header electricity flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 fill-[#D97706]" />
                      <span>ELECTRICITY</span>
                    </div>
                    {savedStatus[room.id] && (
                      <span className="flex items-center gap-1 text-[11px] text-[#137333] font-medium">
                        <Check className="w-3 h-3" /> Auto-saved
                      </span>
                    )}
                  </div>

                  <div className="reading-input-row flex items-center gap-3">
                    <div className="reading-prev-box">
                      <span className="text-[10px] text-[#A0AEC0] uppercase font-bold">
                        Previous
                      </span>
                      <span className="text-sm font-semibold text-[#4A5568]">
                        {room.meterReading.previousElectricity.toLocaleString()}
                      </span>
                    </div>

                    <span className="text-[#CBD5E0] font-bold">→</span>

                    <div className="flex-1">
                      <span className="text-[10px] text-[#A0AEC0] uppercase font-bold">
                        Current reading
                      </span>
                      <input
                        type="number"
                        step="any"
                        value={reading.currentElec}
                        onChange={(e) => handleElecChange(room.id, Number(e.target.value))}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm font-bold text-[#1A202C] focus:outline-none focus:border-[#482367] shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="utility-usage-calc mt-3 text-xs text-[#4A5568] font-medium">
                    Usage: <span className="font-bold text-[#1A202C]">{Number(elecUsage.toFixed(1))} kWh</span>
                    <span className="text-[#A0AEC0] mx-1">→</span>
                    <span className="font-bold text-[#2B1744]">
                      ₱{elecCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Water Block */}
                <div className="utility-block bg-[#FAFBFD] border border-[#EDF2F7] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="utility-header water flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                      <Droplets className="w-3.5 h-3.5 fill-[#2563EB]" />
                      <span>WATER</span>
                    </div>
                    {savedStatus[room.id] && (
                      <span className="flex items-center gap-1 text-[11px] text-[#137333] font-medium">
                        <Check className="w-3 h-3" /> Auto-saved
                      </span>
                    )}
                  </div>

                  <div className="reading-input-row flex items-center gap-3">
                    <div className="reading-prev-box">
                      <span className="text-[10px] text-[#A0AEC0] uppercase font-bold">
                        Previous
                      </span>
                      <span className="text-sm font-semibold text-[#4A5568]">
                        {room.meterReading.previousWater.toLocaleString()}
                      </span>
                    </div>

                    <span className="text-[#CBD5E0] font-bold">→</span>

                    <div className="flex-1">
                      <span className="text-[10px] text-[#A0AEC0] uppercase font-bold">
                        Current reading
                      </span>
                      <input
                        type="number"
                        step="any"
                        value={reading.currentWater}
                        onChange={(e) => handleWaterChange(room.id, Number(e.target.value))}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm font-bold text-[#1A202C] focus:outline-none focus:border-[#482367] shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="utility-usage-calc mt-3 text-xs text-[#4A5568] font-medium">
                    Usage: <span className="font-bold text-[#1A202C]">{Number(waterUsage.toFixed(2))} m³</span>
                    <span className="text-[#A0AEC0] mx-1">→</span>
                    <span className="font-bold text-[#2B1744]">
                      ₱{waterCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
