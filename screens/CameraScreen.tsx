
import React, { useRef, FC } from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { useAppPermissions } from '../hooks/useAppPermissions';

// Updated RootStackParamList to be consistent with App.tsx
type RootStackParamList = {
  Home: undefined;
  Select: undefined;
  Entry: { newImageUri?: string; imageDescription?: string; returnStepIndex?: number };
  Assistance: { newImageUri?: string; imageDescription?: string; returnStepIndex?: number };
  Quality: { newImageUri?: string; imageDescription?: string; returnStepIndex?: number };
  CameraScreen: { description: string, returnScreen: keyof RootStackParamList, returnStepIndex?: number };
};

type CameraScreenRouteProp = RouteProp<RootStackParamList, 'CameraScreen'>;

const CameraScreen: FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<CameraScreenRouteProp>();
  const isFocused = useIsFocused();
  const { requestCameraPermissions } = useAppPermissions();

  const cameraRef = useRef<CameraView>(null);
  const { description, returnScreen, returnStepIndex } = route.params;

  const handleTakePicture = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission || !cameraRef.current) {
      return;
    }

        try {
          const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });

          if (photo && photo.uri) {
            // Retorna a URI local do arquivo da imagem
            navigation.navigate({
              name: returnScreen,
              params: { newImageUri: photo.uri, returnStepIndex },
              merge: true,
            });
          } else {
            Alert.alert('Erro', 'Não foi possível capturar a foto.');
          }
        } catch (error) {
          console.error('CameraScreen: Erro ao tirar foto:', error);
          Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
        }  };

  if (!isFocused) {
    return <View style={stylesCamera.container} />;
  }

  return (
    <View style={stylesCamera.container}>
      <CameraView style={stylesCamera.camera} facing="back" ref={cameraRef} />
      <TouchableOpacity style={stylesCamera.closeButton} onPress={() => navigation.goBack()}>
        <Text style={stylesCamera.closeButtonText}>X</Text>
      </TouchableOpacity>
      <View style={stylesCamera.controlsContainer}>
        <TouchableOpacity style={stylesCamera.captureButton} onPress={handleTakePicture}>
          <View style={stylesCamera.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}; 

export const stylesCamera = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  closeButton: { 
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default CameraScreen;
