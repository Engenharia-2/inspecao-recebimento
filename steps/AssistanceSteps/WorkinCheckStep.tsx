import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useAppStore } from '../../store';
import { Colors } from "../../assets/Colors";
import CustomTitle from '../../components/CustomTitle';

const WorkinCheckStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const workingCheck_powerOn = useAppStore((state) => state.workingCheck_powerOn);
  const workingCheck_buttonsLeds = useAppStore((state) => state.workingCheck_buttonsLeds);
  const workingCheck_predefinedTests = useAppStore((state) => state.workingCheck_predefinedTests);
  const workingCheck_screen = useAppStore((state) => state.workingCheck_screen);
  const workingCheck_caseMembranes = useAppStore((state) => state.workingCheck_caseMembranes);

  return (
    <View style={styles.container}>
      <CustomTitle title='Verificação de funcionamento'/>
      <View style={styles.containerBox}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  containerBox:{
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
});

export default WorkinCheckStep;