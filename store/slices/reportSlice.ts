import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { ReportData, CustomField, AttachedImage } from '../../report/types';
import { debounce } from 'lodash';

// --- COMPLETION CHECK LOGIC ---
const isValueFilled = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

const isEntryFilled = (state: ReportState): boolean => {
  const { op, openDate, serialNumber, model, orderType, invoice, entryTechnician } = state;
  return (
    isValueFilled(op) &&
    isValueFilled(openDate) &&
    isValueFilled(serialNumber) &&
    isValueFilled(model) &&
    isValueFilled(orderType) &&
    isValueFilled(invoice) &&
    isValueFilled(entryTechnician)
  );
};

const isAssistanceFilled = (state: ReportState): boolean => {
  const { defect_part, defect_cause, defect_solution, assistanceTechnician, customFields } = state;
  const areCustomFieldsFilled = customFields.every(field => isValueFilled(field.value));
  return (
    isValueFilled(defect_part) &&
    isValueFilled(defect_cause) &&
    isValueFilled(defect_solution) &&
    isValueFilled(assistanceTechnician) &&
    areCustomFieldsFilled
  );
};

const isQualityFilled = (state: ReportState): boolean => {
  const { qualityTechnician, qualityObservations } = state;
  return isValueFilled(qualityTechnician) && isValueFilled(qualityObservations);
};

// --- HELPERS ---
const entryFields: (keyof ReportData)[] = ['op', 'openDate', 'serialNumber', 'model', 'orderType', 'invoice', 'entryTechnician', 'returnItems'];
const assistanceFields: (keyof ReportData)[] = ['cleanCheck_equipmentCleaning', 'cleanCheck_screws', 'cleanCheck_hotGlue', 'cleanCheck_measurementCables', 'defect_part', 'defect_cause', 'defect_solution', 'defect_observations', 'assistanceTechnician', 'workingCheck_powerOn', 'workingCheck_buttonsLeds', 'workingCheck_predefinedTests', 'workingCheck_screen', 'workingCheck_caseMembranes'];
const qualityFields: (keyof ReportData)[] = ['finalCheck_case', 'finalCheck_membrane', 'finalCheck_buttons', 'finalCheck_screen', 'finalCheck_test', 'finalCheck_saveReports', 'finalCheck_calibrationPrint', 'finalCheck_backup', 'qualityTechnician', 'qualityObservations'];

// --- STATE AND ACTIONS INTERFACES ---
export type ReportState = ReportData & {
  loading: boolean;
  isGeneratingPdf: boolean;
  currentSessionId: number | null;
  customFields: CustomField[];
  entryImages: AttachedImage[];
  assistanceImages: AttachedImage[];
  qualityImages: AttachedImage[];
  isEntryComplete: boolean;
  isAssistanceComplete: boolean;
  isQualityComplete: boolean;
};

export interface ReportActions {
  loadReportForSession: (sessionId: number) => Promise<void>;
  updateReportField: <K extends keyof ReportData>(field: K, value: ReportData[K]) => void;
  addCustomField: (title: string) => void;
  updateCustomFieldValue: (id: string, value: string) => void;
  removeCustomField: (id: string) => void;
  addAttachedImage: (image: Omit<AttachedImage, 'id'>) => Promise<void>;
  removeAttachedImage: (imageId: number) => Promise<void>;
  setIsGeneratingPdf: (isGenerating: boolean) => void;
  resetReportState: () => void;
  _saveReport: () => Promise<void>;
}

export type ReportSlice = ReportState & ReportActions;

// --- INITIAL STATE ---
const initialState: ReportState = {
  loading: false,
  isGeneratingPdf: false,
  currentSessionId: null,
  customFields: [],
  entryImages: [],
  assistanceImages: [],
  qualityImages: [],
  isEntryComplete: false,
  isAssistanceComplete: false,
  isQualityComplete: false,
  op: '', openDate: '', serialNumber: '', model: null, orderType: null, invoice: '', entryTechnician: '', returnItems: [],
  cleanCheck_equipmentCleaning: false, cleanCheck_screws: false, cleanCheck_hotGlue: false, cleanCheck_measurementCables: false, defect_part: '', defect_cause: '', defect_solution: '', defect_observations: '', assistanceTechnician: '', workingCheck_powerOn: false, workingCheck_buttonsLeds: false, workingCheck_predefinedTests: false, workingCheck_screen: false, workingCheck_caseMembranes: false,
  finalCheck_case: false, finalCheck_membrane: false, finalCheck_buttons: false, finalCheck_screen: false, finalCheck_test: false, finalCheck_saveReports: false, finalCheck_calibrationPrint: false, finalCheck_backup: false, qualityTechnician: '', qualityObservations: '',
};

// --- DEBOUNCED SAVE FUNCTION ---
const debouncedSave = debounce((saveFn: () => void) => {
  saveFn();
}, 1500);

// --- SLICE CREATION ---
export const createReportSlice: StateCreator<
  AppStore,
  [],
  [],
  ReportSlice
> = (set, get) => ({
  ...initialState,

  _saveReport: async () => {
    const { db, currentSessionId, customFields, ...reportData } = get();
    if (!db || !currentSessionId) return;
    try {
      const runUpdate = async (tableName: string, fields: (keyof ReportData)[]) => {
        const dataToSave = fields.reduce((acc, key) => ({ ...acc, [key]: reportData[key] }), {} as ReportData);
        const filteredKeys = Object.keys(dataToSave);
        if (filteredKeys.length === 0) return;
        const updateSet = filteredKeys.map(key => `${key} = ?`).join(', ');
        const values = filteredKeys.map(key => {
            if (key === 'returnItems') return JSON.stringify(dataToSave[key as keyof ReportData] || []);
            return dataToSave[key as keyof ReportData];
        });
        if (values.length > 0) {
            await db.runAsync(`UPDATE ${tableName} SET ${updateSet} WHERE session_id = ?`, [...values, currentSessionId]);
        }
      };
      await runUpdate('entry_data', entryFields);
      await runUpdate('assistance_data', assistanceFields);
      await runUpdate('quality_data', qualityFields);
      await db.runAsync(`DELETE FROM custom_report_fields WHERE session_id = ?`, currentSessionId);
      for (const field of customFields) {
        await db.runAsync(
          `INSERT INTO custom_report_fields (id, session_id, title, value) VALUES (?, ?, ?, ?)`,
          field.id, currentSessionId, field.title, field.value
        );
      }
    } catch (error) {
      console.error("Failed to save report data:", error);
    }
  },

  loadReportForSession: async (sessionId) => {
    set({ loading: true, currentSessionId: sessionId });
    try {
      const db = get().db;
      if (!db) throw new Error("Database not ready");
      const query = `
        SELECT
          ed.op, ed.openDate, ed.serialNumber, ed.model, ed.orderType, ed.invoice, ed.entryTechnician, ed.returnItems,
          ad.cleanCheck_equipmentCleaning, ad.cleanCheck_screws, ad.cleanCheck_hotGlue, ad.cleanCheck_measurementCables,
          ad.defect_part, ad.defect_cause, ad.defect_solution, ad.defect_observations, ad.assistanceTechnician,
          ad.workingCheck_powerOn, ad.workingCheck_buttonsLeds, ad.workingCheck_predefinedTests, ad.workingCheck_screen, ad.workingCheck_caseMembranes,
          qd.finalCheck_case, qd.finalCheck_membrane, qd.finalCheck_buttons, qd.finalCheck_screen, qd.finalCheck_test,
          qd.finalCheck_saveReports, qd.finalCheck_calibrationPrint, qd.finalCheck_backup, qd.qualityTechnician, qd.qualityObservations
        FROM entry_data ed
        LEFT JOIN assistance_data ad ON ed.session_id = ad.session_id
        LEFT JOIN quality_data qd ON ed.session_id = qd.session_id
        WHERE ed.session_id = ?;
      `;
      const rawReportDetails = await db.getFirstAsync<any>(query, sessionId);
      const customFieldsData = await db.getAllAsync<CustomField>(`SELECT * FROM custom_report_fields WHERE session_id = ?`, sessionId);
      const imagesData = await db.getAllAsync<AttachedImage>(`SELECT * FROM attached_images WHERE session_id = ?`, sessionId);
      const loadedReportData: ReportData = {
        op: rawReportDetails?.op || '',
        openDate: rawReportDetails?.openDate || '',
        serialNumber: rawReportDetails?.serialNumber || '',
        model: rawReportDetails?.model || null,
        orderType: rawReportDetails?.orderType || null,
        invoice: rawReportDetails?.invoice || '',
        entryTechnician: rawReportDetails?.entryTechnician || '',
        returnItems: JSON.parse(rawReportDetails?.returnItems || '[]'),
        cleanCheck_equipmentCleaning: !!rawReportDetails?.cleanCheck_equipmentCleaning,
        cleanCheck_screws: !!rawReportDetails?.cleanCheck_screws,
        cleanCheck_hotGlue: !!rawReportDetails?.cleanCheck_hotGlue,
        cleanCheck_measurementCables: !!rawReportDetails?.cleanCheck_measurementCables,
        defect_part: rawReportDetails?.defect_part || '',
        defect_cause: rawReportDetails?.defect_cause || '',
        defect_solution: rawReportDetails?.defect_solution || '',
        defect_observations: rawReportDetails?.defect_observations || '',
        assistanceTechnician: rawReportDetails?.assistanceTechnician || '',
        workingCheck_powerOn: !!rawReportDetails?.workingCheck_powerOn,
        workingCheck_buttonsLeds: !!rawReportDetails?.workingCheck_buttonsLeds,
        workingCheck_predefinedTests: !!rawReportDetails?.workingCheck_predefinedTests,
        workingCheck_screen: !!rawReportDetails?.workingCheck_screen,
        workingCheck_caseMembranes: !!rawReportDetails?.workingCheck_caseMembranes,
        finalCheck_case: !!rawReportDetails?.finalCheck_case,
        finalCheck_membrane: !!rawReportDetails?.finalCheck_membrane,
        finalCheck_buttons: !!rawReportDetails?.finalCheck_buttons,
        finalCheck_screen: !!rawReportDetails?.finalCheck_screen,
        finalCheck_test: !!rawReportDetails?.finalCheck_test,
        finalCheck_saveReports: !!rawReportDetails?.finalCheck_saveReports,
        finalCheck_calibrationPrint: !!rawReportDetails?.finalCheck_calibrationPrint,
        finalCheck_backup: !!rawReportDetails?.finalCheck_backup,
        qualityTechnician: rawReportDetails?.qualityTechnician || '',
        qualityObservations: rawReportDetails?.qualityObservations || '',
      };
      const finalState = { 
        ...initialState, 
        ...loadedReportData,
        currentSessionId: sessionId,
        customFields: customFieldsData || [],
        entryImages: imagesData.filter(img => img.stage === 'entry') || [],
        assistanceImages: imagesData.filter(img => img.stage === 'assistance') || [],
        qualityImages: imagesData.filter(img => img.stage === 'quality') || [],
        loading: false,
        isEntryComplete: false, isAssistanceComplete: false, isQualityComplete: false
      };
      set(finalState);
      set({
        isEntryComplete: isEntryFilled(finalState),
        isAssistanceComplete: isAssistanceFilled(finalState),
        isQualityComplete: isQualityFilled(finalState),
      });
    } catch (error) {
      console.error("Failed to load report data:", error);
      set({ loading: false });
    }
  },

  updateReportField: (field, value) => {
    set(state => {
      const newState = { ...state, [field]: value };
      return {
        ...newState,
        isEntryComplete: isEntryFilled(newState),
        isAssistanceComplete: isAssistanceFilled(newState),
        isQualityComplete: isQualityFilled(newState),
      };
    });
    if (field === 'op' && get().currentSessionId) {
      get().updateSessionName(get().currentSessionId as number, value as string);
    }
    debouncedSave(() => get()._saveReport());
  },

  addCustomField: (title) => {
    set(state => {
      const newField: CustomField = { id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, title, value: '' };
      const newState = { ...state, customFields: [...state.customFields, newField] };
      return {
        ...newState,
        isAssistanceComplete: isAssistanceFilled(newState),
      };
    });
    debouncedSave(() => get()._saveReport());
  },

  updateCustomFieldValue: (id, value) => {
    set(state => {
      const newState = { ...state, customFields: state.customFields.map(f => f.id === id ? { ...f, value } : f) };
      return {
        ...newState,
        isAssistanceComplete: isAssistanceFilled(newState),
      };
    });
    debouncedSave(() => get()._saveReport());
  },

  removeCustomField: (id) => {
    set(state => {
      const newState = { ...state, customFields: state.customFields.filter(f => f.id !== id) };
      return {
        ...newState,
        isAssistanceComplete: isAssistanceFilled(newState),
      };
    });
    debouncedSave(() => get()._saveReport());
  },

  addAttachedImage: async (image) => {
    const { db, currentSessionId } = get();
    if (!db || !currentSessionId) return;
    try {
        const result = await db.runAsync(`INSERT INTO attached_images (session_id, stage, uri, description) VALUES (?, ?, ?, ?)`, currentSessionId, image.stage, image.uri);
        const newImageId = result.lastInsertRowId;
        if (newImageId) {
            const newImage = { ...image, id: newImageId };
            switch(image.stage) {
                case 'entry': set(state => ({ entryImages: [...state.entryImages, newImage] })); break;
                case 'assistance': set(state => ({ assistanceImages: [...state.assistanceImages, newImage] })); break;
                case 'quality': set(state => ({ qualityImages: [...state.qualityImages, newImage] })); break;
            }
        }
    } catch (error) {
        console.error("Failed to add attached image:", error);
    }
  },

  removeAttachedImage: async (imageId) => {
    const { db } = get();
    if (!db) return;
    try {
        await db.runAsync(`DELETE FROM attached_images WHERE id = ?`, imageId);
        set(state => ({
            entryImages: state.entryImages.filter(img => img.id !== imageId),
            assistanceImages: state.assistanceImages.filter(img => img.id !== imageId),
            qualityImages: state.qualityImages.filter(img => img.id !== imageId),
        }));
    } catch (error) {
        console.error("Failed to remove attached image:", error);
    }
  },

  setIsGeneratingPdf: (isGenerating) => set({ isGeneratingPdf: isGenerating }),

  resetReportState: () => set({ ...initialState }),
});