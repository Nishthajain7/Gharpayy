// hooks/useAppStore.ts
import React, { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';
import {
  Lead, Agent, Property,
  SEED_LEADS, SEED_AGENTS, SEED_PROPERTIES,
  genId, nowISO,
} from '@/constants/theme';

// ── State ─────────────────────────────────────────────────────────────────────

interface AppState {
  leads:      Lead[];
  agents:     Agent[];
  properties: Property[];
  rrIndex:    number;
}

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_LEAD';    payload: Partial<Lead> }
  | { type: 'UPDATE_LEAD'; payload: { id: string; updates: Partial<Lead> } }
  | { type: 'ADD_NOTE';    payload: { id: string; text: string } };

// ── Reducer ───────────────────────────────────────────────────────────────────

const initialState: AppState = {
  leads:      SEED_LEADS,
  agents:     SEED_AGENTS,
  properties: SEED_PROPERTIES,
  rrIndex:    0,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {

    case 'ADD_LEAD': {
      const agentId = state.agents[state.rrIndex % state.agents.length].id;
      const lead: Lead = {
        id:              genId(),
        name:            '',
        phone:           '',
        source:          '',
        stage:           'New Lead',
        agentId,
        budget:          0,
        location:        '',
        createdAt:       nowISO(),
        lastActivity:    nowISO(),
        firstResponseAt: null,
        visitDate:       null,
        visitProperty:   null,
        visitOutcome:    null,
        notes:           [],
        ...action.payload,
      };
      return {
        ...state,
        leads:   [lead, ...state.leads],
        rrIndex: state.rrIndex + 1,
      };
    }

    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(l =>
          l.id === action.payload.id
            ? { ...l, ...action.payload.updates, lastActivity: nowISO() }
            : l
        ),
      };

    case 'ADD_NOTE':
      return {
        ...state,
        leads: state.leads.map(l =>
          l.id === action.payload.id
            ? {
                ...l,
                lastActivity: nowISO(),
                notes: [...(l.notes ?? []), { text: action.payload.text, at: nowISO() }],
              }
            : l
        ),
      };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface ContextValue {
  state:    AppState;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore(): ContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used inside <AppProvider>');
  return ctx;
}