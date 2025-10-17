import React from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomDropdown from '../../components/CustomDropdown';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import { useAppStore } from '../../store';

const ModelStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const model = useAppStore((state) => state.model);
  const orderType = useAppStore((state) => state.orderType);
  const invoice = useAppStore((state) => state.invoice);
  const estimatedDeliveryDate = useAppStore((state) => state.estimatedDeliveryDate);

  const handleDateChange = (text: string) => {
    // Remove tudo que não for dígito
    const cleaned = text.replace(/[^\d]/g, '');
    const length = cleaned.length;
    let formattedText = cleaned;

    if (length > 2) {
      formattedText = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (length > 4) {
      formattedText = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }

    updateReportField('estimatedDeliveryDate', formattedText);
  };

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
    { label: 'TTR', value: 'TTR' },
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <CustomTitle title="Modelo e Ordem" />
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
        <CustomInput 
          label="Data estimada de entrega" 
          value={estimatedDeliveryDate || ''} 
          onChangeText={handleDateChange} 
          placeholder="DD/MM/AAAA" 
          keyboardType="numeric"
          maxLength={10} // DD/MM/AAAA
        />
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

export default ModelStep;
