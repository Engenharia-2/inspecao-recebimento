import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'; 
import CustomTitle from '../../components/CustomTitle';

type EntryRouteProp = RouteProp<{ Entry: { newImageUri?: string, returnStepIndex?: number } }, 'Entry'>;

type ImageAttachmentStepProps = {
  currentStepIndex: number;
};

const ImageAttachmentStep: React.FC<ImageAttachmentStepProps> = ({ currentStepIndex }) => {
  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('entry');
  const entryImages = useAppStore((state) => state.entryImages);
  const { requestCameraPermissions, requestPhotoLibraryPermissions } = useAppPermissions();
  const route = useRoute<EntryRouteProp>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    requestCameraPermissions();
    requestPhotoLibraryPermissions();
  }, [requestCameraPermissions, requestPhotoLibraryPermissions]);

  useEffect(() => {
    if (route.params?.newImageUri) {
            processAndSaveImage({ uri: route.params.newImageUri });
      // Clear params to avoid re-triggering the effect
      navigation.setParams({ newImageUri: undefined,});

      // Navigate to the returned step index
      if (route.params.returnStepIndex !== undefined) {
        // This assumes the parent screen has a way to set its current page/step
        // For PagerView, you might need to use a ref to setPage
        // For now, we just ensure the image is processed.
      }
    }
  }, [route.params?.newImageUri, processAndSaveImage, navigation, route.params?.returnStepIndex]);


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