import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import CustomButton from '../CustomButton';
import { styles } from './style';

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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.headerText}>Adicionar Novo Campo</Text>
          <TextInput
            style={styles.input}
            placeholder="Título do Campo"
            value={fieldTitle}
            onChangeText={setFieldTitle}
          />
          <View style={styles.buttonContainer}>
            <CustomButton title="Confirmar" onPress={handleConfirm} />
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateCustomFieldModal;