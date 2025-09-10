
// hooks/report/pdf/reportGenerator.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { SQLiteDatabase } from 'expo-sqlite';

import { TemperatureRecord, UserAttachedImage, ReportData } from '../types'; // Importa os tipos
import { loadLogoAsset } from './assets';
import { createPdfContent } from './htmlGenerator';
import { cleanImagePickerCache, convertImageToBase64 } from './imageUtils';

/**
 * @typedef {Object} GenerateReportOptions
 * @property {string} clientName - Nome do cliente.
 * @property {string} operatorName - Nome do operador.
 * @property {TemperatureRecord[]} temperatureData - Dados de temperatura.
 * @property {UserAttachedImage[]} [imagesToAttach=[]] - Array de URIs de imagem com descrições.
 * @property {string} [userImageWidth='300px'] - Largura fixa desejada para a imagem do usuário (e.g., '100px', '500px', 'auto').
 * @property {string} [userImageHeight='auto'] - Altura fixa desejada para a imagem do usuário (e.g., '300px', 'auto').
 * @property {UserAttachedImage | null} [customHeaderLogo=null] - Logo personalizada para o cabeçalho do PDF.
 * @property {string} [reportColor='#0f398c'] - Cor do cabeçalho e rodapé do PDF (HEX).
 * @property {string} [reportTitle=null] - Título do relatório.
 */
type GenerateReportOptions = { 
  db: SQLiteDatabase;
  reportName: string;
  clientName: string;
  operatorName: string;
  temperatureData: TemperatureRecord[];
  imagesToAttach?: UserAttachedImage[];
  userImageWidth?: string;
  userImageHeight?: string;
  customHeaderLogo?: UserAttachedImage | null;
  reportColor?: string;
  reportTitle?: string;
  reportData?: ReportData;
  locationData: LocationData | null; // Correctly added here
};

/**
 * Função principal para gerar o relatório PDF e compartilhá-lo.
 * Orquestra o carregamento de assets, obtenção de localização,
 * processamento de imagens, geração de HTML e compartilhamento.
 * @param {GenerateReportOptions} options - Opções para a geração do PDF.
 */
export const generateReportPdfAndShare = async (options: GenerateReportOptions) => {
  const {
    db,
    reportName,
    clientName,
    operatorName,
    temperatureData,
    imagesToAttach = [],
    userImageWidth = '400px',
    userImageHeight = 'auto',
    customHeaderLogo = null,
    reportColor = '#0f398c',
    reportTitle = 'Relatório de Teste',
    reportData = {},
    locationData, // Correctly added to destructuring
  } = options;

  if (!reportName.trim()) {
    Alert.alert('Campo Obrigatório', 'Por favor, dê um nome ao relatório.');
    return;
  }

  if (!clientName.trim() || !operatorName.trim()) {
    Alert.alert('Campos Obrigatórios', 'Por favor, preencha o nome do Cliente e do Operador para gerar o relatório.');
    return;
  }

  if (!reportTitle.trim()) { // Validação para o título
    Alert.alert('Campo Obrigatório', 'Por favor, preencha o Título do Relatório.');
    return;
  }

  if (temperatureData.length === 0 && imagesToAttach.length === 0 && !customHeaderLogo) {
    Alert.alert('Dados Insuficientes', 'Não há dados de temperatura, imagens ou logo personalizada para gerar o relatório.');
    return;
  }

  try {
    // Garante que a logo esteja carregada e em Base64
    await loadLogoAsset();

    let customHeaderLogoBase64: string | null = null;
    if (customHeaderLogo) {
      const base64Result = await convertImageToBase64(customHeaderLogo.uri, customHeaderLogo.description);
      if (base64Result) {
        customHeaderLogoBase64 = base64Result.base64;
      } else {
        console.warn('ReportGenerator: Não foi possível processar a logo personalizada. Usando logo padrão.');
      }
    }

    // A localização agora é recebida como parâmetro, não buscada aqui.
    // const locationData = await getCurrentLocation();

    // Converte múltiplas imagens para Base64
    const processedAttachedImages: { base64: string, description: string }[] = [];
    const urisToClean: string[] = [];
    for (const img of imagesToAttach) {
      const base64Result = await convertImageToBase64(img.uri, img.description);
      if (base64Result) {
        processedAttachedImages.push({ base64: base64Result.base64, description: base64Result.description });
        urisToClean.push(img.uri); // FIX: Populate urisToClean
      } else {
        console.warn(`ReportGenerator: Não foi possível processar a imagem URI: ${img.uri}`);
      }
    }
    // Alerta se nenhuma imagem foi processada e havia intenção de anexar
    if (imagesToAttach.length > 0 && processedAttachedImages.length === 0) {
      Alert.alert("Erro de Imagens", "Nenhuma das imagens selecionadas pôde ser processada para inclusão no relatório.");
    }

    // Gera o conteúdo HTML do PDF
    const html = createPdfContent({
      clientName,
      operatorName,
      temperatureData,
      attachedImages: processedAttachedImages,
      userImageWidth,
      userImageHeight,
      locationData,
      customHeaderLogoBase64: customHeaderLogoBase64,
      reportColor,
      reportTitle,
      reportData,
    });

    // Imprime o PDF para um arquivo temporário
    const { uri: tempUri } = await Print.printToFileAsync({ html });

    if (!tempUri) {
      console.error("ReportGenerator: Print.printToFileAsync retornou URI nulo ou vazio.");
      Alert.alert('Erro', 'Não foi possível gerar o arquivo PDF temporário.');
      return;
    }

    // Salva o PDF permanentemente
    const pdfDir = FileSystem.documentDirectory + 'pdfs/';
    await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });
    const pdfPath = `${pdfDir}${reportName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    await FileSystem.moveAsync({
      from: tempUri,
      to: pdfPath,
    });

    // Salva no banco de dados
    const dataCriacao = new Date().toISOString();
    await db.runAsync(
      'INSERT INTO relatorios_pdf (nome, caminho_arquivo, data_criacao) VALUES (?, ?, ?)',
      [reportName, pdfPath, dataCriacao]
    );

    // Compartilha o PDF
    if (Platform.OS === 'ios') {
      await Sharing.shareAsync(pdfPath);
    } else { // Android
      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    }

    Alert.alert('Sucesso', 'Relatório PDF gerado e salvo com sucesso!');

    // Limpa os arquivos temporários das imagens após o compartilhamento
    await cleanImagePickerCache(urisToClean);
  } catch (error) {
    console.error('ReportGenerator: Erro detalhado ao gerar ou compartilhar PDF:', error);
    if (error instanceof Error) {
      Alert.alert('Erro', `Não foi possível gerar o relatório PDF. Detalhes: ${error.message}.`);
    } else {
      Alert.alert('Erro', 'Não foi possível gerar o relatório PDF. Verifique as permissões ou tente novamente.');
    }
  }
};
