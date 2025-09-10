import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { stylesUI } from '../../styles/stylesUI';
import { useAppStore } from '../../store';

const DefectObservationStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const defect_part = useAppStore((state) => state.defect_part);
  const defect_cause = useAppStore((state) => state.defect_cause);
  const defect_solution = useAppStore((state) => state.defect_solution);
  const defect_observations = useAppStore((state) => state.defect_observations);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Defeitos e Observações</Text>

      <Text style={stylesUI.labelText}>Peça com defeito:</Text>
      <TextInput
        style={stylesUI.input}
        placeholder="Descreva a peça com defeito"
        value={defect_part || ''}
        onChangeText={(text) => updateReportField('defect_part', text)}
      />

      <Text style={stylesUI.labelText}>Causa:</Text>
      <TextInput
        style={stylesUI.input}
        placeholder="Descreva a causa do defeito"
        value={defect_cause || ''}
        onChangeText={(text) => updateReportField('defect_cause', text)}
      />

      <Text style={stylesUI.labelText}>Solução:</Text>
      <TextInput
        style={stylesUI.input}
        placeholder="Descreva a solução aplicada"
        value={defect_solution || ''}
        onChangeText={(text) => updateReportField('defect_solution', text)}
      />

      <Text style={stylesUI.labelText}>Observações:</Text>
      <TextInput
        style={stylesUI.input}
        placeholder="Adicione observações adicionais"
        value={defect_observations || ''}
        onChangeText={(text) => updateReportField('defect_observations', text)}
        multiline
        numberOfLines={4}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default DefectObservationStep;