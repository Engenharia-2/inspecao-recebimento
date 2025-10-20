import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomTitle from '../../components/CustomTitle';
import { useAppStore } from '../../store';
import { Colors } from '../../assets/Colors';
import { getFinalChecklistForModel, CURRENT_FORM } from '../../models/equipmentConfig';

const FinalCheckStep = () => {
  const model = useAppStore((state) => state.model);
  const updateReportField = useAppStore((state) => state.updateReportField);

  // State for dynamic form
  const finalCheck = useAppStore((state) => state.finalCheck) || {};
  const updateFinalCheck = useAppStore((state) => state.updateFinalCheck);

  // State for legacy form (individual selection to prevent loops)
  const legacy_case = useAppStore((state) => state.finalCheck_case);
  const legacy_membrane = useAppStore((state) => state.finalCheck_membrane);
  const legacy_buttons = useAppStore((state) => state.finalCheck_buttons);
  const legacy_screen = useAppStore((state) => state.finalCheck_screen);
  const legacy_test = useAppStore((state) => state.finalCheck_test);
  const legacy_saveReports = useAppStore((state) => state.finalCheck_saveReports);
  const legacy_calibrationPrint = useAppStore((state) => state.finalCheck_calibrationPrint);
  const legacy_backup = useAppStore((state) => state.finalCheck_backup);

  const checklist = getFinalChecklistForModel(model);

  const renderLegacyForm = () => (
    <>
      <CustomCheckbox
        label="Maleta"
        value={!!finalCheck['Maleta']}
        onValueChange={() => updateFinalCheck('Maleta', !finalCheck['Maleta'])}
        helpText="Verifique se a maleta está em bom estado."
      />
      <CustomCheckbox
        label="Membrana"
        value={!!finalCheck['Membrana']}
        onValueChange={() => updateFinalCheck('Membrana', !finalCheck['Membrana'])}
        helpText="Verifique se a membrana está em bom estado."
      />
      <CustomCheckbox
        label="Botões"
        value={!!finalCheck['Botões']}
        onValueChange={() => updateFinalCheck('Botões', !finalCheck['Botões'])}
        helpText="Verifique se todos os botões estão funcionando corretamente."
      />
      <CustomCheckbox
        label="Tela"
        value={!!finalCheck['Tela']}
        onValueChange={() => updateFinalCheck('Tela', !finalCheck['Tela'])}
        helpText="Verifique se a tela está funcionando corretamente, sem manchas ou pixels mortos."
      />
      <CustomCheckbox
        label="Teste"
        value={!!finalCheck['Teste']}
        onValueChange={() => updateFinalCheck('Teste', !finalCheck['Teste'])}
        helpText="Realize um teste final em tensão máxima por 5 minutos "
      />
      <CustomCheckbox
        label="Salvar Relatórios"
        value={!!finalCheck['Salvar Relatórios']}
        onValueChange={() => updateFinalCheck('Salvar Relatórios', !finalCheck['Salvar Relatórios'])}
        helpText="Salve os relatórios no equipamento."
      />
      <CustomCheckbox
        label="Print da calibração"
        value={!!finalCheck['Print da calibração']}
        onValueChange={() => updateFinalCheck('Print da calibração', !finalCheck['Print da calibração'])}
        helpText="Tire um print da tela de calibração para o relatório e salvar a imagem."
      />
      <CustomCheckbox
        label="Fazer backup do equipamento"
        value={!!finalCheck['Fazer backup do equipamento']}
        onValueChange={() => updateFinalCheck('Fazer backup do equipamento', !finalCheck['Fazer backup do equipamento'])}
        helpText="Faça o backup dos dados do equipamento."
      />
    </>
  );

  const renderDynamicForm = () => {
    if (!Array.isArray(checklist)) return null;

    return checklist.map((item) => (
      <CustomCheckbox
        key={item.label}
        label={item.label}
        value={!!finalCheck[item.label]}
        onValueChange={() => updateFinalCheck(item.label, !finalCheck[item.label])}
        helpText={item.helpText}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <CustomTitle title='Inspeção dos componentes' />
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
  containerBox: {
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

export default FinalCheckStep;
