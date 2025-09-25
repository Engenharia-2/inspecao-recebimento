
import axios from 'axios';

// --- IMPORTANTE ---
// Substitua pela URL base da sua API. Durante o desenvolvimento,
// será o IP da sua máquina na rede local.
export const API_BASE_URL = 'http://192.168.0.104:3001'; // Removido /api do final

// Criamos uma instância do axios com a configuração base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função auxiliar para repetição automática em caso de erro de rede
const withRetry = async <T>(apiCall: () => Promise<T>, retries = 3, delay = 3000): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall(); // Tenta a chamada
    } catch (error) {
      // Se for um erro de rede e ainda houver tentativas
      if (axios.isAxiosError(error) && error.message === 'Network Error' && i < retries - 1) {
        console.log(`Tentativa ${i + 1} falhou devido a erro de rede. Tentando novamente em ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Espera
      } else {
        throw error; // Lança o erro se não for de rede ou se as tentativas acabaram
      }
    }
  }
  throw new Error('Falha na chamada da API após múltiplas tentativas.'); // Fallback
};

/**
 * Interface que representa a estrutura de dados de um Relatório.
 * Você deve ajustar os campos conforme a necessidade da sua aplicação.
 */
export interface Relatorio {
  id?: number;
  op?: string;
  openDate?: string;
  serialNumber?: string;
  model?: string;
  orderType?: string;
  invoice?: string;
  entryTechnician?: string;
  returnItems?: object; // JSON

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

  customFields?: object; // JSON
  entryImages?: object; // JSON
  assistanceImages?: object; // JSON
  qualityImages?: object; // JSON

  name?: string;
  startTime?: Date;
  endTime?: Date | null;
  
  createdAt?: string;
  updatedAt?: string;
}

// --- Funções de Comunicação com a API ---

/**
 * Busca a lista de todas as inspeções abertas na API.
 * @returns Promise<Inspection[]>
 */
export const fetchRelatorios = async (): Promise<Relatorio[]> => {
  try {
    const response = await apiClient.get('/api/relatorios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    throw error;
  }
};

/**
 * Busca os detalhes de uma única inspeção pelo seu ID.
 * @param id - O ID da inspeção.
 * @returns Promise<Inspection>
 */
export const fetchRelatorioById = async (id: number): Promise<Relatorio> => {
    try {
      const response = await apiClient.get(`/api/relatorios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatório com ID ${id}:`, error);
      throw error;
    }
  };

/**
 * Cria uma nova inspeção (usado pelo setor de Entrada).
 * @param inspectionData - Dados iniciais da inspeção.
 * @returns Promise<Inspection>
 */
export const createRelatorio = async (relatorioData: Partial<Relatorio>): Promise<Relatorio> => {
  const formData = new FormData();
  Object.keys(relatorioData).forEach(key => {
    const value = relatorioData[key as keyof typeof relatorioData];
    if (value !== null && value !== undefined) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value as any);
      }
    }
  });

  try {
    // Define a chamada da API a ser tentada
    const apiCall = () => axios.post(`${API_BASE_URL}/api/relatorios`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Executa a chamada com a lógica de repetição
    const response = await withRetry(apiCall);
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar relatório:', JSON.stringify(error.response?.data, null, 2));
    } else {
      console.error('Erro ao criar relatório:', error);
    }
    throw error;
  }
};

/**
 * Atualiza uma inspeção existente (usado pelos setores de Assistência e Qualidade).
 * @param id - O ID da inspeção a ser atualizada.
 * @param updateData - Os novos dados a serem adicionados/modificados.
 * @returns Promise<Inspection>
 */
export const updateRelatorio = async (id: number, updateData: FormData): Promise<Relatorio> => {
  try {
    // Define a chamada da API a ser tentada
    const apiCall = () => axios.put(`${API_BASE_URL}/api/relatorios/${id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Executa a chamada com a lógica de repetição
    const response = await withRetry(apiCall);
    return response.data;

  } catch (error) {
    // Adiciona um log mais detalhado do erro do axios
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao atualizar relatório ${id}:`, JSON.stringify(error.response?.data, null, 2));
    } else {
      console.error(`Erro ao atualizar relatório ${id}:`, error);
    }
    throw error;
  }
};

/**
 * Deleta uma inspeção existente.
 * @param id - O ID da inspeção a ser deletada.
 * @returns Promise<void>
 */
export const deleteRelatorio = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/relatorios/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar relatório com ID ${id}:`, error);
    throw error;
  }
};
