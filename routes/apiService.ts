import { Alert } from 'react-native';
import axios from 'axios';
import { AttachedImage, ReportData } from '../report/types';

import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.API_URL;

// export const API_BASE_URL = 'http://192.168.0.10:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Erro Global ---
apiClient.interceptors.response.use(
  (response) => response, // Passa adiante respostas de sucesso
  (error) => {
    // Verifica se a requisição é para upload de imagem
    const isImageUpload = error.config.url.includes('/images');

    if (!isImageUpload) {
      let errorMessage = 'Ocorreu um erro inesperado.';
      if (error.response) {
        // Erro com resposta do servidor (4xx, 5xx)
        errorMessage = `Erro no Servidor: ${error.response.status}\nPor favor, tente novamente mais tarde.`;
      } else if (error.request) {
        // Erro sem resposta do servidor (ex: rede, servidor offline)
        errorMessage = 'Falha na comunicação.\nVerifique sua conexão com a rede e se o servidor está online.';
      }
      Alert.alert('Falha na Operação', errorMessage);
    }

    // Rejeita a promessa para que o erro possa ser tratado localmente se necessário
    return Promise.reject(error);
  }
);


// Função auxiliar para repetição automática em caso de erro de rede
const withRetry = async <T>(apiCall: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (axios.isAxiosError(error) && error.message === 'Network Error' && i < retries - 1) {
        console.log(`Tentativa de upload ${i + 1} falhou. Tentando novamente em ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Falha no upload após múltiplas tentativas.');
};

// --- API para Relatórios (Apenas dados, sem arquivos) ---

export const fetchRelatorios = (): Promise<ReportData[]> => apiClient.get('/relatorios').then(res => res.data);

export const fetchRelatorioById = (id: number): Promise<ReportData> => apiClient.get(`/relatorios/${id}`).then(res => res.data);

export const createRelatorio = (data: Partial<ReportData>): Promise<ReportData> => apiClient.post('/relatorios', data).then(res => res.data);

export const updateReportData = (id: number, data: Partial<ReportData>): Promise<ReportData> => apiClient.put(`/relatorios/${id}`, data).then(res => res.data);

export const deleteRelatorio = (id: number): Promise<void> => apiClient.delete(`/relatorios/${id}`);

// --- API para Imagens (Upload com FormData) ---

export const uploadImage = async (reportId: number, image: AttachedImage): Promise<AttachedImage> => {
  const formData = new FormData();
  formData.append('stage', image.stage);
  formData.append('image', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any);

  const apiCall = () => axios.post(`${API_BASE_URL}/api/relatorios/${reportId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const response = await withRetry(apiCall);
  return response.data;
};

export const deleteImage = async (imageId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/api/images/${imageId}`);
};

export const sendEntryCompleteEmail = async (reportId: number, recipientEmail: string) => {
  try {
    await apiClient.post('/send-entry-email', { reportId, recipientEmail });
    return { success: true, message: 'E-mail de conclusão da entrada enviado com sucesso.' };
  } catch (error) {
    console.error('Falha ao enviar e-mail de conclusão da entrada:', error);
    return { success: false, message: 'Falha ao enviar e-mail de conclusão da entrada.', error: error };
  }
};