
// report/types/index.ts

/**
 * Representa uma imagem anexada durante a inspeção.
 */
export type AttachedImage = {
  id?: number;
  sessionId: number;
  stage: 'entry' | 'assistance' | 'quality'; // De qual etapa é a imagem
  uri: string; // URI local do arquivo
  name: string; // Nome do arquivo (ex: image.jpg)
  type: string; // Mime type (ex: image/jpeg)
  status?: 'uploading' | 'uploaded' | 'error'; // Status do upload

  path: string; // Caminho do arquivo no dispositivo
};

/**
 * Representa um campo dinâmico criado pelo usuário.
 */
export type CustomField = {
  id: string;
  title: string;
  value: string;
};

/**
 * Representa uma sessão de inspeção completa.
 */
export type InspectionSession = {
  id: number;
  name: string;
  startTime: string;
  endTime: string | null;
};

/**
 * Agrega todos os campos de dados coletados durante a inspeção.
 */
export type ReportData = {
  // Entry Step Fields
  op?: string;
  openDate?: string;
  serialNumber?: string;
  model?: string | null;
  orderType?: string | null;
  invoice?: string;
  entryTechnician?: string;
  returnItems?: string[]; // Array de strings para os checkboxes

  // Assistance Step Fields
  cleanCheck_equipmentCleaning?: boolean;
  cleanCheck_screws?: boolean;
  cleanCheck_hotGlue?: boolean;
  cleanCheck_measurementCables?: boolean;
  defect_part?: string;
  defect_cause?: string;
  defect_solution?: string;
  defect_observations?: string;
  assistanceTechnician?: string;
  workingCheck_powerOn?: boolean;
  workingCheck_buttonsLeds?: boolean;
  workingCheck_predefinedTests?: boolean;
  workingCheck_screen?: boolean;
  workingCheck_caseMembranes?: boolean;

  // Quality Step Fields
  finalCheck_case?: boolean;
  finalCheck_membrane?: boolean;
  finalCheck_buttons?: boolean;
  finalCheck_screen?: boolean;
  finalCheck_test?: boolean;
  finalCheck_saveReports?: boolean;
  finalCheck_calibrationPrint?: boolean;
  finalCheck_backup?: boolean;
  qualityTechnician?: string;
  qualityObservations?: string;

  // Campos dinâmicos e imagens
  customFields?: CustomField[];
  entryImages?: AttachedImage[];
  assistanceImages?: AttachedImage[];
  qualityImages?: AttachedImage[];

  name?: string; // Nome do relatório

};
