
// database/initializeDatabase.ts
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Abre a conexão com o banco de dados SQLite e inicializa as tabelas.
 */
export const initializeDatabase = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync('inspecao_recebimento.db');

  await db.execAsync(
    `PRAGMA journal_mode = WAL;

    -- Tabela principal para as sessões de inspeção
    CREATE TABLE IF NOT EXISTS inspection_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT
    );

    -- Tabela para os dados da etapa de Entrada
    CREATE TABLE IF NOT EXISTS entry_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL UNIQUE, -- Garante uma linha por sessão
        op TEXT,
        openDate TEXT,
        serialNumber TEXT,
        model TEXT,
        orderType TEXT,
        invoice TEXT,
        entryTechnician TEXT,
        returnItems TEXT, -- Stored as JSON string
        FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
    );

    -- Tabela para os dados da etapa de Assistência
    CREATE TABLE IF NOT EXISTS assistance_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL UNIQUE,
        cleanCheck_equipmentCleaning BOOLEAN,
        cleanCheck_screws BOOLEAN,
        cleanCheck_hotGlue BOOLEAN,
        cleanCheck_measurementCables BOOLEAN,
        defect_part TEXT,
        defect_cause TEXT,
        defect_solution TEXT,
        defect_observations TEXT,
        assistanceTechnician TEXT,
        workingCheck_powerOn BOOLEAN,
        workingCheck_buttonsLeds BOOLEAN,
        workingCheck_predefinedTests BOOLEAN,
        workingCheck_screen BOOLEAN,
        workingCheck_caseMembranes BOOLEAN,
        FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
    );

    -- Tabela para os dados da etapa de Qualidade
    CREATE TABLE IF NOT EXISTS quality_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL UNIQUE,
        finalCheck_case BOOLEAN,
        finalCheck_membrane BOOLEAN,
        finalCheck_buttons BOOLEAN,
        finalCheck_screen BOOLEAN,
        finalCheck_test BOOLEAN,
        finalCheck_saveReports BOOLEAN,
        finalCheck_calibrationPrint BOOLEAN,
        finalCheck_backup BOOLEAN,
        qualityTechnician TEXT,
        qualityObservations TEXT,
        FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
    );

    -- Tabela para armazenar as imagens anexadas (continua a mesma)
    CREATE TABLE IF NOT EXISTS attached_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      stage TEXT NOT NULL, -- 'entry', 'assistance', 'quality'
      uri TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
    );

    -- Tabela para armazenar campos personalizados (continua a mesma)
    CREATE TABLE IF NOT EXISTS custom_report_fields (
        id TEXT PRIMARY KEY NOT NULL,
        session_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        value TEXT,
        FOREIGN KEY (session_id) REFERENCES inspection_sessions(id) ON DELETE CASCADE
    );
    `
  );
  console.log('Database: Tabelas (re)criadas ou já existentes.');

  return db;
};
