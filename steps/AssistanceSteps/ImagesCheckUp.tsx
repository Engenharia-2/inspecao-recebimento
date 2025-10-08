import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { useAppStore } from '../../store';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';

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
            processAndSaveImage({ uri: route.params.newImageUri });
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
            <CustomTitle title='Verificação de Imagens'/>
            <CustomInput
                label="Técnico que realizou os testes:"
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
  buttonContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
});

export default ImagesCheckUp;
