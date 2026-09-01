import React, { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Room } from '../../api/types.ts';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onTenantAdded: (roomId: string, tenantData: {
    name: string;
    phone: string;
    email: string;
    moveInDate?: string;
    depositAmount?: number;
  }) => void;
}

export const AddTenantModal: React.FC<AddTenantModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onTenantAdded,
}) => {
  const availableRooms = rooms.filter((r) => r.status === 'Available');
  const allRooms = rooms;
  const defaultRoom = availableRooms[0] || allRooms[0];

  const [selectedRoomId, setSelectedRoomId] = useState(defaultRoom?.id || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [moveInDate, setMoveInDate] = useState('Aug 1, 2026');
  const [depositAmount, setDepositAmount] = useState(7000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !name) return;

    onTenantAdded(selectedRoomId, {
      name,
      phone: phone || '0900-000-0000',
      email: email || 'tenant@email.com',
      moveInDate,
      depositAmount: Number(depositAmount),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Tenant"
      subtitle="Assign a new tenant to an available room"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
            Assign to Room
          </label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="rl-input font-medium"
            required
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} (Floor {r.floor}) — Status: {r.status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
            Tenant Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria Santos"
            className="rl-input"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0917-123-4567"
              className="rl-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenant@email.com"
              className="rl-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Move-in Date
            </label>
            <input
              type="text"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="rl-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Security Deposit (₱)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="rl-input"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF2F7]">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Confirm & Assign
          </button>
        </div>
      </form>
    </Modal>
  );
};
