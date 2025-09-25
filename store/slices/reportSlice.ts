import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { ReportData, CustomField, AttachedImage } from '../../report/types';
import { debounce } from 'lodash';
import { Relatorio, createRelatorio, fetchRelatorioById, updateRelatorio, API_BASE_URL } from '../../routes/apiService';

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
    isValueFilled(serialNumber) &&
    isValueFilled(model) &&
    isValueFilled(orderType) &&
    isValueFilled(invoice) &&
    isValueFilled(entryTechnician)
  );
};

const isAssistanceFilled = (state: ReportState): boolean => {
  const { defect_part, defect_cause, defect_solution, assistanceTechnician, customFields } = state;
  // Garante que customFields seja um array vazio se for null/undefined
  const safeCustomFields = customFields || [];
  const areCustomFieldsFilled = safeCustomFields.every(field => isValueFilled(field.value));
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
const entryFields: (keyof ReportData)[] = ['op', 'serialNumber', 'model', 'orderType', 'invoice', 'entryTechnician', 'returnItems'];
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
  op: '', serialNumber: '', model: null, orderType: null, invoice: '', entryTechnician: '', returnItems: [],
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
    const { currentSessionId, customFields, entryImages, assistanceImages, qualityImages, ...reportData } = get();
    if (!currentSessionId) return;

    const formData = new FormData();

    // 1. Separa imagens novas (locais) das já existentes (salvas no servidor)
    const filterImages = (images: AttachedImage[]) => {
      const newImages = images.filter(img => img.uri.startsWith('file://'));
      const existingImages = images.filter(img => !img.uri.startsWith('file://'));
      return { newImages, existingImages };
    };

    const { newImages: newEntryImages, existingImages: existingEntryImages } = filterImages(entryImages || []);
    const { newImages: newAssistanceImages, existingImages: existingAssistanceImages } = filterImages(assistanceImages || []);
    const { newImages: newQualityImages, existingImages: existingQualityImages } = filterImages(qualityImages || []);

    // 2. Adiciona campos de texto e os arrays de imagens existentes como JSON stringificado
    Object.keys(reportData).forEach(key => {
      const value = reportData[key as keyof typeof reportData];
      if (value !== null && value !== undefined) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value as any);
      }
    });
    formData.append('customFields', JSON.stringify(customFields || []));
    formData.append('entryImages', JSON.stringify(existingEntryImages.map(img => img.uri)));
    formData.append('assistanceImages', JSON.stringify(existingAssistanceImages.map(img => img.uri)));
    formData.append('qualityImages', JSON.stringify(existingQualityImages.map(img => img.uri)));

    // 3. Adiciona apenas as NOVAS imagens como arquivos
    const appendImages = (field: string, images: AttachedImage[]) => {
      images.forEach(image => {
        formData.append(field, {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as any);
      });
    };

    appendImages('entryImages', newEntryImages);
    appendImages('assistanceImages', newAssistanceImages);
    appendImages('qualityImages', newQualityImages);

    try {
      await updateRelatorio(currentSessionId, formData);
    } catch (error) {
      console.error("Falha ao salvar dados do relatório via FormData:", error);
    }
  },

        loadReportForSession: async (sessionId) => {
      set({ loading: true, currentSessionId: sessionId });
      try {
        const rawReportDetails = await fetchRelatorioById(sessionId);

        // Função para converter caminhos de imagem em URLs completas
        const buildImageURL = (imagePath: string) => {
          if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('file')) {
            return imagePath; // Retorna se já for uma URL completa ou local
          }
          // Substitui barras invertidas por barras normais e monta a URL
          return `${API_BASE_URL}/${imagePath.replace(/\\/g, '/')}`;
        };

                const parseAndBuildImageUrls = (imagesJson: string | object | null | undefined): AttachedImage[] => {
          if (!imagesJson) return [];
          try {
            const imagePaths = typeof imagesJson === 'string' ? JSON.parse(imagesJson) : imagesJson;
            if (Array.isArray(imagePaths)) {
              return imagePaths.map((pathOrObject: any, index: number) => {
                // Se for apenas uma string de caminho do backend
                if (typeof pathOrObject === 'string') {
                  return {
                    id: index, // Usar o índice como uma chave única
                    uri: buildImageURL(pathOrObject),
                    name: pathOrObject.split(/[\\/]/).pop() || 'image.jpg',
                    type: 'image/jpeg', // Assumir tipo, já que não é armazenado
                  } as AttachedImage;
                }
                // Se já for um objeto (vindo do estado local)
                if (typeof pathOrObject === 'object' && pathOrObject.uri) {
                  return {
                    ...pathOrObject,
                    uri: buildImageURL(pathOrObject.uri),
                  };
                }
                return null;
              }).filter(Boolean) as AttachedImage[];
            }
          } catch (e) {
            console.error("Erro ao fazer parse das imagens:", e);
          }
          return [];
        };

        const loadedReportData: ReportData = {
          op: rawReportDetails?.op || '',
          serialNumber: rawReportDetails?.serialNumber || '',
          model: rawReportDetails?.model || null,
          orderType: rawReportDetails?.orderType || null,
          invoice: rawReportDetails?.invoice || '',
          entryTechnician: rawReportDetails?.entryTechnician || '',
          returnItems: (rawReportDetails?.returnItems as any) || [],
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
          customFields: (rawReportDetails?.customFields && typeof rawReportDetails.customFields === 'string' ? JSON.parse(rawReportDetails.customFields) : rawReportDetails?.customFields) || [],
          entryImages: parseAndBuildImageUrls(rawReportDetails?.entryImages),
          assistanceImages: parseAndBuildImageUrls(rawReportDetails?.assistanceImages),
          qualityImages: parseAndBuildImageUrls(rawReportDetails?.qualityImages),
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

  addAttachedImage: async (image: Omit<AttachedImage, 'id' | 'sessionId'>) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    const newImage = { ...image, id: Date.now() }; // Temporary ID

    switch(image.stage) {
        case 'entry': set(state => ({ entryImages: [...state.entryImages, newImage] })); break;
        case 'assistance': set(state => ({ assistanceImages: [...state.assistanceImages, newImage] })); break;
        case 'quality': set(state => ({ qualityImages: [...state.qualityImages, newImage] })); break;
    }
    debouncedSave(() => get()._saveReport());
  },

  removeAttachedImage: async (imageId) => {
    set(state => ({
        entryImages: state.entryImages.filter(img => img.id !== imageId),
        assistanceImages: state.assistanceImages.filter(img => img.id !== imageId),
        qualityImages: state.qualityImages.filter(img => img.id !== imageId),
    }));
    debouncedSave(() => get()._saveReport());
  },

  setIsGeneratingPdf: (isGenerating) => set({ isGeneratingPdf: isGenerating }),

  resetReportState: () => set({ ...initialState }),
});