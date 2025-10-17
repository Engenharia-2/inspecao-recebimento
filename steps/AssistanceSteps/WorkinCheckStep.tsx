import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useAppStore } from '../../store';
import { Colors } from "../../assets/Colors";
import CustomTitle from '../../components/CustomTitle';
import { getChecklistForModel, CURRENT_FORM } from '../../models/equipmentConfig';

const WorkinCheckStep = () => {
  const model = useAppStore((state) => state.model);
  const workingCheck = useAppStore((state) => state.workingCheck) || {};
  const updateWorkingCheck = useAppStore((state) => state.updateWorkingCheck);

  // Selecionar cada valor legado individualmente para evitar loops de renderização
  const legacy_powerOn = useAppStore((state) => state.workingCheck_powerOn);
  const legacy_buttonsLeds = useAppStore((state) => state.workingCheck_buttonsLeds);
  const legacy_predefinedTests = useAppStore((state) => state.workingCheck_predefinedTests);
  const legacy_screen = useAppStore((state) => state.workingCheck_screen);
  const legacy_caseMembranes = useAppStore((state) => state.workingCheck_caseMembranes);
  
  const updateReportField = useAppStore((state) => state.updateReportField);

  const checklist = getChecklistForModel(model);

  const renderLegacyForm = () => (
    <>
      <CustomCheckbox
        label="Ligar equipamento"
        value={!!legacy_powerOn}
        onValueChange={() => updateReportField('workingCheck_powerOn', !legacy_powerOn)}
        helpText="Conecte o equipamento na tomada e verifique se o led de indicação acende."
      />
      <CustomCheckbox
        label="Testar botões e LEDs"
        value={!!legacy_buttonsLeds}
        onValueChange={() => updateReportField('workingCheck_buttonsLeds', !legacy_buttonsLeds)}
        helpText="Verifique se todos os botões e LEDs estão funcionando corretamente."
      />
      <CustomCheckbox
        label="Realizar testes predefinidos"
        value={!!legacy_predefinedTests}
        onValueChange={() => updateReportField('workingCheck_predefinedTests', !legacy_predefinedTests)}
        helpText="Execute os testes predefinidos do equipamento e verifique se os resultados estão corretos."
      />
      <CustomCheckbox
        label="Verificar tela"
        value={!!legacy_screen}
        onValueChange={() => updateReportField('workingCheck_screen', !legacy_screen)}
        helpText="Verifique se a tela está funcionando corretamente, sem manchas ou pixels mortos."
      />
      <CustomCheckbox
        label="Verificar maleta e membranas"
        value={!!legacy_caseMembranes}
        onValueChange={() => updateReportField('workingCheck_caseMembranes', !legacy_caseMembranes)}
        helpText="Verifique se a maleta e as membranas estão em bom estado."
      />
    </>
  );

  const renderDynamicForm = () => {
    if (!Array.isArray(checklist)) return null;

    return checklist.map((item) => (
      <CustomCheckbox
        key={item.label}
        label={item.label}
        value={!!workingCheck[item.label]}
        onValueChange={() => updateWorkingCheck(item.label, !workingCheck[item.label])}
        helpText={item.helpText}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <CustomTitle title='Verificação de funcionamento'/>
      <View style={styles.containerBox}>
        {checklist === CURRENT_FORM ? renderLegacyForm() : renderDynamicForm()}
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
    height: '90%',
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
