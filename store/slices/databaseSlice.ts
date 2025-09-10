
import { StateCreator } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '../../database/initializeDatabase';
import { AppStore } from '../index';

export interface DatabaseState {
  db: SQLiteDatabase | null;
  isDbLoading: boolean;
  isDbReady: boolean;
  dbError: string | null;
}

export interface DatabaseActions {
  initDb: (onDbReady: () => void) => Promise<void>;
}

export type DatabaseSlice = DatabaseState & DatabaseActions;

export const createDatabaseSlice: StateCreator<
  AppStore,
  [],
  [],
  DatabaseSlice
> = (set, get) => ({
  db: null,
  isDbLoading: true,
  isDbReady: false,
  dbError: null,
  initDb: async (onDbReady) => {
    if (get().isDbReady) {
        onDbReady();
        return;
    }
    set({ isDbLoading: true });
    try {
      const database = await initializeDatabase();
      set({ db: database, isDbReady: true, dbError: null });
      console.log("Zustand Store: DB initialized.");
      onDbReady();
    } catch (err) {
      const errorMessage = `Failed to initialize database: ${err instanceof Error ? err.message : String(err)}`;
      set({ dbError: errorMessage, isDbReady: false });
      console.error("DB Error: ", errorMessage);
    } finally {
      set({ isDbLoading: false });
    }
  },
});
