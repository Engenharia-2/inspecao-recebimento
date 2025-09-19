
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';

const SCHEMA_VERSION = 2; // Incremented schema version

/**
 * Abre a conexão com o banco de dados SQLite, executa migrações e inicializa as tabelas.
 */
export const initializeDatabase = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync('inspecao_recebimento.db');
  const SCHEMA_VERSION = 2; // Incremented schema version

  // Enable WAL mode outside of a transaction
  await db.execAsync('PRAGMA journal_mode = WAL;');

  await db.withTransactionAsync(async () => {
    const { user_version: currentVersion } = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

    if (currentVersion < SCHEMA_VERSION) {
      // Initial schema creation for version 0
      if (currentVersion < 1) {
        await db.execAsync(
          `
          CREATE TABLE IF NOT EXISTS inspection_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_time TEXT NOT NULL,
            end_time TEXT
          );

          CREATE TABLE IF NOT EXISTS entry_data (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_id INTEGER NOT NULL UNIQUE,
              op TEXT, openDate TEXT, serialNumber TEXT, model TEXT, orderType TEXT, invoice TEXT, entryTechnician TEXT, returnItems TEXT,
              FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS assistance_data (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_id INTEGER NOT NULL UNIQUE,
              cleanCheck_equipmentCleaning BOOLEAN, cleanCheck_screws BOOLEAN, cleanCheck_hotGlue BOOLEAN, cleanCheck_measurementCables BOOLEAN,
              defect_part TEXT, defect_cause TEXT, defect_solution TEXT, defect_observations TEXT, assistanceTechnician TEXT,
              workingCheck_powerOn BOOLEAN, workingCheck_buttonsLeds BOOLEAN, workingCheck_predefinedTests BOOLEAN, workingCheck_screen BOOLEAN, workingCheck_caseMembranes BOOLEAN,
              FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS quality_data (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_id INTEGER NOT NULL UNIQUE,
              finalCheck_case BOOLEAN, finalCheck_membrane BOOLEAN, finalCheck_buttons BOOLEAN, finalCheck_screen BOOLEAN, finalCheck_test BOOLEAN,
              finalCheck_saveReports BOOLEAN, finalCheck_calibrationPrint BOOLEAN, finalCheck_backup BOOLEAN,
              qualityTechnician TEXT, qualityObservations TEXT,
              FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS attached_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            stage TEXT NOT NULL,
            uri TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS custom_report_fields (
              id TEXT PRIMARY KEY NOT NULL,
              session_id INTEGER NOT NULL,
              title TEXT NOT NULL,
              value TEXT,
              FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
          );
        `
        );
        console.log('Database: Initial tables created.');
      }

      // Migration for version 2: Add 'name' column to inspection_sessions
      if (currentVersion < 2) {
        try {
          await db.execAsync(`ALTER TABLE inspection_sessions ADD COLUMN name TEXT NOT NULL DEFAULT ''`);
          console.log('Database Migration: Column \'name\' added to \'inspection_sessions\'.');
        } catch (e) {
          // This can happen if the user has an old version of the database and the column was added manually
          if (!e.message.includes('duplicate column name')) {
            console.error("Migration Error: Failed to add column 'name':", e);
            throw e; // Re-throw if it's not a duplicate column error
          }
        }
      }

      // Update the database version to the latest
      await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
      console.log(`Database: Schema migrated to version ${SCHEMA_VERSION}.`);
    }
  });

  console.log('Database: Connection established and schema is up-to-date.');
  return db;
};


