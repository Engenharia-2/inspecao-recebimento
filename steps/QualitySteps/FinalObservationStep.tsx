import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { stylesUI } from '../../styles/stylesUI';
import { useAppStore } from '../../store';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const FinalObservationStep: React.FC = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const qualityTechnician = useAppStore((state) => state.qualityTechnician);
  const qualityObservations = useAppStore((state) => state.qualityObservations);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Observações Finais</Text>

        <Text style={stylesUI.labelText}>Técnico Responsável:</Text>
        <TextInput
          style={stylesUI.input}
          placeholder="Nome do Técnico"
          value={qualityTechnician || ''}
          onChangeText={(text) => updateReportField('qualityTechnician', text)}
        />

        <Text style={stylesUI.labelText}>Observações Finais:</Text>
        <TextInput
          style={[stylesUI.input, { height: 100 }]}
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
            style={[stylesUI.button, stylesUI.buttonDisabled]}
            textStyle={{...stylesUI.buttonText, color: Colors.darkGray}}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});

export default FinalObservationStep;
