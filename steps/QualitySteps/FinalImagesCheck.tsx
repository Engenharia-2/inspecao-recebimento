import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { useAppStore } from '../../store';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTitle from '../../components/CustomTitle';

type QualityRouteProp = RouteProp<{ Quality: { newImageUri?: string, imageDescription?: string, returnStepIndex?: number } }, 'Quality'>;

type FinalImagesCheckProps = {
  currentStepIndex: number;
};

const FinalImagesCheck: React.FC<FinalImagesCheckProps> = ({ currentStepIndex }) => {
  const qualityImages = useAppStore((state) => state.qualityImages);

  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('quality');
  const navigation = useNavigation<any>();
  const route = useRoute<QualityRouteProp>();

  useEffect(() => {
    if (route.params?.newImageUri) {
      processAndSaveImage(route.params.newImageUri, route.params?.imageDescription || '');
      navigation.setParams({ newImageUri: undefined, imageDescription: undefined });

      if (route.params.returnStepIndex !== undefined) {
        // The parent screen will handle the navigation
      }
    }
  }, [route.params?.newImageUri, route.params?.imageDescription, processAndSaveImage, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomTitle title='Verificação Final de Imagens'/>

      <ImageAttachment
        attachedImages={qualityImages}
        onPickImage={pickImage}
        onTakePicture={() => takePicture(1)} // Stays 1 as it's still the second step (index 1)
        onDeleteImage={deleteImage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default FinalImagesCheck;
