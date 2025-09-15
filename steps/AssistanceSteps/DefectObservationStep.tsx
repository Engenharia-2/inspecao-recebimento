import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../../store';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import { useKeyboardAwareScrollView } from '../../hooks/useKeyboardAwareScrollView';

const DefectObservationStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const defect_part = useAppStore((state) => state.defect_part);
  const defect_cause = useAppStore((state) => state.defect_cause);
  const defect_solution = useAppStore((state) => state.defect_solution);
  const defect_observations = useAppStore((state) => state.defect_observations);
  const scrollViewRef = useKeyboardAwareScrollView();

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <CustomTitle title='Registro de Defeitos e Observações'/>
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
        label="Observações:"
        placeholder="Adicione observações adicionais"
        value={defect_observations || ''}
        onChangeText={(text) => updateReportField('defect_observations', text)}
        multiline
        numberOfLines={4}
      />
      <CustomInput
        label="Solução:"
        placeholder="Descreva a solução aplicada"
        value={defect_solution || ''}
        onChangeText={(text) => updateReportField('defect_solution', text)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default DefectObservationStep;