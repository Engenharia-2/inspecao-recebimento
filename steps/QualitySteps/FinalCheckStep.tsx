import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomTitle from '../../components/CustomTitle';
import { useAppStore } from '../../store';
import { Colors } from '../../assets/Colors';

const FinalCheckStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const finalCheck_case = useAppStore((state) => state.finalCheck_case);
  const finalCheck_membrane = useAppStore((state) => state.finalCheck_membrane);
  const finalCheck_buttons = useAppStore((state) => state.finalCheck_buttons);
  const finalCheck_screen = useAppStore((state) => state.finalCheck_screen);
  const finalCheck_test = useAppStore((state) => state.finalCheck_test);
  const finalCheck_saveReports = useAppStore((state) => state.finalCheck_saveReports);
  const finalCheck_calibrationPrint = useAppStore((state) => state.finalCheck_calibrationPrint);
  const finalCheck_backup = useAppStore((state) => state.finalCheck_backup);

  return (
    <View style={styles.container}>
      <CustomTitle title='Inspeção dos componentes'/>
      <View style={styles.containerBox}>
        <CustomCheckbox
          label="Maleta"
          value={!!finalCheck_case}
          onValueChange={() => updateReportField('finalCheck_case', !finalCheck_case)}
        />
        <CustomCheckbox
          label="Membrana"
          value={!!finalCheck_membrane}
          onValueChange={() => updateReportField('finalCheck_membrane', !finalCheck_membrane)}
        />
        <CustomCheckbox
          label="Botões"
          value={!!finalCheck_buttons}
          onValueChange={() => updateReportField('finalCheck_buttons', !finalCheck_buttons)}
        />
        <CustomCheckbox
          label="Tela"
          value={!!finalCheck_screen}
          onValueChange={() => updateReportField('finalCheck_screen', !finalCheck_screen)}
        />
        <CustomCheckbox
          label="Teste"
          value={!!finalCheck_test}
          onValueChange={() => updateReportField('finalCheck_test', !finalCheck_test)}
        />
        <CustomCheckbox
          label="Salvar Relatórios"
          value={!!finalCheck_saveReports}
          onValueChange={() => updateReportField('finalCheck_saveReports', !finalCheck_saveReports)}
        />
        <CustomCheckbox
          label="Print da calibração"
          value={!!finalCheck_calibrationPrint}
          onValueChange={() => updateReportField('finalCheck_calibrationPrint', !finalCheck_calibrationPrint)}
        />
        <CustomCheckbox
          label="Fazer backup do equipamento"
          value={!!finalCheck_backup}
          onValueChange={() => updateReportField('finalCheck_backup', !finalCheck_backup)}
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

export default FinalCheckStep;