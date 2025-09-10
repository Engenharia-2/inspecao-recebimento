import { create } from 'zustand';
import { createDatabaseSlice, DatabaseSlice } from './slices/databaseSlice';
import { createSessionSlice, SessionSlice } from './slices/sessionSlice';
import { createReportSlice, ReportSlice } from './slices/reportSlice';
import React from 'react';

// Combina todos os slices em um único tipo
export type AppStore = DatabaseSlice & SessionSlice & ReportSlice;

// Cria o store do Zustand
export const useAppStore = create<AppStore>()((...a) => ({
  ...createDatabaseSlice(...a),
  ...createSessionSlice(...a),
  ...createReportSlice(...a),
}));

// Hook para inicializar o banco de dados e carregar dados iniciais
export const useDatabaseInitializer = () => {
  const { initDb, loadAllSessions } = useAppStore();

  React.useEffect(() => {
    initDb(() => {
      // Funções para carregar dados após a inicialização do DB
      loadAllSessions();
    });
  }, [initDb, loadAllSessions]);
};