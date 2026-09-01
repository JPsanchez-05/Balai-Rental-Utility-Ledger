import React from 'react';
import { Modal } from '../common/Modal.tsx';
import { StatementItem, PropertySettings } from '../../api/types.ts';
import { Printer, Download, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.tsx';

interface ViewStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: StatementItem | null;
  settings: PropertySettings;
  month: string;
}

export const ViewStatementModal: React.FC<ViewStatementModalProps> = ({
  isOpen,
  onClose,
  statement,
  settings,
  month,
}) => {
  if (!statement) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Billing Statement — ${statement.roomNumber}`}
      subtitle={`Billing period: ${month}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-sm text-[#2D3748]">
        {/* Header Property & Tenant Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8F9FD] border border-[#EDF2F7]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">
              From Landlord
            </div>
            <div className="font-bold text-[#1A202C] mt-0.5">{settings.propertyName}</div>
            <div className="text-xs text-[#4A5568]">{settings.landlordName}</div>
            <div className="text-xs text-[#718096]">{settings.address}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">
              Bill To Tenant
            </div>
            <div className="font-bold text-[#1A202C] mt-0.5">{statement.tenantName}</div>
            <div className="text-xs text-[#4A5568]">{statement.roomNumber} • Floor {statement.floor}</div>
            <div className="text-xs text-[#718096]">{statement.tenantPhone} • {statement.tenantEmail}</div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-hidden rounded-xl border border-[#EDF2F7]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FC] text-[#718096] border-b border-[#EDF2F7]">
              <tr>
                <th className="p-3 font-bold uppercase tracking-wider">Description</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Details</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF2F7]">
              {/* Rent */}
              <tr>
                <td className="p-3 font-medium text-[#1A202C]">Monthly Room Rent</td>
                <td className="p-3 text-right text-[#718096]">{month}</td>
                <td className="p-3 text-right font-bold text-[#1A202C]">
                  ₱{statement.monthlyRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Electricity */}
              <tr>
                <td className="p-3">
                  <div className="font-medium text-[#1A202C]">Electricity Charge</div>
                  <div className="text-[11px] text-[#718096]">
                    Meter: {statement.meterReadings.prevElec} → {statement.meterReadings.currElec}
                  </div>
                </td>
                <td className="p-3 text-right text-[#718096]">
                  {statement.electricityUsageKwh} kWh @ ₱{settings.electricityRate}/kWh
                </td>
                <td className="p-3 text-right font-bold text-[#1A202C]">
                  ₱{statement.electricityCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Water + Pump Fee */}
              <tr>
                <td className="p-3">
                  <div className="font-medium text-[#1A202C]">Water + Pump Fee</div>
                  <div className="text-[11px] text-[#718096]">
                    Meter: {statement.meterReadings.prevWater} → {statement.meterReadings.currWater} ({statement.waterUsageM3} m³) + shared pump fee
                  </div>
                </td>
                <td className="p-3 text-right text-[#718096]">
                  ₱{statement.waterCost.toLocaleString()} (water) + ₱{(statement.waterPumpFee || 0).toLocaleString()} (pump)
                </td>
                <td className="p-3 text-right font-bold text-[#1A202C]">
                  ₱{((statement.waterCost || 0) + (statement.waterPumpFee || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Payments Summary */}
        <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#EDF2F7] space-y-2">
          <div className="flex justify-between text-xs text-[#4A5568]">
            <span>Total Billed:</span>
            <span className="font-bold text-[#1A202C]">
              ₱{statement.totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-xs text-[#1E6B52]">
            <span>Total Payments Received:</span>
            <span className="font-bold">
              - ₱{statement.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-sm font-extrabold">
            <div className="flex items-center gap-2">
              <span>Balance Due:</span>
              <StatusBadge status={statement.status} />
            </div>
            <span className={statement.balance > 0 ? 'text-[#D92D20] text-base' : 'text-[#1E6B52] text-base'}>
              ₱{statement.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Recorded Payments list */}
        {statement.payments.length > 0 && (
          <div>
            <div className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
              Payment History
            </div>
            <div className="space-y-1.5">
              {statement.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#EDF2F7]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B52]" />
                    <span className="font-semibold text-[#1A202C]">{p.type} Payment</span>
                    <span className="text-[#718096]">({p.method} • {p.date})</span>
                  </div>
                  <div className="font-bold text-[#1E6B52]">
                    ₱{p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EDF2F7]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-outline flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Downloaded PDF statement for ${statement.roomNumber} - ${statement.tenantName}`);
              }}
              className="btn-primary flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
