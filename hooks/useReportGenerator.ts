
import { useAppStore } from '../store/';
import { generateReportPdfAndShare } from '../report/pdf/reportGenerator';
import { Alert } from 'react-native';

export const useReportGenerator = () => {
  const isGenerating = useAppStore((state) => state.isGeneratingPdf);
  const endSession = useAppStore((state) => state.endSession);
  const currentSession = useAppStore((state) => state.currentSession);

  const generateReport = async (options?: { onComplete?: () => void }) => {
    Alert.alert(
      "Finalizar e Gerar Relatório",
      "Você tem certeza que deseja finalizar a inspeção e gerar o relatório? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar", 
          onPress: async () => {
            await generateReportPdfAndShare();
            if (currentSession?.id) {
              await endSession(currentSession.id);
            }
            options?.onComplete?.();
          }
        }
      ]
    );
  };

  return { isGenerating, generateReport };
};
