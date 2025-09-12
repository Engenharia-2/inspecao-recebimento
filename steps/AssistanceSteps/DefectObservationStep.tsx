import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../../store';
import { Colors } from '../../assets/Colors';
import CustomInput from '../../components/CustomInput';

const DefectObservationStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const defect_part = useAppStore((state) => state.defect_part);
  const defect_cause = useAppStore((state) => state.defect_cause);
  const defect_solution = useAppStore((state) => state.defect_solution);
  const defect_observations = useAppStore((state) => state.defect_observations);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Defeitos e Observações</Text>
      <CustomInput
        label="Peça com defeito:"
        placeholder="Descreva a peça com defeito"
        value={defect_part || ''}
        onChangeText={(text) => updateReportField('defect_part', text)}
      />
      <CustomInput
        label="Causa:"
        placeholder="Descreva a causa do defeito"
        value={defect_cause || ''}
        onChangeText={(text) => updateReportField('defect_cause', text)}
      />
      <CustomInput
        label="Solução:"
        placeholder="Descreva a solução aplicada"
        value={defect_solution || ''}
        onChangeText={(text) => updateReportField('defect_solution', text)}
      />
      <CustomInput
        label="Observações:"
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textLight,
  },
});

export default DefectObservationStep;