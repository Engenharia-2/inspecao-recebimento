import { debounce } from 'lodash';
import { ReportState } from './reportStateSlice';

// --- Lógica de Verificação de Preenchimento ---
export const isValueFilled = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

export const isEntryFilled = (state: ReportState): boolean => {
  return isValueFilled(state.op) && isValueFilled(state.serialNumber) && isValueFilled(state.model) && isValueFilled(state.orderType) && isValueFilled(state.invoice) && isValueFilled(state.entryTechnician);
};

export const isAssistanceFilled = (state: ReportState): boolean => {
  const customFieldsFilled = (state.customFields || []).every(field => isValueFilled(field.value));
    return isValueFilled(state.defect_part) && isValueFilled(state.defect_cause) && isValueFilled(state.defect_solution) && isValueFilled(state.assistanceTechnician) && customFieldsFilled;
};

export const isQualityFilled = (state: ReportState): boolean => {
  return isValueFilled(state.qualityTechnician) && isValueFilled(state.qualityObservations);
};

// --- Lógica de debounce para salvar campos de texto ---
export const debouncedSaveData = debounce((saveFn: () => void) => {
  saveFn();
}, 1500);
