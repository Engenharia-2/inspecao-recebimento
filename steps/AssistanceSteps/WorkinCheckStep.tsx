import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useAppStore } from '../../store';

const WorkinCheckStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const workingCheck_powerOn = useAppStore((state) => state.workingCheck_powerOn);
  const workingCheck_buttonsLeds = useAppStore((state) => state.workingCheck_buttonsLeds);
  const workingCheck_predefinedTests = useAppStore((state) => state.workingCheck_predefinedTests);
  const workingCheck_screen = useAppStore((state) => state.workingCheck_screen);
  const workingCheck_caseMembranes = useAppStore((state) => state.workingCheck_caseMembranes);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Funcionamento</Text>
      <CustomCheckbox
        label="Ligar equipamento"
        value={!!workingCheck_powerOn}
        onValueChange={() => updateReportField('workingCheck_powerOn', !workingCheck_powerOn)}
      />
      <CustomCheckbox
        label="Testar botões e LEDs"
        value={!!workingCheck_buttonsLeds}
        onValueChange={() => updateReportField('workingCheck_buttonsLeds', !workingCheck_buttonsLeds)}
      />
      <CustomCheckbox
        label="Realizar testes predefinidos"
        value={!!workingCheck_predefinedTests}
        onValueChange={() => updateReportField('workingCheck_predefinedTests', !workingCheck_predefinedTests)}
      />
      <CustomCheckbox
        label="Verificar tela"
        value={!!workingCheck_screen}
        onValueChange={() => updateReportField('workingCheck_screen', !workingCheck_screen)}
      />
      <CustomCheckbox
        label="Verificar maleta e membranas"
        value={!!workingCheck_caseMembranes}
        onValueChange={() => updateReportField('workingCheck_caseMembranes', !workingCheck_caseMembranes)}
      />
    </View>
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

export default WorkinCheckStep;