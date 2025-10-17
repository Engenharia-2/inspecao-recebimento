import { debounce } from 'lodash';
import { ReportState } from './reportStateSlice';

// --- Lógica de Verificação de Preenchimento ---
export const isValueFilled = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

// Valida se pelo menos um item do checklist foi marcado
const isChecklistStarted = (checklist: { [key: string]: boolean } | undefined): boolean => {
  if (!checklist) return false;
  return Object.values(checklist).some(value => value === true);
};

export const isEntryFilled = (state: ReportState): boolean => {
  return isValueFilled(state.op) && isValueFilled(state.serialNumber) && isValueFilled(state.model) && isValueFilled(state.orderType) && isValueFilled(state.invoice) && isValueFilled(state.entryTechnician);
};

export const isAssistanceFilled = (state: ReportState): boolean => {
  // A etapa é considerada preenchida se pelo menos um item de cada checklist for marcado.
  const cleanCheckStarted = isChecklistStarted(state.cleanCheck);
  const workingCheckStarted = isChecklistStarted(state.workingCheck);
  
  return cleanCheckStarted && workingCheckStarted;
};

export const isQualityFilled = (state: ReportState): boolean => {
  const finalCheckStarted = isChecklistStarted(state.finalCheck);
  const technicianFilled = isValueFilled(state.qualityTechnician);

  return finalCheckStarted && technicianFilled;
};

// --- Lógica de debounce para salvar campos de texto ---
export const debouncedSaveData = debounce((saveFn: () => void) => {
  saveFn();
}, 1500);
