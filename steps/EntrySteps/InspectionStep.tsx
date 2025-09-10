import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useAppStore } from '../../store';

const InspectionStep = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const entryTechnician = useAppStore((state) => state.entryTechnician);
  const returnItems = useAppStore((state) => state.returnItems);

  const retornoItems = ['Cabo de força', 'Manual', 'Bolsa de Cabos', 'Cabo de medição'];

  const handleRetornoChange = (item: string) => {
    const currentItems = returnItems || [];
    const newItems =
      currentItems.includes(item)
        ? currentItems.filter(i => i !== item)
        : [...currentItems, item];
    updateReportField('returnItems', newItems);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput 
        label="Funcionário"
        value={entryTechnician || ''} 
        onChangeText={(text) => updateReportField('entryTechnician', text)} 
        placeholder="Digite o nome do funcionário"
      />
      
      <View style={styles.checkboxGroup}>
        <Text style={styles.groupTitle}>Retornos</Text>
        {retornoItems.map(item => (
          <CustomCheckbox
            key={item}
            label={item}
            value={(returnItems || []).includes(item)}
            onValueChange={() => handleRetornoChange(item)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  checkboxGroup: {
    marginVertical: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});

export default InspectionStep;