import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useAppStore } from '../../store';
import { Colors } from '../../assets/Colors';

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
     <View style={styles.titleContainer}>
        <Text style={styles.title}> Inspeção dos componentes </Text>
      </View>
      <CustomInput 
        label="Funcionário"
        value={entryTechnician || ''} 
        onChangeText={(text) => updateReportField('entryTechnician', text)} 
        placeholder="Digite o nome do funcionário"
      />
      
      <View style={styles.containerBox}>
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
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
  titleContainer:{
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textLight,
  },
});

export default InspectionStep;