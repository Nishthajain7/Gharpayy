export const COLORS = {
  bg:          '#080a10',
  surface:     '#0f1117',
  surface2:    '#1a1f2e',
  border:      '#1e2130',
  border2:     '#2a3045',
  text:        '#f1f5f9',
  textSub:     '#94a3b8',
  textMuted:   '#475569',
  textDim:     '#334155',
  primary:     '#6366f1',
  primarySoft: '#8b5cf6',
  success:     '#10b981',
  warning:     '#f59e0b',
  danger:      '#ef4444',
  pink:        '#ec4899',
};

export const STAGES = [
  'New Lead',
  'Contacted',
  'Requirement Collected',
  'Property Suggested',
  'Visit Scheduled',
  'Visit Completed',
  'Booked',
  'Lost',
] as const;

export type Stage = typeof STAGES[number];

export const STAGE_COLORS: Record<Stage, string> = {
  'New Lead':               '#6366f1',
  'Contacted':              '#8b5cf6',
  'Requirement Collected':  '#a855f7',
  'Property Suggested':     '#ec4899',
  'Visit Scheduled':        '#f59e0b',
  'Visit Completed':        '#10b981',
  'Booked':                 '#059669',
  'Lost':                   '#ef4444',
};

export const SOURCES = [
  'WhatsApp',
  'Website Form',
  'Instagram',
  'Facebook',
  'Phone Call',
  'Referral',
] as const;

export const VISIT_OUTCOMES = ['Booked', 'Considering', 'Not Interested'] as const;

export interface Note {
  text: string;
  at: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  active: boolean;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  rent: number;
  type: 'Single' | 'Shared';
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  stage: Stage;
  agentId: string;
  budget: number;
  location: string;
  createdAt: string;
  lastActivity: string;
  firstResponseAt: string | null;
  visitDate: string | null;
  visitProperty: string | null;
  visitOutcome: string | null;
  notes: Note[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function hoursAgo(iso: string): number {
  return Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
}

export function minutesDiff(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60_000);
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const d = (daysAgo: number) =>
  new Date(Date.now() - 86_400_000 * daysAgo).toISOString();
const h = (hoursAgo: number) =>
  new Date(Date.now() - 3_600_000 * hoursAgo).toISOString();

export const SEED_AGENTS: Agent[] = [
  { id: 'a1', name: 'Priya Sharma',  avatar: 'PS', active: true },
  { id: 'a2', name: 'Rohan Mehta',   avatar: 'RM', active: true },
  { id: 'a3', name: 'Sneha Kapoor',  avatar: 'SK', active: true },
];

export const SEED_PROPERTIES: Property[] = [
  { id: 'p1', name: 'Koramangala Block 5',   location: 'Koramangala', rent: 9500,  type: 'Single' },
  { id: 'p2', name: 'HSR Layout Sector 2',   location: 'HSR Layout',  rent: 8000,  type: 'Shared' },
  { id: 'p3', name: 'Indiranagar 12th Main', location: 'Indiranagar', rent: 11000, type: 'Single' },
  { id: 'p4', name: 'BTM Layout 2nd Stage',  location: 'BTM Layout',  rent: 7500,  type: 'Shared' },
];

export const SEED_LEADS: Lead[] = [
  {
    id: 'l1', name: 'Amit Verma',  phone: '9876543210', source: 'WhatsApp',
    stage: 'Visit Scheduled', agentId: 'a1',
    createdAt: d(2), lastActivity: h(5),
    budget: 9000, location: 'Koramangala',
    visitDate: new Date(Date.now() + 86_400_000).toISOString(),
    visitProperty: 'p1', visitOutcome: null,
    firstResponseAt: new Date(new Date(d(2)).getTime() + 240_000).toISOString(),
    notes: [{ text: 'Looking for AC room, ground floor preferred.', at: d(1) }],
  },
  {
    id: 'l2', name: 'Divya Nair',  phone: '9123456780', source: 'Website Form',
    stage: 'Requirement Collected', agentId: 'a2',
    createdAt: d(1), lastActivity: h(2),
    budget: 8500, location: 'HSR Layout',
    visitDate: null, visitProperty: null, visitOutcome: null,
    firstResponseAt: new Date(new Date(d(1)).getTime() + 180_000).toISOString(),
    notes: [],
  },
  {
    id: 'l3', name: 'Karan Singh', phone: '9988776655', source: 'Instagram',
    stage: 'Booked', agentId: 'a3',
    createdAt: d(5), lastActivity: d(1),
    budget: 11000, location: 'Indiranagar',
    visitDate: d(2), visitProperty: 'p3', visitOutcome: 'Booked',
    firstResponseAt: new Date(new Date(d(5)).getTime() + 120_000).toISOString(),
    notes: [{ text: 'Token collected. Moving in on 15th.', at: d(1) }],
  },
  {
    id: 'l4', name: 'Meera Joshi', phone: '8765432109', source: 'Phone Call',
    stage: 'New Lead', agentId: 'a1',
    createdAt: h(0.1), lastActivity: h(0.1),
    budget: 7000, location: 'BTM Layout',
    visitDate: null, visitProperty: null, visitOutcome: null,
    firstResponseAt: null,
    notes: [],
  },
  {
    id: 'l5', name: 'Rahul Gupta', phone: '7654321098', source: 'Facebook',
    stage: 'Contacted', agentId: 'a2',
    createdAt: d(3), lastActivity: d(2),
    budget: 9000, location: 'Koramangala',
    visitDate: null, visitProperty: null, visitOutcome: null,
    firstResponseAt: new Date(new Date(d(3)).getTime() + 300_000).toISOString(),
    notes: [],
  },
  {
    id: 'l6', name: 'Pooja Reddy', phone: '6543210987', source: 'WhatsApp',
    stage: 'Lost', agentId: 'a3',
    createdAt: d(7), lastActivity: d(4),
    budget: 8000, location: 'HSR Layout',
    visitDate: null, visitProperty: null, visitOutcome: null,
    firstResponseAt: new Date(new Date(d(7)).getTime() + 900_000).toISOString(),
    notes: [],
  },
];
