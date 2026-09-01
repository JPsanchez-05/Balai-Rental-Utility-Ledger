import React, { useState, useEffect } from 'react';
import { Header } from '../layout/Header.tsx';
import { PropertySettings } from '../../api/types.ts';
import { Save, Check } from 'lucide-react';

interface SettingsPageProps {
  settings: PropertySettings;
  onSaveSettings: (newSettings: Partial<PropertySettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<PropertySettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <Header
        title="Settings"
        subtitle="Property and billing configuration"
        showMonthSelector={false}
      />

      <form onSubmit={handleSubmit} className="settings-container space-y-6 max-w-2xl">
        {/* Property Details Card */}
        <div className="rl-card settings-card bg-white rounded-xl border border-[#EDF2F7] p-6">
          <div className="settings-card-title text-xs font-bold text-[#718096] uppercase tracking-wider mb-5">
            PROPERTY DETAILS
          </div>

          <div className="space-y-4">
            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Property Name
              </label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) =>
                  setFormData({ ...formData, propertyName: e.target.value })
                }
                className="rl-input font-medium"
                required
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Landlord / Owner
              </label>
              <input
                type="text"
                value={formData.landlordName}
                onChange={(e) =>
                  setFormData({ ...formData, landlordName: e.target.value })
                }
                className="rl-input font-medium"
                required
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rl-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Utility Rates Card */}
        <div className="rl-card settings-card bg-white rounded-xl border border-[#EDF2F7] p-6">
          <div className="settings-card-title text-xs font-bold text-[#718096] uppercase tracking-wider mb-5">
            UTILITY RATES
          </div>

          <div className="settings-grid-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Electricity (₱ per kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.electricityRate}
                onChange={(e) =>
                  setFormData({ ...formData, electricityRate: Number(e.target.value) })
                }
                className="rl-input font-bold"
                required
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Water (₱ per m³)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.waterRate}
                onChange={(e) =>
                  setFormData({ ...formData, waterRate: Number(e.target.value) })
                }
                className="rl-input font-bold"
                required
              />
            </div>
          </div>

          <div className="settings-hint text-xs text-[#718096] mt-3">
            Rates apply to sub-metered rooms automatically.
          </div>
        </div>

        {/* Fixed Overhead & Operating Expenses Card */}
        <div className="rl-card settings-card bg-white rounded-xl border border-[#EDF2F7] p-6">
          <div className="settings-card-title text-xs font-bold text-[#718096] uppercase tracking-wider mb-5">
            PROPERTY OVERHEAD & SHARED UTILITY EXPENSES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Property Fixed Overhead / Rent (₱)
              </label>
              <input
                type="number"
                step="250"
                min="0"
                value={formData.fixedPropertyOverhead ?? 4500}
                onChange={(e) =>
                  setFormData({ ...formData, fixedPropertyOverhead: Number(e.target.value) })
                }
                className="rl-input font-bold text-[#2563EB]"
                required
              />
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Base fixed property rent or facility overhead used in P&L formula.
              </span>
            </div>

            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Common Area Maintenance (₱)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={formData.commonAreaMaintenance ?? 1500}
                onChange={(e) =>
                  setFormData({ ...formData, commonAreaMaintenance: Number(e.target.value) })
                }
                className="rl-input font-bold text-[#0F172A]"
                required
              />
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Hallway lighting, garbage disposal, and common area upkeep.
              </span>
            </div>

            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Total Monthly Water Pump Fee (₱)
              </label>
              <input
                type="number"
                step="50"
                min="0"
                value={formData.monthlyWaterPumpFee ?? 1400}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyWaterPumpFee: Number(e.target.value) })
                }
                className="rl-input font-bold text-[#7C3AED]"
                required
              />
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Total monthly pump maintenance/power distributed across tenants.
              </span>
            </div>

            <div className="settings-form-group">
              <label className="settings-label text-xs font-bold text-[#4A5568] uppercase tracking-wider block mb-1.5">
                Additional Operating Upkeep (₱)
              </label>
              <input
                type="number"
                step="500"
                min="0"
                value={formData.monthlyOperatingExpense ?? 12000}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyOperatingExpense: Number(e.target.value) })
                }
                className="rl-input font-bold text-[#0F172A]"
                required
              />
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Emergency contingency or major reserve allocations.
              </span>
            </div>
          </div>

          {/* Formula & Live Distribution Preview */}
          <div className="mt-5 space-y-3">
            <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-between text-xs">
              <div className="text-[#166534]">
                <span className="font-bold">Active P&L Formula: </span>
                <span>
                  Net Profit = Revenue − (Fixed Overhead ₱{(formData.fixedPropertyOverhead ?? 4500).toLocaleString()} + Utilities + Pump Fee + CAM ₱{(formData.commonAreaMaintenance ?? 1500).toLocaleString()})
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl flex items-center justify-between text-xs">
              <div className="text-[#6B21A8]">
                <span className="font-bold">Water Pump Share per Tenant: </span>
                <span>
                  ₱{(formData.monthlyWaterPumpFee || 0).toLocaleString()} ÷ {formData.totalTenants || 1} occupied tenants
                </span>
              </div>
              <div className="text-sm font-extrabold text-[#7C3AED]">
                = ₱{Math.round((formData.monthlyWaterPumpFee || 0) / Math.max(1, formData.totalTenants || 1)).toLocaleString()} / tenant
              </div>
            </div>
          </div>
        </div>

        {/* About Card */}
        <div className="rl-card settings-card bg-white rounded-xl border border-[#EDF2F7] p-6">
          <div className="settings-card-title text-xs font-bold text-[#718096] uppercase tracking-wider mb-4">
            ABOUT
          </div>

          <div className="divide-y divide-[#F7FAFC] text-xs">
            <div className="settings-about-row flex justify-between py-2.5">
              <span className="settings-about-label text-[#718096]">Application</span>
              <span className="settings-about-value font-bold text-[#1A202C]">
                {formData.propertyName.length ? 'Rental Ledger' : 'Rental Ledger'}
              </span>
            </div>
            <div className="settings-about-row flex justify-between py-2.5">
              <span className="settings-about-label text-[#718096]">Version</span>
              <span className="settings-about-value font-bold text-[#1A202C]">
                {formData.version}
              </span>
            </div>
            <div className="settings-about-row flex justify-between py-2.5">
              <span className="settings-about-label text-[#718096]">Total Rooms</span>
              <span className="settings-about-value font-bold text-[#1A202C]">
                {formData.totalRooms}
              </span>
            </div>
            <div className="settings-about-row flex justify-between py-2.5">
              <span className="settings-about-label text-[#718096]">Tenants</span>
              <span className="settings-about-value font-bold text-[#1A202C]">
                {formData.totalTenants}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs text-[#137333] font-semibold animate-fade-in">
              <Check className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
