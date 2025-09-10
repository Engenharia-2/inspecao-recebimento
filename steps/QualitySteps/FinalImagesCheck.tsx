import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { stylesUI } from '../../styles/stylesUI';
import { useAppStore } from '../../store';
import CustomButton from '../../components/CustomButton';
import { useReportGenerator } from '../../hooks/useReportGenerator';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

type QualityRouteProp = RouteProp<{ Quality: { newImageUri?: string, imageDescription?: string, returnStepIndex?: number } }, 'Quality'>;

type FinalImagesCheckProps = {
  currentStepIndex: number;
};

const FinalImagesCheck: React.FC<FinalImagesCheckProps> = ({ currentStepIndex }) => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const qualityTechnician = useAppStore((state) => state.qualityTechnician);
  const qualityObservations = useAppStore((state) => state.qualityObservations);
  const qualityImages = useAppStore((state) => state.qualityImages);

  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('quality', currentStepIndex);
  const { isGenerating, generateReport } = useReportGenerator();
  const navigation = useNavigation<any>();
  const route = useRoute<QualityRouteProp>();

  useEffect(() => {
    if (route.params?.newImageUri) {
      processAndSaveImage(route.params.newImageUri, route.params?.imageDescription || '');
      navigation.setParams({ newImageUri: undefined, imageDescription: undefined });

      if (route.params.returnStepIndex !== undefined) {
        // This assumes the parent screen has a way to set its current page/step
        // For PagerView, you might need to use a ref to setPage
        // For now, we just ensure the image is processed.
      }
    }
  }, [route.params?.newImageUri, route.params?.imageDescription, processAndSaveImage, navigation, route.params?.returnStepIndex]);

  const handleGenerateReport = () => {
    generateReport({ onComplete: () => navigation.navigate('Home') });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verificação Final e Observações</Text>

      <Text style={stylesUI.labelText}>Técnico Responsável:</Text>
      <TextInput
        style={stylesUI.input}
        placeholder="Nome do Técnico"
        value={qualityTechnician || ''}
        onChangeText={(text) => updateReportField('qualityTechnician', text)}
      />

      <Text style={stylesUI.labelText}>Observações Finais:</Text>
      <TextInput
        style={[stylesUI.input, { height: 100 }]}
        placeholder="Adicione observações finais sobre a inspeção"
        value={qualityObservations || ''}
        onChangeText={(text) => updateReportField('qualityObservations', text)}
        multiline
      />

      <ImageAttachment
        attachedImages={qualityImages}
        onPickImage={pickImage}
        onTakePicture={() => takePicture(1)}
        onDeleteImage={deleteImage}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title={isGenerating ? 'Gerando Relatório...' : 'Finalizar e Gerar Relatório'}
          onPress={handleGenerateReport}
          disabled={isGenerating}
          style={[stylesUI.button, isGenerating && styles.disabledButton]}
          textStyle={stylesUI.buttonText}
        />
        {isGenerating && <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 50,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  spinner: {
    marginTop: 20,
  },
});

export default FinalImagesCheck;