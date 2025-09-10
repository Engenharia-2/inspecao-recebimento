import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useAppStore } from '../../store';

const CleanCheckStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const cleanCheck_equipmentCleaning = useAppStore((state) => state.cleanCheck_equipmentCleaning);
  const cleanCheck_screws = useAppStore((state) => state.cleanCheck_screws);
  const cleanCheck_hotGlue = useAppStore((state) => state.cleanCheck_hotGlue);
  const cleanCheck_measurementCables = useAppStore((state) => state.cleanCheck_measurementCables);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Limpeza e checagem interna</Text>
      <CustomCheckbox
        label="Limpeza do equipamento"
        value={!!cleanCheck_equipmentCleaning}
        onValueChange={() => updateReportField('cleanCheck_equipmentCleaning', !cleanCheck_equipmentCleaning)}
      />
      <CustomCheckbox
        label="Parafusos"
        value={!!cleanCheck_screws}
        onValueChange={() => updateReportField('cleanCheck_screws', !cleanCheck_screws)}
      />
      <CustomCheckbox
        label="Cola quente"
        value={!!cleanCheck_hotGlue}
        onValueChange={() => updateReportField('cleanCheck_hotGlue', !cleanCheck_hotGlue)}
      />
      <CustomCheckbox
        label="Limpar os cabos de medição"
        value={!!cleanCheck_measurementCables}
        onValueChange={() => updateReportField('cleanCheck_measurementCables', !cleanCheck_measurementCables)}
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

export default CleanCheckStep;