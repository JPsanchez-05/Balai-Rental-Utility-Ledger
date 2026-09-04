import {
  Room,
  RoomStatus,
  Payment,
  StatementItem,
  PropertySettings,
  DashboardMetrics,
  MonthlyTrendData,
  RevenueBreakdownData,
  YearlyReportData,
  YearlyMonthSummary,
} from './types.ts';

// Clean Initial Setup - No dummy test data or sample people
const INITIAL_SETTINGS: PropertySettings = {
  propertyName: 'Balai Rental Properties',
  landlordName: 'Property Admin',
  address: 'Metro Manila, Philippines',
  electricityRate: 11.5,
  waterRate: 85,
  monthlyWaterPumpFee: 1400,
  fixedPropertyOverhead: 0,
  commonAreaMaintenance: 0,
  monthlyOperatingExpense: 0,
  version: '1.0.0',
  totalRooms: 6,
  totalTenants: 0,
};

const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    roomNumber: 'Rm 1',
    floor: 1,
    monthlyRent: 6500,
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
  },
  {
    id: 'room-2',
    roomNumber: 'Rm 2',
    floor: 1,
    monthlyRent: 6500,
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
  },
  {
    id: 'room-3',
    roomNumber: 'Rm 3',
    floor: 2,
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
  },
  {
    id: 'room-4',
    roomNumber: 'Rm 4',
    floor: 2,
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
  },
  {
    id: 'room-5',
    roomNumber: 'Rm 5',
    floor: 3,
    monthlyRent: 8000,
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
  },
  {
    id: 'room-6',
    roomNumber: 'Rm 6',
    floor: 3,
    monthlyRent: 8000,
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
  },
];

const INITIAL_PAYMENTS: Payment[] = [];

const INITIAL_TRENDS: MonthlyTrendData[] = [];

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
      const storedMonths = localStorage.getItem('rental_ledger_months_v4') || localStorage.getItem('rental_ledger_months_v3');
      const storedMonthList = localStorage.getItem('rental_ledger_month_list_v4') || localStorage.getItem('rental_ledger_month_list_v3');
      const storedActiveMonth = localStorage.getItem('rental_ledger_active_month_v4') || localStorage.getItem('rental_ledger_active_month_v3');
      const storedSettings = localStorage.getItem('rental_ledger_settings');

      if (storedMonths) {
        this.months = JSON.parse(storedMonths);

        // Automatically detect and purge any legacy dummy test people (Ana Reyes, Carlo Mendoza, etc.)
        const hasDummyTestPeople = Object.values(this.months).some((m) =>
          m.rooms.some((r) =>
            r.tenant?.name === 'Ana Reyes' ||
            r.tenant?.name === 'Carlo Mendoza' ||
            r.tenant?.name === 'Maribel Santos' ||
            r.tenant?.name === 'Rosalinda Cruz' ||
            r.tenant?.name === 'Jayson Flores' ||
            r.tenant?.name === 'Michael Tan' ||
            r.tenant?.name === 'Grace Villanueva'
          )
        );

        if (hasDummyTestPeople) {
          Object.keys(this.months).forEach((mKey) => {
            this.months[mKey].payments = [];
            this.months[mKey].rooms = this.months[mKey].rooms.map((r) => ({
              ...r,
              tenant: undefined,
              status: 'Available' as RoomStatus,
              billed: 0,
              collected: 0,
              balance: 0,
              paymentStatus: 'Paid',
              meterReading: {
                previousElectricity: 0,
                currentElectricity: 0,
                previousWater: 0,
                currentWater: 0,
              },
            }));
          });
        }
      } else {
        this.months = { 'Aug 2026': { rooms: INITIAL_ROOMS, payments: INITIAL_PAYMENTS } };
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
      localStorage.setItem('rental_ledger_months_v4', JSON.stringify(this.months));
      localStorage.setItem('rental_ledger_month_list_v4', JSON.stringify(this.monthList));
      localStorage.setItem('rental_ledger_active_month_v4', this.activeMonth);
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
      const cleanRooms = JSON.parse(JSON.stringify(INITIAL_ROOMS)).map((r: Room) => ({
        ...r,
        collected: 0,
        balance: r.status === 'Occupied' ? r.monthlyRent : 0,
        paymentStatus: r.status === 'Occupied' ? 'Unpaid' : 'Paid',
      }));
      this.months[monthKey] = {
        rooms: cleanRooms,
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

    // Formula: Net Profit/Loss = Total Rental Revenue (Rent) - Property Operating Expenses (Fixed Overhead + CAM)
    // Utility bills are tenant pass-through reimbursements and do not count as landlord rental revenue or profit.
    const totalOccupancyRevenue = totalRentBilled;
    
    // Total Utility Expenses & Property Operating Expenses
    const fixedPropertyOverhead = this.settings.fixedPropertyOverhead ?? 0;
    const commonAreaMaintenance = this.settings.commonAreaMaintenance ?? 0;
    const totalUtilityExpenses =
      this.settings.customUtilitiesExpense !== undefined
        ? this.settings.customUtilitiesExpense
        : totalUtilitiesBilled + (this.settings.monthlyWaterPumpFee || 0) + commonAreaMaintenance;
    
    // Total Monthly Operating Expenses: Fixed Property Overhead + Utilities/Maintenance
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

  public async updateRoom(
    roomId: string,
    updates: {
      roomNumber?: string;
      floor?: number;
      monthlyRent?: number;
      status?: RoomStatus;
    }
  ): Promise<Room> {
    const room = this.currentRooms.find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');

    if (updates.roomNumber !== undefined) room.roomNumber = updates.roomNumber;
    if (updates.floor !== undefined) room.floor = Number(updates.floor);
    if (updates.monthlyRent !== undefined) room.monthlyRent = Number(updates.monthlyRent);
    if (updates.status !== undefined) room.status = updates.status;

    // Propagate changes to other months so property layout stays consistent
    Object.keys(this.months).forEach((mKey) => {
      const target = this.months[mKey].rooms.find((r) => r.id === roomId);
      if (target) {
        if (updates.roomNumber !== undefined) target.roomNumber = updates.roomNumber;
        if (updates.floor !== undefined) target.floor = Number(updates.floor);
        if (updates.monthlyRent !== undefined) target.monthlyRent = Number(updates.monthlyRent);
      }
    });

    this.recalculate();
    return { ...room };
  }

  public async deleteRoom(roomId: string): Promise<void> {
    // Remove from active month and all stored months
    Object.keys(this.months).forEach((mKey) => {
      this.months[mKey].rooms = this.months[mKey].rooms.filter((r) => r.id !== roomId);
      this.months[mKey].payments = this.months[mKey].payments.filter((p) => p.roomId !== roomId);
    });
    this.settings.totalRooms = this.currentRooms.length;
    this.recalculate();
  }

  public async clearTestData(): Promise<void> {
    // Purge all dummy tenants, test payments, and reset balances
    Object.keys(this.months).forEach((mKey) => {
      this.months[mKey].payments = [];
      this.months[mKey].rooms.forEach((room) => {
        room.tenant = undefined;
        room.status = 'Available';
        room.billed = 0;
        room.collected = 0;
        room.balance = 0;
        room.paymentStatus = 'Paid';
        room.meterReading = {
          previousElectricity: 0,
          currentElectricity: 0,
          previousWater: 0,
          currentWater: 0,
        };
      });
    });
    this.settings.totalTenants = 0;
    this.saveToStorage();
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
          dueDate: `7th of ${this.activeMonth || 'Sep 2026'}`,
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
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const keys = Object.keys(this.months);
    if (keys.length === 0) {
      return [];
    }

    const sortedKeys = [...keys].sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      if (aYear !== bYear) return Number(aYear) - Number(bYear);
      return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
    });

    return sortedKeys.map((key) => {
      const store = this.months[key];
      const occupied = store?.rooms?.filter((r) => r.status === 'Occupied' && r.tenant) || [];
      const billed = occupied.reduce((sum, r) => sum + r.billed, 0);
      const collected = occupied.reduce((sum, r) => sum + r.collected, 0);
      return {
        month: key.split(' ')[0],
        billed,
        collected,
        outstanding: Math.max(0, billed - collected),
      };
    });
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
    const monthlyBreakdown: YearlyMonthSummary[] = [];

    let annualBilled = 0;
    let annualCollected = 0;
    let annualRentBilled = 0;
    let annualRentPaid = 0;
    let annualElectricity = 0;
    let annualWaterAndPump = 0;
    let annualOccupancyRevenue = 0;
    let annualUtilityExpenses = 0;
    let annualFixedOverhead = 0;
    let annualOpEx = 0;
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

        const mOccupancyRevenue = mRent;
        const mFixedOverhead = this.settings.fixedPropertyOverhead ?? 0;
        const mCAM = this.settings.commonAreaMaintenance ?? 0;
        const mUtilityExpenses =
          this.settings.customUtilitiesExpense !== undefined
            ? this.settings.customUtilitiesExpense
            : mElec + mWaterPump + mCAM;
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
          totalUnits: storeMonth.rooms.length || this.settings.totalRooms || 6,
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
        // Unrecorded month with no manual entry
        monthlyBreakdown.push({
          monthKey,
          monthName: mName,
          occupiedUnits: 0,
          totalUnits: this.settings.totalRooms || 6,
          rentBilled: 0,
          rentPaid: 0,
          electricityBilled: 0,
          waterAndPumpBilled: 0,
          totalBilled: 0,
          totalCollected: 0,
          totalOccupancyRevenue: 0,
          totalUtilityExpenses: 0,
          fixedPropertyOverhead: 0,
          operatingExpense: 0,
          netSurplusDeficit: 0,
          netProfitMargin: 0,
          netProfit: 0,
          netLoss: 0,
          isNetProfit: true,
          collectionRate: 0,
          hasData: false,
        });
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
    this.saveToStorage();
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
