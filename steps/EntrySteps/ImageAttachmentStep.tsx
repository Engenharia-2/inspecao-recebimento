import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store';
import CustomTitle from '../../components/CustomTitle';
import { useImageRouteParams } from '../../hooks/useImageRouteParams';

type ImageAttachmentStepProps = {
  currentStepIndex: number;
};

const ImageAttachmentStep: React.FC<ImageAttachmentStepProps> = ({ currentStepIndex }) => {
  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('entry');
  const entryImages = useAppStore((state) => state.entryImages);
  const { requestCameraPermissions, requestPhotoLibraryPermissions } = useAppPermissions();

  useImageRouteParams(processAndSaveImage);

  useEffect(() => {
    requestCameraPermissions();
    requestPhotoLibraryPermissions();
  }, [requestCameraPermissions, requestPhotoLibraryPermissions]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomTitle title='Imagens de Entrada'/>
      <View style={styles.content}>
        <ImageAttachment
          attachedImages={entryImages}
          onPickImage={pickImage}
          onTakePicture={() => takePicture(2)}
          onDeleteImage={deleteImage}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
    gap: 16, // Make content take up space // Push button to bottom
  },
  buttonContainer: {
     // Add some padding at the bottom
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
});

export default ImageAttachmentStep;