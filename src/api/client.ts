import {
  Room,
  Payment,
  StatementItem,
  PropertySettings,
  DashboardMetrics,
  MonthlyTrendData,
  RevenueBreakdownData,
  YearlyReportData,
  YearlyMonthSummary,
} from './types.ts';

// Initial Mock Seed Data matching the screenshots faithfully
const INITIAL_SETTINGS: PropertySettings = {
  propertyName: 'Dela Cruz Apartelle',
  landlordName: 'Rodrigo Dela Cruz',
  address: '123 Mabini St., Quezon City, Metro Manila',
  electricityRate: 11.5,
  waterRate: 85,
  monthlyWaterPumpFee: 1400, // Total monthly water pump cost distributed across occupied rooms
  fixedPropertyOverhead: 4500, // Fixed Property Rent / Overhead (₱) e.g., ₱4,500
  commonAreaMaintenance: 1500, // Common Area Maintenance (₱) e.g., ₱1,500
  monthlyOperatingExpense: 12000, // Monthly property upkeep & operational expenses
  version: '1.0.0',
  totalRooms: 8,
  totalTenants: 7,
};

const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    roomNumber: 'Rm 1',
    floor: 1,
    monthlyRent: 6500,
    status: 'Occupied',
    tenant: {
      id: 'tenant-1',
      name: 'Ana Reyes',
      phone: '0917-234-5678',
      email: 'ana.reyes@gmail.com',
      roomId: 'room-1',
    },
    meterReading: {
      previousElectricity: 12495,
      currentElectricity: 12661,
      previousWater: 3248,
      currentWater: 3265,
    },
    billed: 9854,
    collected: 8409,
    balance: 1445,
    paymentStatus: 'Partial',
  },
  {
    id: 'room-2',
    roomNumber: 'Rm 2',
    floor: 1,
    monthlyRent: 6500,
    status: 'Occupied',
    tenant: {
      id: 'tenant-2',
      name: 'Carlo Mendoza',
      phone: '0919-876-5432',
      email: 'c.mendoza@yahoo.com',
      roomId: 'room-2',
    },
    meterReading: {
      previousElectricity: 8912,
      currentElectricity: 9104,
      previousWater: 2153,
      currentWater: 2174,
    },
    billed: 10493,
    collected: 6500,
    balance: 3993,
    paymentStatus: 'Partial',
  },
  {
    id: 'room-3',
    roomNumber: 'Rm 3',
    floor: 1,
    monthlyRent: 9500,
    status: 'Occupied',
    tenant: {
      id: 'tenant-3',
      name: 'Maribel Santos',
      phone: '0915-555-0101',
      email: 'maribel.s@gmail.com',
      roomId: 'room-3',
    },
    meterReading: {
      previousElectricity: 15100,
      currentElectricity: 15324,
      previousWater: 4100,
      currentWater: 4125,
    },
    billed: 14201,
    collected: 12076,
    balance: 2125,
    paymentStatus: 'Partial',
  },
  {
    id: 'room-4',
    roomNumber: 'Rm 4',
    floor: 2,
    monthlyRent: 7000,
    status: 'Occupied',
    tenant: {
      id: 'tenant-4',
      name: 'Jayson Flores',
      phone: '0917-999-1234',
      email: 'jflores@gmail.com',
      roomId: 'room-4',
    },
    meterReading: {
      previousElectricity: 6400,
      currentElectricity: 6600,
      previousWater: 1820,
      currentWater: 1833.54,
    },
    billed: 10451,
    collected: 0,
    balance: 10451,
    paymentStatus: 'Unpaid',
  },
  {
    id: 'room-5',
    roomNumber: 'Rm 5',
    floor: 2,
    monthlyRent: 10000,
    status: 'Occupied',
    tenant: {
      id: 'tenant-5',
      name: 'Rosalinda Cruz',
      phone: '0918-444-3210',
      email: 'rosa.cruz@gmail.com',
      roomId: 'room-5',
    },
    meterReading: {
      previousElectricity: 18200,
      currentElectricity: 18480,
      previousWater: 5200,
      currentWater: 5232.1,
    },
    billed: 15949,
    collected: 10000,
    balance: 5949,
    paymentStatus: 'Partial',
  },
  {
    id: 'room-6',
    roomNumber: 'Rm 6',
    floor: 2,
    monthlyRent: 7000,
    status: 'Occupied',
    tenant: {
      id: 'tenant-6',
      name: 'Michael Tan',
      phone: '0916-321-0987',
      email: 'm.tan@email.com',
      roomId: 'room-6',
    },
    meterReading: {
      previousElectricity: 11200,
      currentElectricity: 11384.1,
      previousWater: 3100,
      currentWater: 3121,
    },
    billed: 10901,
    collected: 9117,
    balance: 1784,
    paymentStatus: 'Partial',
  },
  {
    id: 'room-7',
    roomNumber: 'Rm 7',
    floor: 3,
    monthlyRent: 11000,
    status: 'Occupied',
    tenant: {
      id: 'tenant-7',
      name: 'Grace Villanueva',
      phone: '0920-678-9012',
      email: 'g.villanueva@gmail.com',
      roomId: 'room-7',
    },
    meterReading: {
      previousElectricity: 14000,
      currentElectricity: 14265,
      previousWater: 4200,
      currentWater: 4231,
    },
    billed: 16683,
    collected: 14047,
    balance: 2636,
    paymentStatus: 'Partial',
  },
  {
    id: 'room-8',
    roomNumber: 'Rm 8',
    floor: 3,
    monthlyRent: 7500,
    status: 'Available',
    tenant: undefined,
    meterReading: {
      previousElectricity: 5000,
      currentElectricity: 5000,
      previousWater: 1500,
      currentWater: 1500,
    },
    billed: 0,
    collected: 0,
    balance: 0,
    paymentStatus: 'Paid',
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    roomId: 'room-5',
    roomNumber: 'Rm 5',
    tenantName: 'Rosalinda Cruz',
    date: 'Aug 8, 2026',
    type: 'Rent',
    amount: 10000,
    method: 'GCash',
    reference: 'GC-0808-001',
  },
  {
    id: 'pay-2',
    roomId: 'room-2',
    roomNumber: 'Rm 2',
    tenantName: 'Carlo Mendoza',
    date: 'Aug 5, 2026',
    type: 'Rent',
    amount: 6500,
    method: 'Cash',
    reference: '—',
  },
  {
    id: 'pay-3',
    roomId: 'room-6',
    roomNumber: 'Rm 6',
    tenantName: 'Michael Tan',
    date: 'Aug 4, 2026',
    type: 'Rent',
    amount: 7000,
    method: 'Cash',
    reference: '—',
  },
  {
    id: 'pay-4',
    roomId: 'room-6',
    roomNumber: 'Rm 6',
    tenantName: 'Michael Tan',
    date: 'Aug 4, 2026',
    type: 'Electricity',
    amount: 2117,
    method: 'Cash',
    reference: '—',
  },
  {
    id: 'pay-5',
    roomId: 'room-3',
    roomNumber: 'Rm 3',
    tenantName: 'Maribel Santos',
    date: 'Aug 3, 2026',
    type: 'Rent',
    amount: 9500,
    method: 'Bank Transfer',
    reference: 'BDO-0803-01',
  },
  {
    id: 'pay-6',
    roomId: 'room-3',
    roomNumber: 'Rm 3',
    tenantName: 'Maribel Santos',
    date: 'Aug 3, 2026',
    type: 'Electricity',
    amount: 2576,
    method: 'Bank Transfer',
    reference: 'BDO-0803-02',
  },
  {
    id: 'pay-7',
    roomId: 'room-1',
    roomNumber: 'Rm 1',
    tenantName: 'Ana Reyes',
    date: 'Aug 2, 2026',
    type: 'Rent',
    amount: 6500,
    method: 'GCash',
    reference: 'GC-0802-001',
  },
  {
    id: 'pay-8',
    roomId: 'room-1',
    roomNumber: 'Rm 1',
    tenantName: 'Ana Reyes',
    date: 'Aug 2, 2026',
    type: 'Electricity',
    amount: 1909,
    method: 'GCash',
    reference: 'GC-0802-002',
  },
  {
    id: 'pay-9',
    roomId: 'room-7',
    roomNumber: 'Rm 7',
    tenantName: 'Grace Villanueva',
    date: 'Aug 1, 2026',
    type: 'Rent',
    amount: 11000,
    method: 'Bank Transfer',
    reference: 'BPI-0801-01',
  },
  {
    id: 'pay-10',
    roomId: 'room-7',
    roomNumber: 'Rm 7',
    tenantName: 'Grace Villanueva',
    date: 'Aug 1, 2026',
    type: 'Electricity',
    amount: 3047,
    method: 'Bank Transfer',
    reference: 'BPI-0801-02',
  },
];

const INITIAL_TRENDS: MonthlyTrendData[] = [
  { month: 'Jan', billed: 57500, collected: 45000, outstanding: 12500 },
  { month: 'Feb', billed: 57500, collected: 48000, outstanding: 9500 },
  { month: 'Mar', billed: 57500, collected: 52000, outstanding: 5500 },
  { month: 'Apr', billed: 57500, collected: 50000, outstanding: 7500 },
  { month: 'May', billed: 57500, collected: 54000, outstanding: 3500 },
  { month: 'Jun', billed: 85000, collected: 72000, outstanding: 13000 },
  { month: 'Jul', billed: 87200, collected: 73500, outstanding: 13700 },
  { month: 'Aug', billed: 88532, collected: 60149, outstanding: 28383 },
];

interface MonthStore {
  [monthKey: string]: {
    rooms: Room[];
    payments: Payment[];
  };
}

// In-Memory Storage Cache with local storage hydration & multi-month support
class ApiService {
  private activeMonth: string = 'Aug 2026';
  private months: MonthStore = {
    'Aug 2026': {
      rooms: INITIAL_ROOMS,
      payments: INITIAL_PAYMENTS,
    },
  };
  private monthList: string[] = [
    'Aug 2026',
    'Jul 2026',
    'Jun 2026',
    'May 2026',
    'Apr 2026',
    'Mar 2026',
    'Feb 2026',
    'Jan 2026',
  ];
  private settings: PropertySettings = INITIAL_SETTINGS;
  private trends: MonthlyTrendData[] = INITIAL_TRENDS;

  constructor() {
    this.loadFromStorage();
  }

  private get currentRooms(): Room[] {
    if (!this.months[this.activeMonth]) {
      this.months[this.activeMonth] = {
        rooms: JSON.parse(JSON.stringify(INITIAL_ROOMS)),
        payments: [],
      };
    }
    return this.months[this.activeMonth].rooms;
  }

  private set currentRooms(rooms: Room[]) {
    if (!this.months[this.activeMonth]) {
      this.months[this.activeMonth] = { rooms, payments: [] };
    } else {
      this.months[this.activeMonth].rooms = rooms;
    }
  }

  private get currentPayments(): Payment[] {
    if (!this.months[this.activeMonth]) {
      this.months[this.activeMonth] = {
        rooms: JSON.parse(JSON.stringify(INITIAL_ROOMS)),
        payments: [],
      };
    }
    return this.months[this.activeMonth].payments;
  }

  private set currentPayments(payments: Payment[]) {
    if (!this.months[this.activeMonth]) {
      this.months[this.activeMonth] = {
        rooms: JSON.parse(JSON.stringify(INITIAL_ROOMS)),
        payments,
      };
    } else {
      this.months[this.activeMonth].payments = payments;
    }
  }

  private loadFromStorage() {
    try {
      const storedMonths = localStorage.getItem('rental_ledger_months_v3');
      const storedMonthList = localStorage.getItem('rental_ledger_month_list_v3');
      const storedActiveMonth = localStorage.getItem('rental_ledger_active_month_v3');
      const storedSettings = localStorage.getItem('rental_ledger_settings');

      if (storedMonths) {
        this.months = JSON.parse(storedMonths);
      } else {
        // Migration from previous single-month storage if available
        const singleRooms = localStorage.getItem('rental_ledger_rooms');
        const singlePayments = localStorage.getItem('rental_ledger_payments');
        if (singleRooms) {
          try {
            const parsed = JSON.parse(singleRooms);
            const parsedPayments = singlePayments ? JSON.parse(singlePayments) : INITIAL_PAYMENTS;
            this.months['Aug 2026'] = {
              rooms: Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ROOMS,
              payments: Array.isArray(parsedPayments) ? parsedPayments : INITIAL_PAYMENTS,
            };
          } catch {
            this.months['Aug 2026'] = { rooms: INITIAL_ROOMS, payments: INITIAL_PAYMENTS };
          }
        }
      }

      if (storedMonthList) {
        this.monthList = JSON.parse(storedMonthList);
      }

      if (storedActiveMonth && this.monthList.includes(storedActiveMonth)) {
        this.activeMonth = storedActiveMonth;
      }

      if (storedSettings) {
        this.settings = { ...INITIAL_SETTINGS, ...JSON.parse(storedSettings) };
      }
    } catch {
      this.months = { 'Aug 2026': { rooms: INITIAL_ROOMS, payments: INITIAL_PAYMENTS } };
      this.settings = INITIAL_SETTINGS;
    }
    this.recalculate();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('rental_ledger_months_v3', JSON.stringify(this.months));
      localStorage.setItem('rental_ledger_month_list_v3', JSON.stringify(this.monthList));
      localStorage.setItem('rental_ledger_active_month_v3', this.activeMonth);
      localStorage.setItem('rental_ledger_settings', JSON.stringify(this.settings));
    } catch {
      // Ignore
    }
  }

  // Recalculate room billing based on current readings and payments for active month
  public recalculate() {
    const elecRate = this.settings.electricityRate;
    const waterRate = this.settings.waterRate;
    const occupiedCount = this.currentRooms.filter((r) => r.status === 'Occupied' && r.tenant).length;
    const waterPumpTotal = this.settings.monthlyWaterPumpFee || 0;
    const waterPumpFeePerTenant = occupiedCount > 0 ? Math.round(waterPumpTotal / occupiedCount) : 0;

    this.currentRooms.forEach((room) => {
      if (room.status !== 'Occupied' || !room.tenant) {
        room.billed = 0;
        room.collected = 0;
        room.balance = 0;
        room.waterPumpFeeShare = 0;
        room.paymentStatus = 'Paid';
        return;
      }

      const elecUsage = Math.max(0, room.meterReading.currentElectricity - room.meterReading.previousElectricity);
      const elecCost = Math.round(elecUsage * elecRate);

      const waterUsage = Math.max(0, room.meterReading.currentWater - room.meterReading.previousWater);
      const waterCost = Math.round(waterUsage * waterRate);

      room.waterPumpFeeShare = waterPumpFeePerTenant;

      const totalBilled = room.monthlyRent + elecCost + waterCost + waterPumpFeePerTenant;

      const roomPayments = this.currentPayments.filter((p) => p.roomId === room.id);
      const totalCollected = roomPayments.reduce((acc, p) => acc + p.amount, 0);

      room.billed = totalBilled;
      room.collected = totalCollected;
      room.balance = Math.max(0, totalBilled - totalCollected);

      if (totalCollected >= totalBilled && totalBilled > 0) {
        room.paymentStatus = 'Paid';
      } else if (totalCollected > 0) {
        room.paymentStatus = 'Partial';
      } else {
        room.paymentStatus = 'Unpaid';
      }
    });

    this.settings.totalRooms = this.currentRooms.length;
    this.settings.totalTenants = occupiedCount;

    this.saveToStorage();
  }

  // --- Month Management Methods ---

  public async getAvailableMonths(): Promise<string[]> {
    return [...this.monthList];
  }

  public async getActiveMonth(): Promise<string> {
    return this.activeMonth;
  }

  public async setActiveMonth(monthKey: string): Promise<string> {
    if (!this.monthList.includes(monthKey)) {
      this.monthList.unshift(monthKey);
    }
    this.activeMonth = monthKey;
    if (!this.months[monthKey]) {
      this.months[monthKey] = {
        rooms: JSON.parse(JSON.stringify(INITIAL_ROOMS)),
        payments: [],
      };
    }
    this.recalculate();
    return this.activeMonth;
  }

  public async addMonth(
    newMonthKey: string,
    sourceMonthKey?: string,
    importTenantsAndRooms: boolean = true
  ): Promise<{ success: boolean; activeMonth: string }> {
    const trimmed = newMonthKey.trim();
    if (!trimmed) throw new Error('Month name cannot be empty');

    const sourceKey = sourceMonthKey || this.activeMonth;
    const sourceData = this.months[sourceKey] || { rooms: INITIAL_ROOMS, payments: [] };

    let newRooms: Room[] = [];

    if (importTenantsAndRooms) {
      // Import tenants and rooms from previous month, rolling over meter readings cleanly
      newRooms = sourceData.rooms.map((srcRoom) => {
        const prevElec = srcRoom.meterReading.currentElectricity || srcRoom.meterReading.previousElectricity || 0;
        const prevWater = srcRoom.meterReading.currentWater || srcRoom.meterReading.previousWater || 0;

        return {
          ...srcRoom,
          meterReading: {
            previousElectricity: prevElec,
            currentElectricity: prevElec, // New month starts with zero delta until updated
            previousWater: prevWater,
            currentWater: prevWater, // New month starts with zero delta until updated
          },
          billed: srcRoom.status === 'Occupied' ? srcRoom.monthlyRent : 0,
          collected: 0,
          balance: srcRoom.status === 'Occupied' ? srcRoom.monthlyRent : 0,
          paymentStatus: srcRoom.status === 'Occupied' ? 'Unpaid' : 'Paid',
        };
      });
    } else {
      // Create blank rooms template without tenants
      newRooms = Array.from({ length: 8 }, (_, idx) => ({
        id: `room-${Date.now()}-${idx + 1}`,
        roomNumber: `Rm ${idx + 1}`,
        floor: Math.floor(idx / 3) + 1,
        monthlyRent: 7000,
        status: 'Available',
        tenant: undefined,
        meterReading: {
          previousElectricity: 0,
          currentElectricity: 0,
          previousWater: 0,
          currentWater: 0,
        },
        billed: 0,
        collected: 0,
        balance: 0,
        paymentStatus: 'Paid',
      }));
    }

    this.months[trimmed] = {
      rooms: newRooms,
      payments: [], // Fresh blank record of payments for the new month
    };

    if (!this.monthList.includes(trimmed)) {
      this.monthList.unshift(trimmed);
    }

    this.activeMonth = trimmed;
    this.recalculate();

    return { success: true, activeMonth: this.activeMonth };
  }

  // --- API Methods ---

  // Dashboard Metrics for Active Month
  public async getDashboardMetrics(): Promise<DashboardMetrics> {
    this.recalculate();
    const occupied = this.currentRooms.filter((r) => r.status === 'Occupied' && r.tenant);
    
    // Total Bills & Total Bills Paid
    const totalBilled = occupied.reduce((sum, r) => sum + r.billed, 0);
    const totalCollected = occupied.reduce((sum, r) => sum + r.collected, 0);
    
    // Total Rent & Total Rent Paid (accurately computed per occupied unit)
    const totalRentBilled = occupied.reduce((sum, r) => sum + r.monthlyRent, 0);
    
    // Calculate Rent paid accurately: sum of 'Rent' payments + portion from 'All' payments per room (capped at room.monthlyRent)
    const totalRentPaid = occupied.reduce((acc, room) => {
      const roomPays = this.currentPayments.filter((p) => p.roomId === room.id);
      const rentPortion = roomPays.reduce((pSum, p) => {
        if (p.type === 'Rent') return pSum + p.amount;
        if (p.type === 'All') return pSum + Math.min(p.amount, room.monthlyRent);
        return pSum;
      }, 0);
      return acc + Math.min(rentPortion, room.monthlyRent);
    }, 0);

    // Utilities & Water Pump Fee
    const totalUtilitiesBilled = occupied.reduce((sum, r) => {
      const elecUsage = Math.max(0, r.meterReading.currentElectricity - r.meterReading.previousElectricity);
      const waterUsage = Math.max(0, r.meterReading.currentWater - r.meterReading.previousWater);
      return sum + Math.round(elecUsage * this.settings.electricityRate) + Math.round(waterUsage * this.settings.waterRate);
    }, 0);

    const totalUtilitiesPaid = this.currentPayments
      .filter((p) => p.type === 'Electricity' || p.type === 'Water' || p.type === 'Water + Pump Fee')
      .reduce((sum, p) => sum + p.amount, 0);

    const waterPumpFeeTotal = this.settings.monthlyWaterPumpFee || 0;
    const waterPumpFeePerTenant = occupied.length > 0 ? Math.round(waterPumpFeeTotal / occupied.length) : 0;
    const totalWaterPumpBilled = occupied.reduce((sum, r) => sum + (r.waterPumpFeeShare || 0), 0);
    const totalWaterPumpPaid = this.currentPayments
      .filter((p) => p.type === 'Water Pump Fee')
      .reduce((sum, p) => sum + p.amount, 0);

    // Formula: Net Profit/Loss = Total Occupancy Revenue - (Fixed Property Rent + Total Utility Expenses)
    // Total Occupancy Revenue: (Occupied Rooms × Rent per Room) + Utility Surcharges Collected
    const totalOccupancyRevenue = totalRentBilled + totalUtilitiesBilled + totalWaterPumpBilled;
    
    // Total Utility Expenses: Electricity + Water + Pump Fee + Common Area Maintenance
    const fixedPropertyOverhead = this.settings.fixedPropertyOverhead ?? 4500;
    const commonAreaMaintenance = this.settings.commonAreaMaintenance ?? 1500;
    const totalUtilityExpenses = totalUtilitiesBilled + (this.settings.monthlyWaterPumpFee || 0) + commonAreaMaintenance;
    
    // Total Monthly Operating Expenses: Fixed Property Overhead + Total Utility Expenses
    const operatingExpenses = fixedPropertyOverhead + totalUtilityExpenses;
    
    // Net Monthly Surplus / Deficit & Margin
    const netSurplusDeficit = totalOccupancyRevenue - operatingExpenses;
    const isNetProfit = netSurplusDeficit >= 0;
    const netProfit = netSurplusDeficit > 0 ? netSurplusDeficit : 0;
    const netLoss = netSurplusDeficit < 0 ? Math.abs(netSurplusDeficit) : 0;
    const netProfitMargin = totalOccupancyRevenue > 0 ? Math.round((netSurplusDeficit / totalOccupancyRevenue) * 100) : 0;

    const outstanding = Math.max(0, totalBilled - totalCollected);
    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
    const roomsWithBalance = occupied.filter((r) => r.balance > 0).length;
    const totalRoomsCount = this.currentRooms.length;
    const occupiedRoomsCount = occupied.length;
    const occupancyPercentage = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

    return {
      totalBilled,
      totalCollected,
      totalRentBilled,
      totalRentPaid,
      totalUtilitiesBilled,
      totalUtilitiesPaid,
      totalWaterPumpBilled,
      totalWaterPumpPaid,
      waterPumpFeeTotal,
      waterPumpFeePerTenant,
      totalOccupancyRevenue,
      totalUtilityExpenses,
      fixedPropertyOverhead,
      commonAreaMaintenance,
      operatingExpenses,
      netSurplusDeficit,
      netProfitMargin,
      netProfit,
      netLoss,
      isNetProfit,
      collectionRate,
      outstanding,
      roomsWithBalance,
      occupancyPercentage,
      occupiedRoomsCount,
      totalRoomsCount,
    };
  }

  // Rooms
  public async getRooms(): Promise<Room[]> {
    this.recalculate();
    return [...this.currentRooms];
  }

  public async getRoomById(id: string): Promise<Room | null> {
    const room = this.currentRooms.find((r) => r.id === id);
    return room ? { ...room } : null;
  }

  public async addRoom(roomData: Partial<Room>): Promise<Room> {
    const nextRoomNum = this.currentRooms.length + 1;
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNumber: roomData.roomNumber || `Room ${nextRoomNum}`,
      floor: Number(roomData.floor) || 1,
      monthlyRent: Number(roomData.monthlyRent) || 7000,
      status: roomData.status || 'Available',
      tenant: roomData.tenant,
      meterReading: roomData.meterReading || {
        previousElectricity: 0,
        currentElectricity: 0,
        previousWater: 0,
        currentWater: 0,
      },
      billed: 0,
      collected: 0,
      balance: 0,
      paymentStatus: 'Paid',
    };
    this.currentRooms.push(newRoom);
    this.recalculate();
    return newRoom;
  }

  public async deleteRoom(roomId: string): Promise<void> {
    this.currentRooms = this.currentRooms.filter((r) => r.id !== roomId);
    this.currentPayments = this.currentPayments.filter((p) => p.roomId !== roomId);
    this.recalculate();
  }

  public async deleteTenant(roomId: string): Promise<Room> {
    const room = this.currentRooms.find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');

    room.tenant = undefined;
    room.status = 'Available';
    room.billed = 0;
    room.collected = 0;
    room.balance = 0;
    room.paymentStatus = 'Paid';
    
    this.recalculate();
    return { ...room };
  }

  public async updateMeterReading(
    roomId: string,
    currentElectricity: number,
    currentWater: number
  ): Promise<Room> {
    const room = this.currentRooms.find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');
    room.meterReading.currentElectricity = currentElectricity;
    room.meterReading.currentWater = currentWater;
    this.recalculate();
    return { ...room };
  }

  // Payments
  public async getPayments(): Promise<Payment[]> {
    return [...this.currentPayments];
  }

  public async addPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      ...paymentData,
    };
    this.currentPayments.unshift(newPayment);
    this.recalculate();
    return newPayment;
  }

  // Statements
  public async getStatements(): Promise<StatementItem[]> {
    this.recalculate();
    const elecRate = this.settings.electricityRate;
    const waterRate = this.settings.waterRate;

    return this.currentRooms
      .filter((r) => r.status === 'Occupied' && r.tenant)
      .map((r) => {
        const elecUsage = Math.max(0, r.meterReading.currentElectricity - r.meterReading.previousElectricity);
        const waterUsage = Math.max(0, r.meterReading.currentWater - r.meterReading.previousWater);
        const elecCost = Math.round(elecUsage * elecRate);
        const waterCost = Math.round(waterUsage * waterRate);
        const waterPumpFee = r.waterPumpFeeShare || 0;
        const waterAndPumpCost = waterCost + waterPumpFee;
        const roomPayments = this.currentPayments.filter((p) => p.roomId === r.id);

        return {
          id: `stmt-${r.id}`,
          roomId: r.id,
          roomNumber: r.roomNumber,
          floor: r.floor,
          tenantName: r.tenant?.name || 'Unnamed',
          tenantEmail: r.tenant?.email || '',
          tenantPhone: r.tenant?.phone || '',
          monthlyRent: r.monthlyRent,
          electricityUsageKwh: elecUsage,
          electricityCost: elecCost,
          waterUsageM3: waterUsage,
          waterCost: waterCost,
          waterPumpFee: waterPumpFee,
          waterAndPumpCost: waterAndPumpCost,
          totalBilled: r.billed,
          totalPaid: r.collected,
          balance: r.balance,
          status: r.paymentStatus,
          meterReadings: {
            prevElec: r.meterReading.previousElectricity,
            currElec: r.meterReading.currentElectricity,
            prevWater: r.meterReading.previousWater,
            currWater: r.meterReading.currentWater,
          },
          payments: roomPayments,
        };
      });
  }

  // Reports
  public async getMonthlyTrends(): Promise<MonthlyTrendData[]> {
    return [...this.trends];
  }

  public async getRevenueBreakdown(): Promise<RevenueBreakdownData> {
    const statements = await this.getStatements();
    const rent = statements.reduce((sum, s) => sum + s.monthlyRent, 0);
    const electricity = statements.reduce((sum, s) => sum + s.electricityCost, 0);
    const water = statements.reduce((sum, s) => sum + s.waterCost, 0);
    const waterPump = statements.reduce((sum, s) => sum + s.waterPumpFee, 0);
    const waterAndPump = water + waterPump;

    return {
      rent,
      electricity,
      water,
      waterPump,
      waterAndPump,
    };
  }

  // Yearly Report Breakdown
  public async getYearlyReport(year: number = 2026): Promise<YearlyReportData> {
    const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const opEx = this.settings.monthlyOperatingExpense || 12000;
    const monthlyBreakdown: YearlyMonthSummary[] = [];

    let annualBilled = 0;
    let annualCollected = 0;
    let annualRentBilled = 0;
    let annualRentPaid = 0;
    let annualElectricity = 0;
    let annualWaterAndPump = 0;
    let totalOccupancyPercent = 0;
    let recordedMonthsCount = 0;

    for (const mName of monthsNames) {
      const monthKey = `${mName} ${year}`;
      const storeMonth = this.months[monthKey];

      if (storeMonth) {
        // Compute from actual recorded data
        const occupied = storeMonth.rooms.filter((r) => r.status === 'Occupied' && r.tenant);
        const mBilled = occupied.reduce((sum, r) => sum + r.billed, 0);
        const mCollected = occupied.reduce((sum, r) => sum + r.collected, 0);
        const mRent = occupied.reduce((sum, r) => sum + r.monthlyRent, 0);
        const mRentPaid = occupied.reduce((acc, room) => {
          const roomPays = storeMonth.payments.filter((p) => p.roomId === room.id);
          const rentPortion = roomPays.reduce((pSum, p) => {
            if (p.type === 'Rent') return pSum + p.amount;
            if (p.type === 'All') return pSum + Math.min(p.amount, room.monthlyRent);
            return pSum;
          }, 0);
          return acc + Math.min(rentPortion, room.monthlyRent);
        }, 0);

        const mElec = occupied.reduce((sum, r) => {
          const usage = Math.max(0, r.meterReading.currentElectricity - r.meterReading.previousElectricity);
          return sum + Math.round(usage * this.settings.electricityRate);
        }, 0);

        const mWaterPump = occupied.reduce((sum, r) => {
          const usage = Math.max(0, r.meterReading.currentWater - r.meterReading.previousWater);
          return sum + Math.round(usage * this.settings.waterRate) + (r.waterPumpFeeShare || 0);
        }, 0);

        const mOccupancyRevenue = mBilled;
        const mFixedOverhead = this.settings.fixedPropertyOverhead ?? 4500;
        const mCAM = this.settings.commonAreaMaintenance ?? 1500;
        const mUtilityExpenses = mElec + mWaterPump + mCAM;
        const mOpEx = mFixedOverhead + mUtilityExpenses;
        const mSurplusDeficit = mOccupancyRevenue - mOpEx;
        const isNetProfit = mSurplusDeficit >= 0;
        const netProfit = mSurplusDeficit > 0 ? mSurplusDeficit : 0;
        const netLoss = mSurplusDeficit < 0 ? Math.abs(mSurplusDeficit) : 0;
        const mMargin = mOccupancyRevenue > 0 ? Math.round((mSurplusDeficit / mOccupancyRevenue) * 100) : 0;
        const collRate = mBilled > 0 ? Math.round((mCollected / mBilled) * 100) : 0;

        monthlyBreakdown.push({
          monthKey,
          monthName: mName,
          occupiedUnits: occupied.length,
          totalUnits: storeMonth.rooms.length || 8,
          rentBilled: mRent,
          rentPaid: mRentPaid,
          electricityBilled: mElec,
          waterAndPumpBilled: mWaterPump,
          totalBilled: mBilled,
          totalCollected: mCollected,
          totalOccupancyRevenue: mOccupancyRevenue,
          totalUtilityExpenses: mUtilityExpenses,
          fixedPropertyOverhead: mFixedOverhead,
          operatingExpense: mOpEx,
          netSurplusDeficit: mSurplusDeficit,
          netProfitMargin: mMargin,
          netProfit,
          netLoss,
          isNetProfit,
          collectionRate: collRate,
          hasData: true,
        });

        annualBilled += mBilled;
        annualCollected += mCollected;
        annualRentBilled += mRent;
        annualRentPaid += mRentPaid;
        annualElectricity += mElec;
        annualWaterAndPump += mWaterPump;
        annualOccupancyRevenue += mOccupancyRevenue;
        annualUtilityExpenses += mUtilityExpenses;
        annualFixedOverhead += mFixedOverhead;
        annualOpEx += mOpEx;
        totalOccupancyPercent += storeMonth.rooms.length > 0 ? (occupied.length / storeMonth.rooms.length) * 100 : 0;
        recordedMonthsCount++;
      } else {
        // Historical / standard model for months without separate manual entry yet
        const trendMatch = this.trends.find((t) => t.month === mName);
        const mBilled = trendMatch ? trendMatch.billed : 57500;
        const mCollected = trendMatch ? trendMatch.collected : (monthsNames.indexOf(mName) <= 7 ? 50000 : 0);
        const mRent = 57500;
        const mRentPaid = Math.min(mRent, mCollected);
        const mElec = mBilled > mRent ? Math.round((mBilled - mRent) * 0.55) : 0;
        const mWaterPump = mBilled > mRent ? (mBilled - mRent - mElec) : 0;

        const isPastOrCurrent = monthsNames.indexOf(mName) <= 7;
        const mOccupancyRevenue = isPastOrCurrent ? mBilled : 0;
        const mFixedOverhead = isPastOrCurrent ? (this.settings.fixedPropertyOverhead ?? 4500) : 0;
        const mCAM = isPastOrCurrent ? (this.settings.commonAreaMaintenance ?? 1500) : 0;
        const mUtilityExpenses = isPastOrCurrent ? (mElec + mWaterPump + mCAM) : 0;
        const mOpEx = isPastOrCurrent ? (mFixedOverhead + mUtilityExpenses) : 0;
        const mSurplusDeficit = isPastOrCurrent ? (mOccupancyRevenue - mOpEx) : 0;
        const isNetProfit = mSurplusDeficit >= 0;
        const netProfit = mSurplusDeficit > 0 ? mSurplusDeficit : 0;
        const netLoss = mSurplusDeficit < 0 ? Math.abs(mSurplusDeficit) : 0;
        const mMargin = mOccupancyRevenue > 0 ? Math.round((mSurplusDeficit / mOccupancyRevenue) * 100) : 0;
        const collRate = mBilled > 0 && mCollected > 0 ? Math.round((mCollected / mBilled) * 100) : 0;

        monthlyBreakdown.push({
          monthKey,
          monthName: mName,
          occupiedUnits: isPastOrCurrent ? 7 : 0,
          totalUnits: 8,
          rentBilled: isPastOrCurrent ? mRent : 0,
          rentPaid: isPastOrCurrent ? mRentPaid : 0,
          electricityBilled: mElec,
          waterAndPumpBilled: mWaterPump,
          totalBilled: isPastOrCurrent ? mBilled : 0,
          totalCollected: mCollected,
          totalOccupancyRevenue: mOccupancyRevenue,
          totalUtilityExpenses: mUtilityExpenses,
          fixedPropertyOverhead: mFixedOverhead,
          operatingExpense: mOpEx,
          netSurplusDeficit: mSurplusDeficit,
          netProfitMargin: mMargin,
          netProfit,
          netLoss,
          isNetProfit,
          collectionRate: collRate,
          hasData: isPastOrCurrent,
        });

        if (isPastOrCurrent) {
          annualBilled += mBilled;
          annualCollected += mCollected;
          annualRentBilled += mRent;
          annualRentPaid += mRentPaid;
          annualElectricity += mElec;
          annualWaterAndPump += mWaterPump;
          annualOccupancyRevenue += mOccupancyRevenue;
          annualUtilityExpenses += mUtilityExpenses;
          annualFixedOverhead += mFixedOverhead;
          annualOpEx += mOpEx;
          totalOccupancyPercent += 87.5;
          recordedMonthsCount++;
        }
      }
    }

    const annualNetDiff = annualOccupancyRevenue - annualOpEx;
    const isNetProfit = annualNetDiff >= 0;
    const annualNetProfit = annualNetDiff > 0 ? annualNetDiff : 0;
    const annualNetLoss = annualNetDiff < 0 ? Math.abs(annualNetDiff) : 0;
    const annualNetProfitMargin = annualOccupancyRevenue > 0 ? Math.round((annualNetDiff / annualOccupancyRevenue) * 100) : 0;
    const averageOccupancy = recordedMonthsCount > 0 ? Math.round(totalOccupancyPercent / recordedMonthsCount) : 0;
    const averageCollectionRate = annualBilled > 0 ? Math.round((annualCollected / annualBilled) * 100) : 0;

    return {
      year,
      annualBilled,
      annualCollected,
      annualRentBilled,
      annualRentPaid,
      annualElectricity,
      annualWaterAndPump,
      annualOccupancyRevenue,
      annualUtilityExpenses,
      annualFixedOverhead,
      annualOperatingExpenses: annualOpEx,
      annualNetSurplusDeficit: annualNetDiff,
      annualNetProfitMargin,
      annualNetProfit,
      annualNetLoss,
      isNetProfit,
      averageOccupancy,
      averageCollectionRate,
      monthlyBreakdown,
    };
  }

  // Settings
  public async getSettings(): Promise<PropertySettings> {
    return { ...this.settings };
  }

  public async updateSettings(newSettings: Partial<PropertySettings>): Promise<PropertySettings> {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
    this.recalculate();
    return { ...this.settings };
  }

  // Add Tenant to Room
  public async addTenant(
    roomId: string,
    tenantData: { name: string; phone: string; email: string; moveInDate?: string; depositAmount?: number }
  ): Promise<Room> {
    const room = this.currentRooms.find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');

    room.status = 'Occupied';
    room.tenant = {
      id: `tenant-${Date.now()}`,
      name: tenantData.name,
      phone: tenantData.phone,
      email: tenantData.email,
      roomId: room.id,
      moveInDate: tenantData.moveInDate,
      depositAmount: tenantData.depositAmount,
    };

    this.recalculate();
    return { ...room };
  }
}

export const api = new ApiService();
