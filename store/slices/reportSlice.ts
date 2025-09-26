import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { ReportData, CustomField, AttachedImage } from '../../report/types';
import { debounce } from 'lodash';
import { updateReportData, uploadImage, deleteImage, API_BASE_URL } from '../../routes/apiService';

// --- Função Auxiliar para URLs de Imagem ---
const buildImageURL = (imagePath: string) => {
  if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('file')) {
    return imagePath; // Retorna se já for uma URL completa ou local
  }
  // Substitui barras invertidas por barras normais e monta a URL
  return `${API_BASE_URL}/${imagePath.replace(/\\/g, '/')}`;
};

// --- Lógica de Verificação de Preenchimento ---
const isValueFilled = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

const isEntryFilled = (state: ReportState): boolean => {
  return isValueFilled(state.op) && isValueFilled(state.serialNumber) && isValueFilled(state.model) && isValueFilled(state.orderType) && isValueFilled(state.invoice) && isValueFilled(state.entryTechnician);
};

const isAssistanceFilled = (state: ReportState): boolean => {
  const customFieldsFilled = (state.customFields || []).every(field => isValueFilled(field.value));
    return isValueFilled(state.defect_part) && isValueFilled(state.defect_cause) && isValueFilled(state.defect_solution) && isValueFilled(state.assistanceTechnician) && customFieldsFilled;
};

const isQualityFilled = (state: ReportState): boolean => {
  return isValueFilled(state.qualityTechnician) && isValueFilled(state.qualityObservations);
};

// --- Lógica de debounce para salvar campos de texto ---
const debouncedSaveData = debounce((saveFn: () => void) => {
  saveFn();
}, 1500);

// --- Interfaces de Estado e Ações ---
export type ReportState = ReportData & {
  loading: boolean;
  isGeneratingPdf: boolean;
  currentSessionId: number | null;
  isEntryComplete: boolean;
  isAssistanceComplete: boolean;
  isQualityComplete: boolean;
  customFields: CustomField[];
  entryImages: AttachedImage[];
  assistanceImages: AttachedImage[];
  qualityImages: AttachedImage[];
};

export interface ReportActions {
  loadReportForSession: (report: ReportData, sessionId: number) => void;
  updateReportField: <K extends keyof ReportData>(field: K, value: ReportData[K]) => void;
  _saveData: () => void;
  addCustomField: (title: string) => void;
  updateCustomFieldValue: (id: string, value: string) => void;
  removeCustomField: (id: string) => void;
  addAttachedImage: (image: Omit<AttachedImage, 'id' | 'sessionId'>) => void;
  removeAttachedImage: (imageToRemove: AttachedImage) => void;
  setIsGeneratingPdf: (isGenerating: boolean) => void;
  resetReportState: () => void;
}

export type ReportSlice = ReportState & ReportActions;

// --- Estado Inicial ---
const initialState: ReportState = {
  loading: false,
  isGeneratingPdf: false,
  currentSessionId: null,
  isEntryComplete: false,
  isAssistanceComplete: false,
  isQualityComplete: false,
  op: '', serialNumber: '', model: null, orderType: null, invoice: '', entryTechnician: '', returnItems: [],
  cleanCheck_equipmentCleaning: false, cleanCheck_screws: false, cleanCheck_hotGlue: false, cleanCheck_measurementCables: false, defect_part: '', defect_cause: '', defect_solution: '', defect_observations: '', assistanceTechnician: '', workingCheck_powerOn: false, workingCheck_buttonsLeds: false, workingCheck_predefinedTests: false, workingCheck_screen: false, workingCheck_caseMembranes: false,
  finalCheck_case: false, finalCheck_membrane: false, finalCheck_buttons: false, finalCheck_screen: false, finalCheck_test: false, finalCheck_saveReports: false, finalCheck_calibrationPrint: false, finalCheck_backup: false, qualityTechnician: '', qualityObservations: '',
  customFields: [],
  entryImages: [],
  assistanceImages: [],
  qualityImages: [],
};

// --- Criação do Slice ---
export const createReportSlice: StateCreator<
  AppStore,
  [],
  [],
  ReportSlice
> = (set, get) => ({
  ...initialState,

  // Carrega os dados de um relatório existente no estado
  loadReportForSession: (report, sessionId) => {
    const mapAndBuildImageUrls = (images: any[]): AttachedImage[] => {
      if (!images) return [];
      return images.map(img => ({
        ...img,
        uri: buildImageURL(img.path), // Mapeia 'path' para 'uri' e constrói a URL
      }));
    };

    const entryImages = mapAndBuildImageUrls(report.images?.filter(img => img.stage === 'entry'));
    const assistanceImages = mapAndBuildImageUrls(report.images?.filter(img => img.stage === 'assistance'));
    const qualityImages = mapAndBuildImageUrls(report.images?.filter(img => img.stage === 'quality'));

    // Garante que customFields seja sempre um array, fazendo o parse se for uma string JSON
    let parsedCustomFields = report.customFields;
    if (typeof parsedCustomFields === 'string') {
      try {
        parsedCustomFields = JSON.parse(parsedCustomFields);
      } catch (e) {
        console.error("Falha ao fazer parse de customFields:", e);
        parsedCustomFields = []; // Define como array vazio em caso de erro
      }
    }
    // Garante que o resultado final seja um array
    if (!Array.isArray(parsedCustomFields)) {
      parsedCustomFields = [];
    }

    const newState = {
      ...report,
      customFields: parsedCustomFields, // Usa o valor processado
      currentSessionId: sessionId,
      entryImages,
      assistanceImages,
      qualityImages,
    };

    set({
      ...newState,
      isEntryComplete: isEntryFilled(newState as ReportState),
      isAssistanceComplete: isAssistanceFilled(newState as ReportState),
      isQualityComplete: isQualityFilled(newState as ReportState),
    });
  },

  // Salva apenas os campos de dados (não imagens)
  _saveData: async () => {
    const state = get();
    const { currentSessionId, customFields, entryImages, assistanceImages, qualityImages, isEntryComplete, isAssistanceComplete, isQualityComplete, ...reportData } = state;
    if (!currentSessionId) return;

    // Encontra o nome da sessão atual para garantir que ele seja salvo também
    const currentSession = state.measurementSessions.find(s => s.id === currentSessionId);
    const name = currentSession ? currentSession.name : undefined;

    try {
      // Inclui o nome no objeto a ser salvo
      await updateReportData(currentSessionId, { ...reportData, customFields, name });
    } catch (error) {
      console.error("Falha ao salvar dados do relatório:", error);
    }
  },

  // Atualiza um campo e recalcula o status de preenchimento
  updateReportField: (field, value) => {
    set(state => {
      const newState = { ...state, [field]: value };

      // Se o campo for 'op', também atualiza o nome da sessão na lista de sessões
      if (field === 'op' && state.currentSessionId) {
        const updatedSessions = state.measurementSessions.map(session =>
          session.id === state.currentSessionId ? { ...session, name: value as string } : session
        );
        return {
          ...newState,
          measurementSessions: updatedSessions, // Atualiza a lista de sessões
          isEntryComplete: isEntryFilled(newState),
          isAssistanceComplete: isAssistanceFilled(newState),
          isQualityComplete: isQualityFilled(newState),
        };
      }

      return {
        ...newState,
        isEntryComplete: isEntryFilled(newState),
        isAssistanceComplete: isAssistanceFilled(newState),
        isQualityComplete: isQualityFilled(newState),
      };
    });

    // A lógica de debounce para salvar os dados permanece a mesma
    debouncedSaveData(() => get()._saveData());
  },

  // Adiciona uma imagem e inicia o upload imediatamente
  addAttachedImage: (image) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    const tempId = Date.now();
    const imageWithStatus: AttachedImage = { ...image, id: tempId, sessionId: currentSessionId, status: 'uploading' };

    const stageKey = `${image.stage}Images` as keyof ReportState;
    set(state => ({ [stageKey]: [...(state[stageKey] as AttachedImage[]), imageWithStatus] }));

    (async () => {
      try {
        const savedImage = await uploadImage(currentSessionId, imageWithStatus);
        // Atualiza a imagem na UI, mapeando o 'path' do servidor para 'uri'
        set(state => {
          const updatedImages = (state[stageKey] as AttachedImage[]).map(img => 
            img.id === tempId ? { ...savedImage, uri: buildImageURL(savedImage.path), status: 'uploaded' } : img
          );
          return { [stageKey]: updatedImages };
        });
      } catch (error) {
        console.error("Falha no upload da imagem:", error);
        set(state => {
          const updatedImages = (state[stageKey] as AttachedImage[]).map(img => 
            img.id === tempId ? { ...imageWithStatus, status: 'error' } : img
          );
          return { [stageKey]: updatedImages };
        });
      }
    })();
  },

  // Remove uma imagem
  removeAttachedImage: async (imageToRemove) => {
    const { id, stage } = imageToRemove;
    if (!id) return;

    const stageKey = `${stage}Images` as keyof ReportState;
    const originalImages = get()[stageKey] as AttachedImage[];

    set(state => ({
      [stageKey]: originalImages.filter(img => img.id !== id)
    }));

    try {
      if (!id.toString().startsWith('file')) { // Só deleta imagens que estão no servidor
        await deleteImage(id);
      }
      debouncedSaveData(() => get()._saveData());
    } catch (error) {
      console.error("Falha ao deletar imagem no servidor:", error);
      set({ [stageKey]: originalImages });
    }
  },

  // Ações de campos customizados
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

  setIsGeneratingPdf: (isGenerating) => set({ isGeneratingPdf: isGenerating }),
  resetReportState: () => set({ ...initialState }),
});