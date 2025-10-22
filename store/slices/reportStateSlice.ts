import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { ReportData, CustomField, AttachedImage } from '../../report/types';
import { updateReportData, sendEntryCompleteEmail } from '../../routes/apiService';
import { isEntryFilled, isAssistanceFilled, isQualityFilled, debouncedSaveData } from './sessionStateSlice';
import { buildImageURL } from './imageSlice';

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
  recipientEmail: string;
};

export interface ReportActions {
  loadReportForSession: (report: ReportData, sessionId: number) => void;
  updateReportField: <K extends keyof ReportData>(field: K, value: ReportData[K]) => void;
  updateWorkingCheck: (item: string, value: boolean) => void; // <-- Nova ação
  updateCleanCheck: (item: string, value: boolean) => void; // <-- Nova ação
  updateFinalCheck: (item: string, value: boolean) => void; // <-- Nova ação
  _saveData: () => void;
  setIsGeneratingPdf: (isGenerating: boolean) => void;
  resetReportState: () => void;
}

export type ReportSlice = ReportState & ReportActions;

// --- Estado Inicial ---
export const initialState: ReportState = {
  loading: false,
  isGeneratingPdf: false,
  currentSessionId: null,
  isEntryComplete: false,
  isAssistanceComplete: false,
  isQualityComplete: false,
  op: '', serialNumber: '', model: null, orderType: null, invoice: '', estimatedDeliveryDate: '', entryTechnician: '', returnItems: [],
  cleanCheck: {}, cleanCheck_test1: '', cleanCheck_test2: '', cleanCheck_test3: '', cleanCheck_test4: '', cleanCheck_test5: '', workingCheck: {},
  assistanceTechnician: '',
  finalCheck: {}, qualityTechnician: '',
  customFields: [],
  entryImages: [],
  assistanceImages: [],
  qualityImages: [],
  recipientEmail: '',
};

// --- Criação do Slice ---
export const createReportStateSlice: StateCreator<
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

    // Combina todas as imagens em um único array para salvar
    const images = [...entryImages, ...assistanceImages, ...qualityImages];

    try {
      // Inclui o nome e as imagens no objeto a ser salvo
      await updateReportData(currentSessionId, { ...reportData, customFields, name, images });
    } catch (error) {
      console.error("Falha ao salvar dados do relatório:", error);
    }
  },

  // Atualiza um campo e recalcula o status de preenchimento
  updateReportField: (field, value) => {
    set(state => {
      const wasEntryComplete = state.isEntryComplete;
      const newState = { ...state, [field]: value };
      const isNowEntryComplete = isEntryFilled(newState);

      // Se a entrada acabou de ser concluída, chame a API para enviar o e-mail
      // if (isNowEntryComplete && !wasEntryComplete && newState.currentSessionId && newState.recipientEmail) {
      //   sendEntryCompleteEmail(newState.currentSessionId, newState.recipientEmail);
      // }

      // Se o campo for 'op', também atualiza o nome da sessão na lista de sessões
      if (field === 'op' && state.currentSessionId) {
        const updatedSessions = state.measurementSessions.map(session =>
          session.id === state.currentSessionId ? { ...session, name: value as string } : session
        );
        return {
          ...newState,
          measurementSessions: updatedSessions, // Atualiza a lista de sessões
          isEntryComplete: isNowEntryComplete,
          isAssistanceComplete: isAssistanceFilled(newState),
          isQualityComplete: isQualityFilled(newState),
        };
      }

      return {
        ...newState,
        isEntryComplete: isNowEntryComplete,
        isAssistanceComplete: isAssistanceFilled(newState),
        isQualityComplete: isQualityFilled(newState),
      };
    });

    // A lógica de debounce para salvar os dados permanece a mesma
    debouncedSaveData(() => get()._saveData());
  },

  // Atualiza um item específico no checklist de funcionamento
  updateWorkingCheck: (item, value) => {
    set(state => ({
      workingCheck: {
        ...state.workingCheck,
        [item]: value,
      },
    }));
    debouncedSaveData(() => get()._saveData());
  },

  // Atualiza um item específico no checklist de limpeza
  updateCleanCheck: (item, value) => {
    set(state => ({
      cleanCheck: {
        ...state.cleanCheck,
        [item]: value,
      },
    }));
    debouncedSaveData(() => get()._saveData());
  },

  // Atualiza um item específico no checklist final
  updateFinalCheck: (item, value) => {
    set(state => ({
      finalCheck: {
        ...state.finalCheck,
        [item]: value,
      },
    }));
    debouncedSaveData(() => get()._saveData());
  },

  setIsGeneratingPdf: (isGenerating) => set({ isGeneratingPdf: isGenerating }),
  resetReportState: () => set({ ...initialState }),
});
