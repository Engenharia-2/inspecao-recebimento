import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomTitle from '../../components/CustomTitle'
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomInput from '../../components/CustomInput'; // Importar CustomInput
import { useAppStore } from '../../store';
import { Colors } from '../../assets/Colors';
import { getCleanChecklistForModel } from '../../models/equipmentConfig';

const CleanCheckStep = () => {
  const model = useAppStore((state) => state.model);
  const cleanCheck = useAppStore((state) => state.cleanCheck) || {};
  const updateCleanCheck = useAppStore((state) => state.updateCleanCheck);
  const updateReportField = useAppStore((state) => state.updateReportField);

  // Buscar os valores dos novos campos de teste
  const test1 = useAppStore((state) => state.cleanCheck_test1);
  const test2 = useAppStore((state) => state.cleanCheck_test2);
  const test3 = useAppStore((state) => state.cleanCheck_test3);
  const test4 = useAppStore((state) => state.cleanCheck_test4);
  const test5 = useAppStore((state) => state.cleanCheck_test5);

  const checklist = getCleanChecklistForModel(model);
  const isMeg1kv = model?.includes('Megohmetro 1kv');
  const isMeg5kv = model?.includes('Megohmetro 5kv');

  const getValidationStatus = (value: string | undefined) => {
    if (!value) return undefined;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'disapproved';
    if (numericValue >= 290 && numericValue <= 310) return 'approved';
    return 'disapproved';
  };

  return (
    <View style={styles.container}>
      <CustomTitle title='Limpeza e checagem interna' />
      <ScrollView style={styles.containerBox} contentContainerStyle={styles.contentContainer}>
        {checklist.map((item) => (
          <CustomCheckbox
            key={item.label}
            label={item.label}
            value={!!cleanCheck[item.label]}
            onValueChange={() => updateCleanCheck(item.label, !cleanCheck[item.label])}
            helpText={item.helpText}
          />
        ))}
        
        {isMeg1kv && (
          <View style={styles.inputsContainer}>
            <CustomInput
              label="Teste 1 - 1 min - 250V"
              value={test1 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test1', text)}
              placeholder="Valor do Teste 1"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test1)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 2 - 1 min - 500V"
              value={test2 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test2', text)}
              placeholder="Valor do Teste 2"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test2)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 3 - 1 min - 750V"
              value={test3 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test3', text)}
              placeholder="Valor do Teste 3"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test3)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 4 - 10 min - 1000V"
              value={test4 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test4', text)}
              placeholder="Valor do Teste 4"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test4)}
              inputStyle={{ width: '85%' }}
            />
          </View>
        )}

        {isMeg5kv && (
          <View style={styles.inputsContainer}>
            <CustomInput
              label="Teste 1 - 1 min - 1000V"
              value={test1 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test1', text)}
              placeholder="Valor do Teste 1"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test1)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 2 - 1 min - 2000V"
              value={test2 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test2', text)}
              placeholder="Valor do Teste 2"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test2)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 3 - 1 min - 3000V"
              value={test3 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test3', text)}
              placeholder="Valor do Teste 3"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test3)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 4 - 1 min - 4000V"
              value={test4 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test4', text)}
              placeholder="Valor do Teste 4"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test4)}
              inputStyle={{ width: '85%' }}
            />
            <CustomInput
              label="Teste 5 - 10 min - 5000V"
              value={test5 || ''}
              onChangeText={(text) => updateReportField('cleanCheck_test5', text)}
              placeholder="Valor do Teste 5"
              keyboardType="numeric"
              validationStatus={getValidationStatus(test5)}
              inputStyle={{ width: '85%' }}
            />
          </View>
        )}
      </ScrollView>
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
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
  contentContainer: {
    alignItems: 'flex-start',
  },
  inputsContainer: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default CleanCheckStep;