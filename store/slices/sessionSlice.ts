
import { StateCreator } from 'zustand';
import { InspectionSession } from '../../report/types';
import { AppStore } from '../index';

export interface SessionState {
  measurementSessions: InspectionSession[];
  currentSession: InspectionSession | null;
  isSessionsLoading: boolean;
}

export interface SessionActions {
  loadAllSessions: () => Promise<void>;
  startNewSession: () => Promise<number | null>;
  selectSession: (sessionId: number) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  endSession: (sessionId: number) => Promise<void>;
}

export type SessionSlice = SessionState & SessionActions;

export const createSessionSlice: StateCreator<
  AppStore,
  [],
  [],
  SessionSlice
> = (set, get) => ({
  measurementSessions: [],
  currentSession: null,
  isSessionsLoading: false,
  loadAllSessions: async () => {
    if (get().isSessionsLoading) return; // Prevent concurrent reloads
    const db = get().db;
    if (!db) return;
    set({ isSessionsLoading: true });
    try {
      // Modificado para buscar 'op' da tabela 'entry_data'
      const sessions = await db.getAllAsync<InspectionSession>(
        `SELECT 
          s.id, 
          ed.op as name, -- Usa 'op' como 'name' para compatibilidade
          s.start_time as startTime, 
          s.end_time as endTime 
         FROM inspection_sessions s
         LEFT JOIN entry_data ed ON s.id = ed.session_id
         ORDER BY s.start_time DESC`
      );
      set({ measurementSessions: sessions });
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      set({ isSessionsLoading: false });
    }
  },
  startNewSession: async () => {
    const db = get().db;
    if (!db) return null;
    try {
      const now = new Date().toISOString();
      // Removido 'name' e 'sessionName'
      const result = await db.runAsync(
        `INSERT INTO inspection_sessions (start_time, end_time) VALUES (?, ?)`,
        now, null
      );
      const newSessionId = result.lastInsertRowId;
      if (newSessionId) {
        await db.runAsync(`INSERT INTO entry_data (session_id) VALUES (?)`, newSessionId);
        await db.runAsync(`INSERT INTO assistance_data (session_id) VALUES (?)`, newSessionId);
        await db.runAsync(`INSERT INTO quality_data (session_id) VALUES (?)`, newSessionId);
        
        await get().loadAllSessions();
        await get().selectSession(newSessionId);
        return newSessionId;
      }
      return null;
    } catch (err) {
      console.error("Failed to start new session:", err);
      return null;
    }
  },
  selectSession: async (sessionId) => {
    const db = get().db;
    if (!db) return;
    try {
      // Modificado para buscar 'op' da tabela 'entry_data'
      const session = await db.getFirstAsync<InspectionSession>(
        `SELECT 
          s.id, 
          ed.op as name, -- Usa 'op' como 'name'
          s.start_time as startTime, 
          s.end_time as endTime 
         FROM inspection_sessions s
         LEFT JOIN entry_data ed ON s.id = ed.session_id
         WHERE s.id = ?`,
        sessionId
      );
      if (session) {
        set({ currentSession: session });
        get().loadReportForSession(session.id);
      }
    } catch (err) {
      console.error("Failed to select session:", err);
    }
  },
  deleteSession: async (sessionId) => {
    const db = get().db;
    if (!db) return;
    try {
      await db.runAsync(`DELETE FROM inspection_sessions WHERE id = ?`, sessionId);
      if (get().currentSession?.id === sessionId) {
        set({ currentSession: null });
        get().resetReportState();
      }
      await get().loadAllSessions();
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  },
  endSession: async (sessionId) => {
    const db = get().db;
    if (!db) return;
    try {
      const now = new Date().toISOString();
      await db.runAsync(`UPDATE inspection_sessions SET end_time = ? WHERE id = ?`, now, sessionId);
      if (get().currentSession?.id === sessionId) {
        set({ currentSession: null });
      }
      await get().loadAllSessions();
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  },
});
