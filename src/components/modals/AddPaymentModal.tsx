import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Room, PaymentType, PaymentMethod } from '../../api/types.ts';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onPaymentAdded: (payment: {
    roomId: string;
    roomNumber: string;
    tenantName: string;
    date: string;
    type: PaymentType;
    amount: number;
    method: PaymentMethod;
    reference: string;
  }) => void;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onPaymentAdded,
}) => {
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied');
  const defaultRoom = occupiedRooms[0];

  const [selectedRoomId, setSelectedRoomId] = useState(defaultRoom?.id || '');
  const [paymentType, setPaymentType] = useState<PaymentType>('All');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('GCash');
  const [reference, setReference] = useState('GC-0810-001');
  const [date, setDate] = useState('Aug 10, 2026');

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || defaultRoom;

  const calculateDefaultAmount = (type: PaymentType, room?: Room) => {
    if (!room) return 0;
    if (type === 'All') {
      return room.balance > 0 ? room.balance : room.billed;
    }
    if (type === 'Rent') {
      return room.monthlyRent;
    }
    if (type === 'Water + Pump Fee' || type === 'Water' || type === 'Water Pump Fee') {
      const waterUsage = Math.max(0, room.meterReading.currentWater - room.meterReading.previousWater);
      const waterCost = Math.round(waterUsage * 85);
      const pumpShare = room.waterPumpFeeShare || 200;
      return waterCost + pumpShare;
    }
    if (type === 'Electricity') {
      const elecUsage = Math.max(0, room.meterReading.currentElectricity - room.meterReading.previousElectricity);
      return Math.round(elecUsage * 11.5) || 1500;
    }
    return room.balance > 0 ? room.balance : room.monthlyRent;
  };

  useEffect(() => {
    if (isOpen && currentRoom) {
      setAmount(calculateDefaultAmount(paymentType, currentRoom));
    }
  }, [isOpen, selectedRoomId, paymentType]);

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type);
    if (currentRoom) {
      setAmount(calculateDefaultAmount(type, currentRoom));
    }
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId);
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setAmount(calculateDefaultAmount(paymentType, room));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom) return;

    onPaymentAdded({
      roomId: currentRoom.id,
      roomNumber: currentRoom.roomNumber,
      tenantName: currentRoom.tenant?.name || 'Tenant',
      date,
      type: paymentType,
      amount: Number(amount),
      method,
      reference: reference || '—',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      subtitle="Log a tenant payment to the property ledger"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Selection */}
        <div>
          <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
            Room & Tenant
          </label>
          <select
            value={selectedRoomId}
            onChange={(e) => handleRoomChange(e.target.value)}
            className="rl-input"
            required
          >
            {occupiedRooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} - {r.tenant?.name} (Balance: ₱{r.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Payment Type & Amount Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => handlePaymentTypeChange(e.target.value as PaymentType)}
              className="rl-input font-semibold text-[#0F172A]"
            >
              <option value="All">All (Full Bill as One)</option>
              <option value="Rent">Rent Only</option>
              <option value="Electricity">Electricity</option>
              <option value="Water + Pump Fee">Water + Pump Fee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Amount (₱)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="rl-input font-bold text-[#0F172A]"
              min="1"
              required
            />
          </div>
        </div>

        {paymentType === 'All' && (
          <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-100 text-[12px] text-blue-800 flex items-center gap-2">
            <span className="font-semibold">💡 Tenant paying as one:</span>
            <span>Applies payment across total outstanding balance (Rent, Electricity & Water + Pump Fee).</span>
          </div>
        )}

        {/* Payment Method & Reference */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="rl-input"
            >
              <option value="GCash">GCash</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
              Reference #
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. GC-0808-001 or —"
              className="rl-input"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">
            Payment Date
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rl-input"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF2F7]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save Payment
          </button>
        </div>
      </form>
    </Modal>
  );
};
