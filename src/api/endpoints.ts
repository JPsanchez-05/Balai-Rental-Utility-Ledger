/**
 * API Endpoints Configuration
 * Use this module to configure base URLs and endpoints for backend integration.
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL) ||
  '/api/v1';

export const ENDPOINTS = {
  // Authentication & Property Info
  PROPERTY_SETTINGS: `${API_BASE_URL}/settings`,
  
  // Rooms & Tenants
  ROOMS: `${API_BASE_URL}/rooms`,
  ROOM_BY_ID: (id: string) => `${API_BASE_URL}/rooms/${id}`,
  TENANTS: `${API_BASE_URL}/tenants`,
  TENANT_BY_ID: (id: string) => `${API_BASE_URL}/tenants/${id}`,

  // Meter Readings
  METER_READINGS: `${API_BASE_URL}/meter-readings`,
  UPDATE_METER_READING: (roomId: string) => `${API_BASE_URL}/meter-readings/${roomId}`,

  // Payments & Ledger
  PAYMENTS: `${API_BASE_URL}/payments`,
  PAYMENT_BY_ID: (id: string) => `${API_BASE_URL}/payments/${id}`,

  // Statements & Invoicing
  STATEMENTS: `${API_BASE_URL}/statements`,
  STATEMENT_BY_ROOM: (roomId: string, month: string) => `${API_BASE_URL}/statements/${roomId}?month=${month}`,

  // Dashboard & Analytics Reports
  DASHBOARD_METRICS: `${API_BASE_URL}/dashboard/metrics`,
  COLLECTIONS_TREND: `${API_BASE_URL}/reports/trends`,
  REVENUE_BREAKDOWN: `${API_BASE_URL}/reports/revenue-breakdown`,
  EXPORT_REPORTS: (format: 'csv' | 'pdf', month: string) => `${API_BASE_URL}/reports/export?format=${format}&month=${month}`,
};
