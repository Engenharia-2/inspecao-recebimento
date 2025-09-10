import { Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';
import { useAppStore } from '../store/';
import { AttachedImage } from '../report/types';
import { useNavigation } from '@react-navigation/native';
import { useAppPermissions } from './useAppPermissions'; // Import useAppPermissions

const stageToScreenMap = {
  entry: 'Entry',
  assistance: 'Assistance',
  quality: 'Quality',
};

export const useImageManager = (stage: 'entry' | 'assistance' | 'quality') => {
  const navigation = useNavigation<any>();
  const addAttachedImage = useAppStore((state) => state.addAttachedImage);
  const removeAttachedImage = useAppStore((state) => state.removeAttachedImage);
  const { requestCameraPermissions } = useAppPermissions(); // Get permissions hook

  const saveImagePermanently = useCallback(async (uri: string): Promise<string | null> => {
    if (!uri) {
      console.error('ImageManager: URI provided to saveImagePermanently is invalid.');
      return null;
    }

    const fileName = uri.split('/').pop();
    if (!fileName) {
      console.error('ImageManager: Não foi possível extrair o nome do arquivo da imagem.');
      return null;
    }
    const dir = `${FileSystem.documentDirectory}images/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const destinationUri = `${dir}${fileName}`;

    // If the image is already in the persistent directory, just return its URI
    if (uri.startsWith(dir)) {
      return uri;
    }

    try {
      await FileSystem.copyAsync({ from: uri, to: destinationUri });
      return destinationUri;
    } catch (error) {
      console.error('ImageManager: Erro ao copiar imagem para armazenamento persistente:', error);
      Alert.alert('Erro', 'Não foi possível salvar a imagem permanentemente.');
      return null;
    }
  }, []); // No dependencies needed as FileSystem is stable

  const processAndSaveImage = useCallback(async (uri: string, description: string = '') => {
    // If URI is already Base64, store it directly without copying
    if (uri.startsWith('data:')) {
      addAttachedImage({
        uri: uri,
        stage,
        sessionId: 0, // Handled by slice
      });
      return;
    }

    // Fallback for other URIs (e.g., content:// from gallery if not Base64)
    const persistentUri = await saveImagePermanently(uri);
    if (persistentUri) {
        addAttachedImage({
            uri: persistentUri,
            stage,
            sessionId: 0, // Handled by slice
        });
    }
  }, [stage, addAttachedImage, saveImagePermanently]);

  const handleImageLibraryResponse = useCallback(async (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorMessage) {
      Alert.alert('Erro', `Erro do ImagePicker: ${response.errorMessage}`);
      return;
    }
    if (response.assets && response.assets[0].uri) {
      // Prioritize Base64 if available (for Android content:// URIs)
      if (response.assets[0].base64) {
        const mimeType = response.assets[0].type || 'image/jpeg'; // Use detected type or default
        const base64Uri = `data:${mimeType};base64,${response.assets[0].base64}`;
        processAndSaveImage(base64Uri);
      } else { // Fallback to URI if Base64 not available
        processAndSaveImage(response.assets![0].uri!);
      }
    }
  }, [processAndSaveImage]);

  const pickImage = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7, includeBase64: true }, // Request Base64
      handleImageLibraryResponse
    );
  }, [handleImageLibraryResponse]);

  const takePicture = useCallback((returnStepIndex?: number) => {
    // Request camera permissions BEFORE navigating
    requestCameraPermissions().then(hasCameraPermission => {
      if (!hasCameraPermission) {
        Alert.alert('Permissão Necessária', 'A permissão da câmera é essencial para tirar fotos.');
        return;
      }
      const returnScreen = stageToScreenMap[stage];
      navigation.navigate('CameraScreen', {
          description: '', // No description needed for CameraScreen
          returnScreen,
          returnStepIndex // Pass the index
      });
    });
  }, [navigation, stage, requestCameraPermissions]);

  const deleteImage = useCallback(async (imageToDelete: AttachedImage) => {
    // If the image is from FileSystem.documentDirectory, attempt to delete the file
    if (imageToDelete.uri.startsWith(FileSystem.documentDirectory || '')) {
      try {
        await FileSystem.deleteAsync(imageToDelete.uri, { idempotent: true });
      } catch (error) {
        console.error('ImageManager: Erro ao deletar arquivo:', error);
      }
    }
    if (imageToDelete.id) {
      await removeAttachedImage(imageToDelete.id);
    }
  }, [removeAttachedImage]);

  return {
    pickImage,
    takePicture,
    deleteImage,
    processAndSaveImage, // Exported for use in steps
  };
};