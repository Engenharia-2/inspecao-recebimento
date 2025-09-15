import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { useAppStore } from '../../store';
import { AttachedImage, ReportData } from '../types';
import { createPdfContent } from './htmlGenerator';
import { convertImageToBase64 } from './imageUtils';

export const generateReportPdfAndShare = async () => {
  const {
    op, openDate, serialNumber, model, orderType, invoice, entryTechnician, returnItems,
    cleanCheck_equipmentCleaning, cleanCheck_screws, cleanCheck_hotGlue, cleanCheck_measurementCables,
    defect_part, defect_cause, defect_solution, defect_observations, assistanceTechnician,
    workingCheck_powerOn, workingCheck_buttonsLeds, workingCheck_predefinedTests, workingCheck_screen, workingCheck_caseMembranes,
    finalCheck_case, finalCheck_membrane, finalCheck_buttons, finalCheck_screen, finalCheck_test,
    finalCheck_saveReports, finalCheck_calibrationPrint, finalCheck_backup, qualityTechnician, qualityObservations,
    entryImages, assistanceImages, qualityImages, customFields, setIsGeneratingPdf,
  } = useAppStore.getState();

  setIsGeneratingPdf(true);

  try {
    // Reconstruct reportData object from granular state
    const reportData: ReportData = {
      op, openDate, serialNumber, model, orderType, invoice, entryTechnician, returnItems,
      cleanCheck_equipmentCleaning, cleanCheck_screws, cleanCheck_hotGlue, cleanCheck_measurementCables,
      defect_part, defect_cause, defect_solution, defect_observations, assistanceTechnician,
      workingCheck_powerOn, workingCheck_buttonsLeds, workingCheck_predefinedTests, workingCheck_screen, workingCheck_caseMembranes,
      finalCheck_case, finalCheck_membrane, finalCheck_buttons, finalCheck_screen, finalCheck_test,
      finalCheck_saveReports, finalCheck_calibrationPrint, finalCheck_backup, qualityTechnician, qualityObservations,
    };

    // Removed logo loading logic

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
      reportData,
      customFields,
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