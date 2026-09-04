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

    // Auto-ensure Row Level Security (RLS) is enabled on Supabase / PostgreSQL tables
    pgPool.query(`
      ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;
    `).then(() => {
      console.log('Row Level Security (RLS) verified on public tables.');
    }).catch((err) => {
      console.warn('Note on RLS check:', err?.message || err);
    });
  } catch (e) {
    console.warn('Could not initialize pgPool:', e);
  }
}

// In-memory fallback store matching initial mock data
let memorySettings = {
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

let memoryRooms: any[] = [
  {
    id: 'room-1',
    roomNumber: 'Rm 1',
    floor: 1,
    monthlyRent: 6500,
    status: 'Available',
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

let memoryPayments: any[] = [];

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

app.post("/api/clear-test-data", (req, res) => {
  memoryRooms = memoryRooms.map((r) => ({
    ...r,
    tenant: undefined,
    status: 'Available',
    billed: 0,
    collected: 0,
    balance: 0,
    paymentStatus: 'Paid',
    meterReading: { previousElectricity: 0, currentElectricity: 0, previousWater: 0, currentWater: 0 },
  }));
  memoryPayments = [];
  res.json({ success: true, message: 'Test data cleared successfully' });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
