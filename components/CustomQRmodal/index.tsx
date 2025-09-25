import React, {  useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { styles } from './style';

interface CustomQRModalProps {
  visible: boolean;
  onClose: () => void;
  onQRCodeScanned: (data: string) => void;
}

const CustomQRModal: React.FC<CustomQRModalProps> = ({ visible, onClose, onQRCodeScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    onQRCodeScanned(data);
    onClose();
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
              We need your permission to show the camera.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={requestPermission}>
              <Text style={styles.textStyle}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.textStyle}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomQRModal;
