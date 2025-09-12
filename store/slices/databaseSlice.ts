
import { StateCreator } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '../../database/initializeDatabase';
import { AppStore } from '../index';

export interface DatabaseState {
  db: SQLiteDatabase | null;
  isAppReady: boolean;
  dbError: string | null;
}

export interface DatabaseActions {
  initDb: () => Promise<void>;
}

export type DatabaseSlice = DatabaseState & DatabaseActions;

export const createDatabaseSlice: StateCreator<
  AppStore,
  [],
  [],
  DatabaseSlice
> = (set, get) => ({
  db: null,
  isAppReady: false,
  dbError: null,
  initDb: async () => {
    if (get().isAppReady) {
      return;
    }
    try {
      const database = await initializeDatabase();
      set({ db: database, dbError: null });
      console.log("Zustand Store: DB initialized.");

      // Now, load all sessions
      await get().loadAllSessions();
      console.log("Zustand Store: All sessions loaded.");

      // Everything is ready
      set({ isAppReady: true });

    } catch (err) {
      const errorMessage = `Failed to initialize app: ${err instanceof Error ? err.message : String(err)}`;
      set({ dbError: errorMessage, isAppReady: false });
      console.error("App Init Error: ", errorMessage);
    }
  },
});
