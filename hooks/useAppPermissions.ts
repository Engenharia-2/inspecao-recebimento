import { Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { requestMediaLibraryPermissionsAsync } from 'expo-image-picker';

export const useAppPermissions = () => {

  const requestCameraPermissions = async (): Promise<boolean> => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'A permissão da câmera é necessária para tirar fotos.');
      return false;
    }
    return true;
  };

  const requestPhotoLibraryPermissions = async (): Promise<boolean> => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'A permissão da galeria é necessária para escolher fotos.');
      return false;
    }
    return true;
  };

  return { requestCameraPermissions, requestPhotoLibraryPermissions };
};