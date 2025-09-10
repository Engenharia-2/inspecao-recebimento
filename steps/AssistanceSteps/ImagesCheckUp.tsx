import React, { useEffect } from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { stylesUI } from '../../styles/stylesUI';
import { useAppStore } from '../../store';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton'; // Import CustomButton

type AssistanceRouteProp = RouteProp<{ Assistance: { newImageUri?: string, imageDescription?: string, returnStepIndex?: number } }, 'Assistance'>;

type ImagesCheckUpProps = {
  currentStepIndex: number;
};

const ImagesCheckUp: React.FC<ImagesCheckUpProps> = ({ currentStepIndex }) => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const assistanceTechnician = useAppStore((state) => state.assistanceTechnician);
  const assistanceImages = useAppStore((state) => state.assistanceImages);

  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('assistance');
  const route = useRoute<AssistanceRouteProp>();
  const navigation = useNavigation<any>();

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

  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.title}>Verificação de Imagens e Técnico</Text>

            <Text style={stylesUI.labelText}>Técnico que realizou os testes:</Text>
            <TextInput
                style={stylesUI.input}
                placeholder="Nome do Técnico"
                value={assistanceTechnician || ''}
                onChangeText={(text) => updateReportField('assistanceTechnician', text)}
            />

            <ImageAttachment
                attachedImages={assistanceImages}
                onPickImage={pickImage}
                onTakePicture={() => takePicture(4)}
                onDeleteImage={deleteImage}
            />
        </View>
        <View style={styles.buttonContainer}>
            <CustomButton
                title="Fechar formulário"
                onPress={() => navigation.navigate('Select')}
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', // Push button to bottom
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  }
});

export default ImagesCheckUp;
