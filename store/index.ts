import { create } from 'zustand';
import { createSessionSlice, SessionSlice } from './slices/sessionSlice';
import { createReportSlice, FullReportSlice } from './slices/reportSlice';
import { createUiSlice, UiSlice } from './slices/uiSlice'; // Importa o novo slice
import React from 'react';

// Combina todos os slices em um único tipo
export type AppStore = SessionSlice & FullReportSlice & UiSlice; // Adiciona o UiSlice ao tipo

// Cria o store do Zustand
export const useAppStore = create<AppStore>()((...a) => ({
  ...createSessionSlice(...a),
  ...createReportSlice(...a),
  ...createUiSlice(...a), // Adiciona o novo slice ao store
}));

// Hook para inicializar o aplicativo (carregar sessões da API)
export const useAppInitializer = () => {
  const { initApp } = useAppStore();

  React.useEffect(() => {
    initApp();
  }, [initApp]);
};