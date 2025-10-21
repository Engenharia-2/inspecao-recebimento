import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomTitle from '../../components/CustomTitle'
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
      <CustomTitle title='Inspeção dos componentes'/>
      
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
});

export default InspectionStep;