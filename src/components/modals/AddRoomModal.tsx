import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { RoomStatus } from '../../api/types.ts';
import { Building2 } from 'lucide-react';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoomNumber?: string;
  onRoomAdded: (roomData: {
    roomNumber: string;
    floor: number;
    monthlyRent: number;
    status: RoomStatus;
    electricityPrev: number;
    waterPrev: number;
  }) => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  defaultRoomNumber = 'Rm 9',
  onRoomAdded,
}) => {
  const [roomNumber, setRoomNumber] = useState(defaultRoomNumber);
  const [floor, setFloor] = useState(3);
  const [monthlyRent, setMonthlyRent] = useState(7500);
  const [electricityPrev, setElectricityPrev] = useState(0);
  const [waterPrev, setWaterPrev] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRoomAdded({
      roomNumber: roomNumber || defaultRoomNumber,
      floor: Number(floor) || 1,
      monthlyRent: Number(monthlyRent) || 7500,
      status: 'Available',
      electricityPrev: Number(electricityPrev) || 0,
      waterPrev: Number(waterPrev) || 0,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Room"
      subtitle="Register a new room unit in your property ledger"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Room Number / Name
            </label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. Rm 9 or Room 9"
              className="rl-input font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Floor Level
            </label>
            <div className="relative">
              <select
                id="add-room-floor-select"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="rl-input font-medium bg-white appearance-none cursor-pointer pr-8"
                required
              >
                <option value={1}>1st Floor</option>
                <option value={2}>2nd Floor</option>
                <option value={3}>3rd Floor</option>
                <option value={4}>4th Floor</option>
                <option value={5}>5th Floor</option>
                <option value={6}>6th Floor</option>
                <option value={7}>7th Floor</option>
                <option value={8}>8th Floor</option>
                <option value={9}>9th Floor</option>
                <option value={10}>10th Floor</option>
                <option value={0}>Ground Floor</option>
                <option value={-1}>Basement</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#64748B]">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
            Monthly Rent (₱)
          </label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="rl-input font-bold"
            min="500"
            step="100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Initial Elec Meter (kWh)
            </label>
            <input
              type="number"
              value={electricityPrev}
              onChange={(e) => setElectricityPrev(Number(e.target.value))}
              className="rl-input"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Initial Water Meter (m³)
            </label>
            <input
              type="number"
              value={waterPrev}
              onChange={(e) => setWaterPrev(Number(e.target.value))}
              className="rl-input"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF2F7]">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Room
          </button>
        </div>
      </form>
    </Modal>
  );
};
