import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomQRModal from '../../components/CustomQRmodal';
import { useAppStore } from '../../store';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../assets/Colors';

const IdentificationStep = () => {
  // Granular selectors for performance optimization
  const updateReportField = useAppStore((state) => state.updateReportField);
  const op = useAppStore((state) => state.op);
  const serialNumber = useAppStore((state) => state.serialNumber);

  const [isQRModalVisible, setQRModalVisible] = useState(false);



  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust this value as needed
    >
      <ScrollView contentContainerStyle={styles.container}>
      <CustomTitle title="Dados de identificação"/>
      <View style={styles.opContainer}>
        <View style={styles.opInput}>
          <CustomInput label="OP" value={op || ''} onChangeText={(text) => updateReportField('op', text)} placeholder="Digite a Ordem de Produção" />
        </View>
        <TouchableOpacity style={styles.qrButton} onPress={() => setQRModalVisible(true)}>
          <MaterialIcons name="qr-code-scanner" size={32} color={Colors.black} />
        </TouchableOpacity>
        <CustomQRModal
        visible={isQRModalVisible}
        onClose={() => setQRModalVisible(false)}
        onQRCodeScanned={(data) => {
          updateReportField('serialNumber', data);
          setQRModalVisible(false);
        }}
      />
      </View>
      <CustomInput label="Número de série" value={serialNumber || ''} onChangeText={(text) => updateReportField('serialNumber', text)} placeholder="Digite o número de série" />
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    zIndex: 0,
  },
  opContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  opInput: {
    flex: 1,
  },
  qrButton: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 14,
    height: 48, // Same height as the input
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 22,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
  },
});

export default IdentificationStep;