import { create } from 'zustand';
import { createSessionSlice, SessionSlice } from './slices/sessionSlice';
import { createReportSlice, ReportSlice } from './slices/reportSlice';
import React from 'react';

// Combina todos os slices em um único tipo
export type AppStore = SessionSlice & ReportSlice;

// Cria o store do Zustand
export const useAppStore = create<AppStore>()((...a) => ({
  ...createSessionSlice(...a),
  ...createReportSlice(...a),
}));

// Hook para inicializar o aplicativo (carregar sessões da API)
export const useAppInitializer = () => {
  const { initApp } = useAppStore();

  React.useEffect(() => {
    initApp();
  }, [initApp]);
};