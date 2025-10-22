
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
  status?: 'uploading' | 'uploaded' | 'error' | 'deleting'; // Status do upload

  path: string; // Caminho do arquivo no dispositivo
};

/**
 * Representa um campo dinâmico criado pelo usuário.
 */
export type CustomField = {
  id: string;
  title: string;
  value: string;
  stage: 'entry' | 'assistance' | 'quality';
};

/**
 * Representa uma sessão de inspeção completa.
 */
export type InspectionSession = {
  id: number;
  name: string;
  startTime: string;
  endTime: string | null;
  status: 'aberta' | 'fechada';
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
  estimatedDeliveryDate?: string; // Novo campo
  entryTechnician?: string;
  returnItems?: string[]; // Array de strings para os checkboxes

  // Assistance Step Fields
  cleanCheck?: { [key: string]: boolean };
  cleanCheck_test1?: string;
  cleanCheck_test2?: string;
  cleanCheck_test3?: string;
  cleanCheck_test4?: string;
  cleanCheck_test5?: string;
  workingCheck?: { [key: string]: boolean };
  assistanceTechnician?: string;

  // Quality Step Fields
  finalCheck?: { [key: string]: boolean };
  qualityTechnician?: string;

  // Campos dinâmicos e imagens
  customFields?: CustomField[];
  entryImages?: AttachedImage[];
  assistanceImages?: AttachedImage[];
  qualityImages?: AttachedImage[];
  name?: string; // Nome do relatório

  //sessionSlice ???
  id?: number; // ID do relatório
  startTime?: any;
  endTime?: any;
  //FinalStep ???
  recipientEmail?: string; 

};
