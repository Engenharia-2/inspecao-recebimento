
import React, { useRef } from 'react';
import { Text, View, TouchableOpacity, Alert, Modal } from 'react-native';
import { CameraView } from 'expo-camera';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import { styles } from './style';

interface CameraModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPictureTaken: (photo: { uri: string }) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isVisible, onClose, onPictureTaken }) => {
  const cameraRef = useRef<CameraView>(null);
  const { requestCameraPermissions } = useAppPermissions();

  const handleTakePicture = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission || !cameraRef.current) {
      Alert.alert('Permissão Necessária', 'A permissão para acessar a câmera é necessária.');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
      if (photo && photo.uri) {
        onPictureTaken(photo);
        onClose(); // Fecha o modal após a foto ser tirada
      } else {
        Alert.alert('Erro', 'Não foi possível capturar a foto.');
      }
    } catch (error) {
      console.error('CameraModal: Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CameraModal;
