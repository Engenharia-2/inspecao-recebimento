import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';

const FinalObservationStep: React.FC = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const qualityTechnician = useAppStore((state) => state.qualityTechnician);
  const qualityObservations = useAppStore((state) => state.qualityObservations);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <CustomTitle title='Observações finais'/>
        <CustomInput
          label="Técnico Responsável:"
          placeholder="Nome do Técnico"
          value={qualityTechnician || ''}
          onChangeText={(text) => updateReportField('qualityTechnician', text)}
        />
        <CustomInput
          label="Observações Finais:"
          style={[styles.input, { height: 100 }]}
          placeholder="Adicione observações finais sobre a inspeção"
          value={qualityObservations || ''}
          onChangeText={(text) => updateReportField('qualityObservations', text)}
          multiline
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
            title="Fechar formulário"
            onPress={() => navigation.navigate('Select')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  labelText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 4,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 4, // Sombra para Android
    marginBottom: 8,
  },
});

export default FinalObservationStep;
