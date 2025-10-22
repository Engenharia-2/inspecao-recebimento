import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { debouncedSaveData } from './sessionStateSlice';
import { CustomField } from '../../report/types';

export type Stage = 'entry' | 'assistance' | 'quality' | 'assistance_defect' | 'assistance_plan';

export interface CustomFieldSlice {
  addCustomField: (title: string, stage: Stage) => void;
  updateCustomFieldValue: (id: string, value: string) => void;
  removeCustomField: (id: string) => void;
}

export const createCustomFieldSlice: StateCreator<
  AppStore,
  [],
  [],
  CustomFieldSlice
> = (set, get) => ({
  addCustomField: (title, stage) => {
    const newField: CustomField = {
      id: `${Date.now()}`,
      title,
      value: '',
      stage,
    };
    set(state => ({
      customFields: [...(state.customFields || []), newField],
    }));
    debouncedSaveData(() => get()._saveData());
  },

  updateCustomFieldValue: (id, value) => {
    set(state => ({
      customFields: (state.customFields || []).map(f => 
        f.id === id ? { ...f, value } : f
      ),
    }));
    debouncedSaveData(() => get()._saveData());
  },

  removeCustomField: (id) => {
    set(state => ({
      customFields: (state.customFields || []).filter(f => f.id !== id),
    }));
    debouncedSaveData(() => get()._saveData());
  },
});