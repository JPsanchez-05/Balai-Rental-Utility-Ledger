import React, { useState } from 'react';
import { Header } from '../layout/Header.tsx';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { Modal } from '../common/Modal.tsx';
import { Room, RoomStatus } from '../../api/types.ts';
import { Plus, Search, ArrowRight, UserMinus, UserPlus, AlertTriangle } from 'lucide-react';

interface RoomsPageProps {
  rooms: Room[];
  selectedMonth: string;
  onOpenAddRoom: () => void;
  onOpenAddTenant?: () => void;
  onViewRoomDetails: (room: Room) => void;
  onDeleteTenant?: (roomId: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({
  rooms,
  selectedMonth,
  onOpenAddRoom,
  onOpenAddTenant,
  onViewRoomDetails,
  onDeleteTenant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RoomStatus>('All');
  const [tenantToDelete, setTenantToDelete] = useState<Room | null>(null);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.tenant?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.tenant?.phone || '').includes(searchQuery);

    const matchesFilter =
      statusFilter === 'All' ? true : room.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const confirmDeleteTenant = () => {
    if (tenantToDelete && onDeleteTenant) {
      onDeleteTenant(tenantToDelete.id);
      setTenantToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="Rooms"
        subtitle="All rooms and their current occupancy status"
        showMonthSelector={false}
        actions={
          <div className="flex items-center gap-2.5">
            {onOpenAddTenant && (
              <button
                id="rooms-btn-add-tenant"
                type="button"
                onClick={onOpenAddTenant}
                className="btn-outline text-xs font-semibold"
              >
                <UserPlus className="w-4 h-4 text-[#64748B]" />
                <span>Add Tenant</span>
              </button>
            )}
            <button
              id="rooms-btn-add-room"
              type="button"
              onClick={onOpenAddRoom}
              className="btn-primary text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </button>
          </div>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="rooms-toolbar flex items-center justify-between gap-4 flex-wrap">
        <div className="rooms-search-container max-w-md relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            id="rooms-search-input"
            type="text"
            placeholder="Search room or tenant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rl-input !pl-11"
          />
        </div>

        <div className="rooms-filters flex items-center gap-2">
          {(['All', 'Occupied', 'Available', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Table Card */}
      <div className="rl-card bg-white rounded-xl border border-[#EDF2F7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="rl-table">
            <thead>
              <tr>
                <th>ROOM</th>
                <th>TENANT</th>
                <th>MONTHLY RENT</th>
                <th>BILLED ({selectedMonth.split(' ')[0].toUpperCase()})</th>
                <th>COLLECTED</th>
                <th>BALANCE</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => {
                const isOccupied = room.status === 'Occupied';
                return (
                  <tr key={room.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Room */}
                    <td>
                      <div className="room-number-cell font-bold text-[#0F172A]">{room.roomNumber}</div>
                      <div className="room-sub-info text-xs text-[#64748B]">Floor {room.floor}</div>
                    </td>

                    {/* Tenant */}
                    <td>
                      {isOccupied && room.tenant ? (
                        <div>
                          <div className="tenant-name font-semibold text-[#1E293B]">{room.tenant.name}</div>
                          <div className="tenant-contact text-xs text-[#64748B]">{room.tenant.phone}</div>
                        </div>
                      ) : (
                        <span className="text-[#94A3B8] font-medium text-xs">No Tenant (Vacant)</span>
                      )}
                    </td>

                    {/* Monthly Rent */}
                    <td className="font-bold text-[#0F172A]">
                      ₱{room.monthlyRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Billed */}
                    <td>
                      {isOccupied ? (
                        <span className="font-medium text-[#1E293B]">
                          ₱{room.billed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>

                    {/* Collected */}
                    <td>
                      {isOccupied ? (
                        <span className="font-semibold text-[#059669]">
                          ₱{room.collected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>

                    {/* Balance */}
                    <td>
                      {isOccupied ? (
                        <span className={`font-bold ${room.balance > 0 ? 'text-[#E11D48]' : 'text-[#059669]'}`}>
                          ₱{room.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={room.status} />
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onViewRoomDetails(room)}
                          className="view-action-link inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] px-2 py-1 rounded hover:bg-[#EFF6FF] transition-colors"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {isOccupied && room.tenant && onDeleteTenant && (
                          <button
                            type="button"
                            onClick={() => setTenantToDelete(room)}
                            title="Delete / Remove Tenant"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#E11D48] hover:text-[#BE123C] px-2 py-1 rounded hover:bg-[#FFF1F2] transition-colors"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}

                        {!isOccupied && onOpenAddTenant && (
                          <button
                            type="button"
                            onClick={onOpenAddTenant}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] px-2 py-1 rounded hover:bg-[#EFF6FF] transition-colors"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#94A3B8]">
                    No rooms found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Tenant Confirmation Modal */}
      {tenantToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setTenantToDelete(null)}
          title="Remove Tenant"
          subtitle={`Confirmation for ${tenantToDelete.roomNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl text-xs text-[#9F1239]">
              <AlertTriangle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#BE123C] mb-1">Are you sure you want to remove this tenant?</p>
                <p>
                  Removing <strong className="font-semibold text-[#881337]">{tenantToDelete.tenant?.name}</strong> from{' '}
                  <strong className="font-semibold text-[#881337]">{tenantToDelete.roomNumber}</strong> will mark the room
                  as <strong>Available</strong> and clear the active ledger balance for this unit.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setTenantToDelete(null)}
                className="btn-outline text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTenant}
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <UserMinus className="w-3.5 h-3.5" />
                <span>Remove Tenant</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
