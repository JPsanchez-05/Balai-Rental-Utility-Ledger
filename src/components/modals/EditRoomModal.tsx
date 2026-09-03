import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Room, RoomStatus } from '../../api/types.ts';
import { Building2, Save } from 'lucide-react';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onRoomUpdated: (
    roomId: string,
    updates: {
      roomNumber: string;
      floor: number;
      monthlyRent: number;
      status?: RoomStatus;
    }
  ) => void;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  isOpen,
  onClose,
  room,
  onRoomUpdated,
}) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [monthlyRent, setMonthlyRent] = useState<number>(7000);
  const [status, setStatus] = useState<RoomStatus>('Available');

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
      setFloor(room.floor || 1);
      setMonthlyRent(room.monthlyRent || 0);
      setStatus(room.status);
    }
  }, [room]);

  if (!room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRoomUpdated(room.id, {
      roomNumber: roomNumber.trim() || room.roomNumber,
      floor: Number(floor) || 1,
      monthlyRent: Number(monthlyRent) || 0,
      status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Room: ${room.roomNumber}`}
      subtitle="Update rental rate, floor level, and room information"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Name & Floor Selection Dropdown */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Room Number / Name
            </label>
            <input
              id="edit-room-number-input"
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. Rm 1 or Room 101"
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
                id="edit-room-floor-select"
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

        {/* Monthly Rent */}
        <div>
          <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
            Monthly Base Rent (₱)
          </label>
          <input
            id="edit-room-rent-input"
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="rl-input font-bold text-base text-[#0F172A]"
            min="0"
            step="100"
            required
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Setting the standard monthly rental rate for this unit.
          </p>
        </div>

        {/* Occupancy Status info */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569]">Current Status</span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                room.status === 'Occupied'
                  ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                  : 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
              }`}
            >
              {room.status}
            </span>
          </div>
          {room.tenant ? (
            <p className="text-xs text-[#64748B] mt-1.5">
              Assigned to <strong>{room.tenant.name}</strong> ({room.tenant.phone})
            </p>
          ) : (
            <p className="text-xs text-[#94A3B8] mt-1.5">
              Currently vacant. You can assign a tenant from the Rooms table.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
          <button
            id="edit-room-cancel-btn"
            type="button"
            onClick={onClose}
            className="btn-outline text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            id="edit-room-submit-btn"
            type="submit"
            className="btn-primary text-xs font-semibold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
