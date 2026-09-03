import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Initialize PostgreSQL Pool if DATABASE_URL is available
const connectionString = process.env.DATABASE_URL;
let pgPool: Pool | null = null;
if (connectionString) {
  try {
    const isSupabase = connectionString.includes('supabase');
    pgPool = new Pool({
      connectionString,
      max: 10,
      connectionTimeoutMillis: 5000,
      ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    });
    pgPool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });
  } catch (e) {
    console.warn('Could not initialize pgPool:', e);
  }
}

// In-memory fallback store matching initial mock data
let memorySettings = {
  propertyName: 'Dela Cruz Apartelle',
  landlordName: 'Rodrigo Dela Cruz',
  address: '123 Mabini St., Quezon City, Metro Manila',
  electricityRate: 11.5,
  waterRate: 85,
  monthlyWaterPumpFee: 1400,
  fixedPropertyOverhead: 4500,
  commonAreaMaintenance: 1500,
  monthlyOperatingExpense: 12000,
  version: '1.0.0',
  totalRooms: 8,
  totalTenants: 7,
};

let memoryRooms = [
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
      name: 'Dante Villamor',
      phone: '0922-111-9898',
      email: 'dante.v@gmail.com',
      roomId: 'room-6',
    },
    meterReading: {
      previousElectricity: 11200,
      currentElectricity: 11350,
      previousWater: 2900,
      currentWater: 2915,
    },
    billed: 9937.5,
    collected: 9937.5,
    balance: 0,
    paymentStatus: 'Paid',
  },
  {
    id: 'room-7',
    roomNumber: 'Rm 7',
    floor: 3,
    monthlyRent: 8500,
    status: 'Occupied',
    tenant: {
      id: 'tenant-7',
      name: 'Elena Gomez',
      phone: '0928-333-7766',
      email: 'elena.gomez@yahoo.com',
      roomId: 'room-7',
    },
    meterReading: {
      previousElectricity: 9500,
      currentElectricity: 9680,
      previousWater: 2400,
      currentWater: 2420,
    },
    billed: 12220,
    collected: 12220,
    balance: 0,
    paymentStatus: 'Paid',
  },
  {
    id: 'room-8',
    roomNumber: 'Rm 8',
    floor: 3,
    monthlyRent: 8500,
    status: 'Vacant',
    meterReading: {
      previousElectricity: 4500,
      currentElectricity: 4500,
      previousWater: 1100,
      currentWater: 1100,
    },
    billed: 0,
    collected: 0,
    balance: 0,
    paymentStatus: 'Paid',
  },
];

let memoryPayments = [
  {
    id: 'pay-1',
    roomId: 'room-1',
    tenantName: 'Ana Reyes',
    amount: 8409,
    date: '2026-08-05',
    method: 'GCash',
    notes: 'Partial payment for August rent & utilities',
    month: 'Aug 2026',
  },
  {
    id: 'pay-2',
    roomId: 'room-2',
    tenantName: 'Carlo Mendoza',
    amount: 6500,
    date: '2026-08-03',
    method: 'Bank Transfer',
    notes: 'Base rent paid',
    month: 'Aug 2026',
  },
  {
    id: 'pay-3',
    roomId: 'room-3',
    tenantName: 'Maribel Santos',
    amount: 12076,
    date: '2026-08-04',
    method: 'Cash',
    notes: 'Partial payment',
    month: 'Aug 2026',
  },
  {
    id: 'pay-4',
    roomId: 'room-5',
    tenantName: 'Rosalinda Cruz',
    amount: 10000,
    date: '2026-08-02',
    method: 'Bank Transfer',
    notes: 'Rent deposit',
    month: 'Aug 2026',
  },
  {
    id: 'pay-5',
    roomId: 'room-6',
    tenantName: 'Dante Villamor',
    amount: 9937.5,
    date: '2026-08-01',
    method: 'GCash',
    notes: 'Full August settlement',
    month: 'Aug 2026',
  },
  {
    id: 'pay-6',
    roomId: 'room-7',
    tenantName: 'Elena Gomez',
    amount: 12220,
    date: '2026-08-01',
    method: 'Bank Transfer',
    notes: 'Full August settlement',
    month: 'Aug 2026',
  },
];

let memoryExpenses = [
  {
    id: 'exp-1',
    title: 'Water Pump Repair & Maintenance',
    category: 'Repairs',
    amount: 2500,
    date: '2026-08-10',
    notes: 'Replaced pressure valve switch',
    month: 'Aug 2026',
  },
  {
    id: 'exp-2',
    title: 'Common Area LED Lighting',
    category: 'Maintenance',
    amount: 1200,
    date: '2026-08-12',
    notes: 'Corridor lights replacement',
    month: 'Aug 2026',
  },
  {
    id: 'exp-3',
    title: 'Monthly Pest Control Service',
    category: 'Admin',
    amount: 1800,
    date: '2026-08-15',
    notes: 'Whole building treatment',
    month: 'Aug 2026',
  },
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: pgPool ? "connected" : "in-memory" });
});

app.get("/api/settings", (req, res) => {
  res.json(memorySettings);
});

app.put("/api/settings", (req, res) => {
  memorySettings = { ...memorySettings, ...req.body };
  res.json(memorySettings);
});

app.get("/api/rooms", (req, res) => {
  res.json(memoryRooms);
});

app.post("/api/rooms", (req, res) => {
  const newRoom = { ...req.body, id: `room-${Date.now()}` };
  memoryRooms.push(newRoom);
  res.json(newRoom);
});

app.put("/api/rooms/:id", (req, res) => {
  const { id } = req.params;
  const index = memoryRooms.findIndex((r) => r.id === id);
  if (index !== -1) {
    memoryRooms[index] = { ...memoryRooms[index], ...req.body };
    res.json(memoryRooms[index]);
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

app.delete("/api/rooms/:id", (req, res) => {
  const { id } = req.params;
  memoryRooms = memoryRooms.filter((r) => r.id !== id);
  res.json({ success: true });
});

app.get("/api/payments", (req, res) => {
  res.json(memoryPayments);
});

app.post("/api/payments", (req, res) => {
  const newPayment = { ...req.body, id: `pay-${Date.now()}` };
  memoryPayments.unshift(newPayment);

  // Update room balance/collected if room found
  const room = memoryRooms.find((r) => r.id === newPayment.roomId);
  if (room) {
    room.collected = (room.collected || 0) + Number(newPayment.amount);
    room.balance = Math.max(0, (room.billed || 0) - room.collected);
    if (room.balance === 0) {
      room.paymentStatus = 'Paid';
    } else if (room.collected > 0) {
      room.paymentStatus = 'Partial';
    }
  }

  res.json(newPayment);
});

app.get("/api/expenses", (req, res) => {
  res.json(memoryExpenses);
});

app.post("/api/expenses", (req, res) => {
  const newExp = { ...req.body, id: `exp-${Date.now()}` };
  memoryExpenses.unshift(newExp);
  res.json(newExp);
});

app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  memoryExpenses = memoryExpenses.filter((e) => e.id !== id);
  res.json({ success: true });
});

// Vite middleware setup for development, static for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
