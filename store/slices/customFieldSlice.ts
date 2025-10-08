import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { isAssistanceFilled, debouncedSaveData } from './stateSlice';

export interface CustomFieldSlice {
  addCustomField: (title: string) => void;
  updateCustomFieldValue: (id: string, value: string) => void;
  removeCustomField: (id: string) => void;
}

export const createCustomFieldSlice: StateCreator<
  AppStore,
  [],
  [],
  CustomFieldSlice
> = (set, get) => ({
  addCustomField: (title) => {
    set(state => {
      // Garante que customFields seja um array antes de adicionar um novo campo
      const newCustomFields = [...(state.customFields || []), { id: `${Date.now()}`, title, value: '' }];
      const newState = { ...state, customFields: newCustomFields };
      return { ...newState, isAssistanceComplete: isAssistanceFilled(newState) };
    });
    debouncedSaveData(() => get()._saveData());
  },
  updateCustomFieldValue: (id, value) => {
    set(state => {
      const newState = { ...state, customFields: state.customFields.map(f => f.id === id ? { ...f, value } : f) };
      return { ...newState, isAssistanceComplete: isAssistanceFilled(newState) };
    });
    debouncedSaveData(() => get()._saveData());
  },
  removeCustomField: (id) => {
    set(state => {
      const newState = { ...state, customFields: state.customFields.filter(f => f.id !== id) };
      return { ...newState, isAssistanceComplete: isAssistanceFilled(newState) };
    });
    debouncedSaveData(() => get()._saveData());
  },
});
