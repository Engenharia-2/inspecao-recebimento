import React from 'react';
import { StyleSheet } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { useAppStore } from '../../store';
import CustomTitle from '../../components/CustomTitle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImageRouteParams } from '../../hooks/useImageRouteParams';

type FinalImagesCheckProps = {
  currentStepIndex: number;
};

const FinalImagesCheck: React.FC<FinalImagesCheckProps> = ({ currentStepIndex }) => {
  const qualityImages = useAppStore((state) => state.qualityImages);

  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('quality');

  useImageRouteParams(processAndSaveImage);

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
