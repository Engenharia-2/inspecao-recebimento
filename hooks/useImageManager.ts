import { Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';
import { useAppStore } from '../store/';
import { AttachedImage } from '../report/types';
import { useNavigation } from '@react-navigation/native';
import { useAppPermissions } from './useAppPermissions'; // Import useAppPermissions
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

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

      const processAndSaveImage = useCallback(async (imageAsset: { uri: string, fileName?: string, type?: string }) => {
    try {
      // Redimensiona e comprime a imagem
      const manipulatedImage = await manipulateAsync(
        imageAsset.uri,
        [{ resize: { width: 1920 } }], // Redimensiona para uma largura máxima de 1920px
        { compress: 0.7, format: SaveFormat.JPEG } // Comprime para 70% da qualidade em JPEG
      );

      // Adiciona a imagem processada ao estado
      addAttachedImage({
        uri: manipulatedImage.uri, // URI do novo arquivo, menor
        name: imageAsset.fileName || `photo_${Date.now()}.jpg`,
        type: 'image/jpeg', // O formato de saída é sempre JPEG
        stage,
        sessionId: 0, // Handled by slice
      });

    } catch (error) {
      console.error("Erro ao processar a imagem:", error);
      Alert.alert("Erro", "Não foi possível processar a imagem.");
    }
  }, [stage, addAttachedImage]);

  const handleImageLibraryResponse = useCallback(async (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorMessage) {
      Alert.alert('Erro', `Erro do ImagePicker: ${response.errorMessage}`);
      return;
    }
    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      // Garante que a imagem seja copiada localmente para uma URI confiável
      const localUri = `${FileSystem.cacheDirectory}images/${Date.now()}-${asset.fileName}`;
      try {
        await FileSystem.copyAsync({
          from: asset.uri,
          to: localUri,
        });
        processAndSaveImage({ ...asset, uri: localUri });
      } catch (e) {
        console.error("Erro ao copiar imagem da galeria:", e);
        Alert.alert("Erro", "Não foi possível acessar a imagem da galeria.");
      }
    }
  }, [processAndSaveImage]);
  
    const pickImage = useCallback(() => {
      launchImageLibrary(
        { mediaType: 'photo', quality: 1, includeBase64: false }, // Qualidade máxima, sem base64
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