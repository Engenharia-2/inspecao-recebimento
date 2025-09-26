import { StateCreator } from 'zustand';
import { InspectionSession } from '../../report/types';
import { AppStore } from '../index';
import {
  createRelatorio,
  deleteRelatorio,
  fetchRelatorioById,
  fetchRelatorios,
    updateReportData,
  updateRelatorio,
} from '../../routes/apiService';

export interface SessionState {
  measurementSessions: InspectionSession[];
  currentSession: InspectionSession | null;
  isSessionsLoading: boolean;
  isAppReady: boolean;
}

export interface SessionActions {
  loadAllSessions: () => Promise<void>;
  startNewSession: () => Promise<number | null>;
  selectSession: (sessionId: number) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  endSession: (sessionId: number) => Promise<void>;
  updateSessionName: (sessionId: number, name: string) => Promise<void>;
  initApp: () => Promise<void>;
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
  isAppReady: false, // Inicializado como false
  initApp: async () => {
    try {
      await get().loadAllSessions();
      set({ isAppReady: true });
    } catch (error) {
      console.error("Failed to initialize app:", error);
      // Poderíamos adicionar um estado de erro aqui se necessário
    }
  },
  loadAllSessions: async () => {
    if (get().isSessionsLoading) return;
    set({ isSessionsLoading: true });
    try {
      const sessions = await fetchRelatorios();
      set({ measurementSessions: sessions as InspectionSession[] });
    } catch (err) {
      console.error("sessionSlice: Failed to load sessions:", err);
    } finally {
      set({ isSessionsLoading: false });
    }
  },
  startNewSession: async () => {
    try {
      const now = new Date();
      const sessionName = `Nova Inspeção ${now.toLocaleString('pt-BR')}`;
      const newRelatorio = await createRelatorio({ name: sessionName, startTime: now });
      if (newRelatorio && newRelatorio.id) {
        await get().loadAllSessions();
        await get().selectSession(newRelatorio.id);
        return newRelatorio.id;
      }
      return null;
    } catch (err) {
      console.error("sessionSlice: Failed to start new session:", err);
      return null;
    }
  },
  selectSession: async (sessionId) => {
    try {
      const session = await fetchRelatorioById(sessionId);
      if (session) {
                set({ currentSession: session as InspectionSession });
        get().loadReportForSession(session, session.id as number);
      }
    } catch (err) {
      console.error("sessionSlice: Failed to select session:", err);
    }
  },
  deleteSession: async (sessionId) => {
    try {
      await deleteRelatorio(sessionId);
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
    try {
      const now = new Date();
            await updateReportData(sessionId, { endTime: now });
      if (get().currentSession?.id === sessionId) {
        set({ currentSession: null });
      }
      await get().loadAllSessions();
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  },
    updateSessionName: async (sessionId, name) => {
      try {
        // Atualiza o nome no backend
        await updateReportData(sessionId, { name });
        // Atualiza o nome diretamente no estado local para evitar recarregar a lista
        set(state => ({
          measurementSessions: state.measurementSessions.map(session =>
            session.id === sessionId ? { ...session, name } : session
          )
        }));
      } catch (e) {
        console.error('Failed to update session name', e);
      }
    },});