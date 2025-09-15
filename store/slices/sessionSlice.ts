
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
  updateSessionName: (sessionId: number, name: string) => Promise<void>;
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
      const sessions = await db.getAllAsync<InspectionSession>(
        `SELECT 
          s.id, 
          s.name as name, 
          s.start_time as startTime, 
          s.end_time as endTime 
         FROM inspection_sessions s
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
      const sessionName = `Nova Inspeção ${new Date().toLocaleString('pt-BR')}`;
      const result = await db.runAsync(
        `INSERT INTO inspection_sessions (name, start_time, end_time) VALUES (?, ?, ?)`,
        sessionName,
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
      const session = await db.getFirstAsync<InspectionSession>(
        `SELECT 
          s.id, 
          s.name as name,
          s.start_time as startTime, 
          s.end_time as endTime 
         FROM inspection_sessions s
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
  updateSessionName: async (sessionId, name) => {
    const db = get().db;
    if (!db) return;

    try {
      await db.runAsync('UPDATE inspection_sessions SET name = ? WHERE id = ?', name, sessionId);
      await get().loadAllSessions();
    } catch (e) {
      console.error('Failed to update session name', e);
    }
  },
});
