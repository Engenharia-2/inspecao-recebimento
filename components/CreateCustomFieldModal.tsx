import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { stylesUI } from '../styles/stylesUI';
import { stylesReport } from '../styles/stylesReport';

interface CreateCustomFieldModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

const CreateCustomFieldModal: React.FC<CreateCustomFieldModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [fieldTitle, setFieldTitle] = useState('');

  const handleConfirm = () => {
    if (fieldTitle.trim()) {
      onConfirm(fieldTitle.trim());
      setFieldTitle(''); // Clear input
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={stylesReport.centeredView}>
        <View style={stylesReport.modalView}>
          <Text style={stylesUI.headerText}>Adicionar Novo Campo</Text>
          <TextInput
            style={stylesUI.input}
            placeholder="Título do Campo"
            value={fieldTitle}
            onChangeText={setFieldTitle}
          />
          <View style={stylesReport.buttonContainer}>
            <CustomButton title="Confirmar" onPress={handleConfirm} />
            <TouchableOpacity onPress={onClose} style={[stylesUI.button, stylesReport.cancelButton]}>
              <Text style={stylesUI.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateCustomFieldModal;