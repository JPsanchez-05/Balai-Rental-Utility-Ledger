export type RoomStatus = 'Occupied' | 'Available' | 'Inactive';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';
export type PaymentMethod = 'Cash' | 'GCash' | 'Bank Transfer';
export type PaymentType = 'All' | 'Rent' | 'Electricity' | 'Water + Pump Fee' | 'Water' | 'Water Pump Fee';
export type RoomType = string; // Deprecated/optional

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  roomId: string;
  moveInDate?: string;
  depositAmount?: number;
}

export interface MeterReading {
  previousElectricity: number;
  currentElectricity: number;
  previousWater: number;
  currentWater: number;
}

export interface Room {
  id: string;
  roomNumber: string; // e.g. "Rm 1", "Room 1"
  floor: number;
  type?: string;
  monthlyRent: number;
  status: RoomStatus;
  tenant?: Tenant;
  meterReading: MeterReading;
  billed: number;
  collected: number;
  balance: number;
  paymentStatus: PaymentStatus;
  waterPumpFeeShare?: number;
}

export interface Payment {
  id: string;
  roomId: string;
  roomNumber: string;
  tenantName: string;
  date: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  reference: string;
  notes?: string;
}

export interface StatementItem {
  id: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  roomType?: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  monthlyRent: number;
  electricityUsageKwh: number;
  electricityCost: number;
  waterUsageM3: number;
  waterCost: number;
  waterPumpFee: number;
  waterAndPumpCost: number; // Combined Water Bill + Water Pump Fee
  totalBilled: number;
  totalPaid: number;
  balance: number;
  status: PaymentStatus;
  meterReadings: {
    prevElec: number;
    currElec: number;
    prevWater: number;
    currWater: number;
  };
  payments: Payment[];
}

export interface PropertySettings {
  propertyName: string;
  landlordName: string;
  address: string;
  electricityRate: number; // ₱ per kWh
  waterRate: number; // ₱ per m³
  monthlyWaterPumpFee: number; // Total water pump fee distributed across occupied tenants (₱)
  fixedPropertyOverhead: number; // Fixed Property Rent / Overhead (₱) e.g., ₱4,500
  commonAreaMaintenance: number; // Common Area Maintenance (₱) e.g., ₱1,500
  monthlyOperatingExpense: number; // Monthly property operating/maintenance expense (₱)
  version: string;
  totalRooms: number;
  totalTenants: number;
}

export interface DashboardMetrics {
  totalBilled: number; // Total Bills
  totalCollected: number; // Total Bills Paid
  totalRentBilled: number; // Total Rent
  totalRentPaid: number; // Total Rent Paid
  totalUtilitiesBilled: number;
  totalUtilitiesPaid: number;
  totalWaterPumpBilled: number;
  totalWaterPumpPaid: number;
  waterPumpFeeTotal: number;
  waterPumpFeePerTenant: number;
  // Formula Components:
  // Net Profit/Loss = Total Occupancy Revenue - (Fixed Property Rent + Total Utility Expenses)
  totalOccupancyRevenue: number; // (Occupied Rooms × Rent per Room) + Utility Surcharges Collected
  totalUtilityExpenses: number; // Electricity + Water + Pump Fee + Common Area Maintenance
  fixedPropertyOverhead: number; // Property Fixed Overhead
  commonAreaMaintenance: number; // Common Area Maintenance
  operatingExpenses: number; // Fixed Property Overhead + Total Utility Expenses
  netSurplusDeficit: number; // Net Monthly Surplus / Deficit
  netProfitMargin: number; // (Net Surplus / Total Occupancy Revenue) * 100
  netProfit: number;
  netLoss: number;
  isNetProfit: boolean;
  collectionRate: number;
  outstanding: number;
  roomsWithBalance: number;
  occupancyPercentage: number;
  occupiedRoomsCount: number;
  totalRoomsCount: number;
}

export interface MonthlyTrendData {
  month: string;
  billed: number;
  collected: number;
  outstanding: number;
}

export interface RevenueBreakdownData {
  rent: number;
  electricity: number;
  water: number;
  waterPump: number;
  waterAndPump: number; // Combined Water + Pump Fee
}

export interface YearlyMonthSummary {
  monthKey: string; // e.g. "Jan 2026", "Aug 2026"
  monthName: string; // "Jan", "Feb", etc.
  occupiedUnits: number;
  totalUnits: number;
  rentBilled: number;
  rentPaid: number;
  electricityBilled: number;
  waterAndPumpBilled: number;
  totalBilled: number;
  totalCollected: number;
  totalOccupancyRevenue: number;
  totalUtilityExpenses: number;
  fixedPropertyOverhead: number;
  operatingExpense: number;
  netSurplusDeficit: number;
  netProfitMargin: number;
  netProfit: number;
  netLoss: number;
  isNetProfit: boolean;
  collectionRate: number;
  hasData: boolean;
}

export interface YearlyReportData {
  year: number;
  annualBilled: number;
  annualCollected: number;
  annualRentBilled: number;
  annualRentPaid: number;
  annualElectricity: number;
  annualWaterAndPump: number;
  annualOccupancyRevenue: number;
  annualUtilityExpenses: number;
  annualFixedOverhead: number;
  annualOperatingExpenses: number;
  annualNetSurplusDeficit: number;
  annualNetProfitMargin: number;
  annualNetProfit: number;
  annualNetLoss: number;
  isNetProfit: boolean;
  averageOccupancy: number;
  averageCollectionRate: number;
  monthlyBreakdown: YearlyMonthSummary[];
}

export interface MonthRecord {
  monthKey: string; // e.g. "Aug 2026"
  rooms: Room[];
  payments: Payment[];
  createdAt: string;
}
