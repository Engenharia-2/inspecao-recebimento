import React from 'react';
import { StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomDropdown from '../../components/CustomDropdown';
import CustomTitle from '../../components/CustomTitle';
import { useAppStore } from '../../store';
import { Colors } from '../../assets/Colors'

const IdentificationStep = () => {
  // Granular selectors for performance optimization
  const updateReportField = useAppStore((state) => state.updateReportField);
  const op = useAppStore((state) => state.op);
  const openDate = useAppStore((state) => state.openDate);
  const serialNumber = useAppStore((state) => state.serialNumber);
  const model = useAppStore((state) => state.model);
  const orderType = useAppStore((state) => state.orderType);
  const invoice = useAppStore((state) => state.invoice);

  const modelItems = [
    { label: 'Surge Test 4kv M1', value: 'Surge Test 4kv M1' },
    { label: 'Surge Test 4kv (antigo)', value: 'Surge Test 4kv (antigo)' },
    { label: 'Surge Test 4kv bancada', value: 'Surge Test 4kv bancada' },
    { label: 'Surge teste 15kv', value: 'Surge teste 15kv' },
    { label: 'Surge teste 15kv MT', value: 'Surge teste 15kv MT' },
    { label: 'Megohmetro 1kv', value: 'Megohmetro 1kv' },
    { label: 'Megohmetro 5kv', value: 'Megohmetro 5kv' },
    { label: 'Miliohmimetro bancada', value: 'Miliohmimetro bancada' },
    { label: 'Miliohmimetro (sem bateria)', value: 'Miliohmimetro (sem bateria)' },
    { label: 'Miliohmimetro', value: 'Miliohmimetro' },
    { label: 'Engenheirado', value: 'Engenheirado' },
  ];

  const orderTypeItems = [
    { label: 'Revisão', value: 'Revisão' },
    { label: 'Avulso', value: 'Avulso' },
    { label: 'Garantia', value: 'Garantia' },
  ];

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust this value as needed
    >
      <ScrollView contentContainerStyle={styles.container}>
      <CustomTitle title="Dados de identificação"/>
      <CustomInput label="OP" value={op || ''} onChangeText={(text) => updateReportField('op', text)} placeholder="Digite a Ordem de Produção" />
      <CustomInput label="Data de abertura" value={openDate || ''} onChangeText={(text) => updateReportField('openDate', text)} placeholder="DD/MM/AAAA" />
      <CustomInput label="Número de série" value={serialNumber || ''} onChangeText={(text) => updateReportField('serialNumber', text)} placeholder="Digite o número de série" />
      <CustomDropdown 
        label="Modelo" 
        value={model || null} 
        items={modelItems} 
        onValueChange={(value) => updateReportField('model', value)} 
        placeholder="Selecione o Modelo" 
        zIndex={2000}
        zIndexInverse={1000}
        dropDownDirection={"BOTTOM"}
      />
      <CustomDropdown 
        label="Tipo de ordem" 
        value={orderType || null} 
        items={orderTypeItems} 
        onValueChange={(value) => updateReportField('orderType', value)} 
        placeholder="Selecione o Tipo de Ordem" 
        zIndex={1000}
        zIndexInverse={2000}
        dropDownDirection={"BOTTOM"}
      />
      <CustomInput label="Nota fiscal" value={invoice || ''} onChangeText={(text) => updateReportField('invoice', text)} placeholder="Digite a nota fiscal" />
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    zIndex: 0,
  },
});

export default IdentificationStep;