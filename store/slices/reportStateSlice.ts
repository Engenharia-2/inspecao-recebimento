import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { ReportData, CustomField, AttachedImage } from '../../report/types';
import { updateReportData } from '../../routes/apiService';
import { isEntryFilled, isAssistanceFilled, isQualityFilled, debouncedSaveData } from './stateSlice';
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
};

export interface ReportActions {
  loadReportForSession: (report: ReportData, sessionId: number) => void;
  updateReportField: <K extends keyof ReportData>(field: K, value: ReportData[K]) => void;
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
  op: '', serialNumber: '', model: null, orderType: null, invoice: '', entryTechnician: '', returnItems: [],
  cleanCheck_equipmentCleaning: false, cleanCheck_screws: false, cleanCheck_hotGlue: false, cleanCheck_measurementCables: false, defect_part: '', defect_cause: '', defect_solution: '', defect_observations: '', assistanceTechnician: '', workingCheck_powerOn: false, workingCheck_buttonsLeds: false, workingCheck_predefinedTests: false, workingCheck_screen: false, workingCheck_caseMembranes: false,
  finalCheck_case: false, finalCheck_membrane: false, finalCheck_buttons: false, finalCheck_screen: false, finalCheck_test: false, finalCheck_saveReports: false, finalCheck_calibrationPrint: false, finalCheck_backup: false, qualityTechnician: '', qualityObservations: '',
  customFields: [],
  entryImages: [],
  assistanceImages: [],
  qualityImages: [],
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

  setIsGeneratingPdf: (isGenerating) => set({ isGeneratingPdf: isGenerating }),
  resetReportState: () => set({ ...initialState }),
});
