import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { useAppStore } from '../../store';
import { AttachedImage, ReportData } from '../types';
import { createPdfContent } from './htmlGenerator';
import { convertImageToBase64, convertLogoToBase64 } from './imageUtils';

export const generateReportPdfAndShare = async () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

  const {
    op, serialNumber, model, orderType, invoice, entryTechnician, returnItems, estimatedDeliveryDate, // Entry
    cleanCheck, cleanCheck_test1, cleanCheck_test2, cleanCheck_test3, cleanCheck_test4, cleanCheck_test5, // Assistance (Clean)
    workingCheck, // Assistance (Work)
    finalCheck, qualityTechnician, // Quality
    entryImages, assistanceImages, qualityImages, customFields: allCustomFields, setIsGeneratingPdf, // Common
  } = useAppStore.getState();

  setIsGeneratingPdf(true);

  try {
    // Filtrar os customFields por stage
    const entryFields = allCustomFields.filter(f => f.stage === 'entry');
    const defectFields = allCustomFields.filter(f => f.stage === 'assistance_defect');
    const planFields = allCustomFields.filter(f => f.stage === 'assistance_plan');
    const qualityFields = allCustomFields.filter(f => f.stage === 'quality');

    // Reconstruct the main report object with the new data structure
    const reportData: ReportData = {
      op, openDate: formattedDate, serialNumber, model, orderType, invoice, entryTechnician, returnItems, estimatedDeliveryDate,
      cleanCheck, cleanCheck_test1, cleanCheck_test2, cleanCheck_test3, cleanCheck_test4, cleanCheck_test5,
      workingCheck,
      finalCheck, qualityTechnician,
    };
    const logoBase64 = await convertLogoToBase64();

    // 1. Process all images in parallel
    const processImages = async (images: AttachedImage[]) => {
      const processed = await Promise.all(
        images.map(async (img) => {
          const result = await convertImageToBase64(img.uri, img.description || '',);
          return result ? { ...img, uri: result.base64 } : null;
        })
      );
      return processed.filter((img): img is AttachedImage => img !== null);
    };

    const [processedEntry, processedAssistance, processedQuality] = await Promise.all([
        processImages(entryImages),
        processImages(assistanceImages),
        processImages(qualityImages),
    ]);

    // 2. Generate HTML content
    const html = createPdfContent({
      logoBase64,
      reportData,
      entryFields,
      defectFields,
      planFields,
      qualityFields,
      entryImages: processedEntry,
      assistanceImages: processedAssistance,
      qualityImages: processedQuality,
    }); 

    // 3. Print to PDF
    const { uri } = await Print.printToFileAsync({ html });

    // 4. Share the PDF
    if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Erro', 'Compartilhamento não está disponível neste dispositivo.');
        return;
    }
    await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar Relatório de Inspeção',
        UTI: 'com.adobe.pdf',
    });

  } catch (error) {
    console.error('ReportGenerator: Erro ao gerar ou compartilhar PDF:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório PDF.');
  } finally {
    setIsGeneratingPdf(false);
  }
};