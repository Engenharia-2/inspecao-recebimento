import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import { useAppStore } from '../../store';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CreateCustomFieldModal from '../../components/CreateCustomFieldModal';
import { useKeyboardAwareScrollView } from '../../hooks/useKeyboardAwareScrollView';

const FinalObservationStep: React.FC = () => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const qualityTechnician = useAppStore((state) => state.qualityTechnician);
  const navigation = useNavigation<any>();

  // --- Lógica dos Campos Dinâmicos ---
  const allCustomFields = useAppStore((state) => state.customFields);
  const customFields = useMemo(() => 
    (allCustomFields || []).filter(field => field.stage === 'quality'),
    [allCustomFields]
  );
  const addCustomField = useAppStore((state) => state.addCustomField);
  const updateCustomFieldValue = useAppStore((state) => state.updateCustomFieldValue);
  const removeCustomField = useAppStore((state) => state.removeCustomField);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scrollViewRef = useKeyboardAwareScrollView();

  const handleAddField = (title: string) => {
    addCustomField(title, 'quality');
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <CustomTitle title='Observações finais' />
        <CustomInput
          label="Técnico Responsável:"
          placeholder="Nome do Técnico"
          value={qualityTechnician || ''}
          onChangeText={(text) => updateReportField('qualityTechnician', text)}
        />

        {/* --- Seção de Campos Dinâmicos -- */}
        <Text style={styles.label}>
          Adicione observações ou campos relevantes para a etapa de qualidade.
        </Text>
        <CustomButton
          title="Adicionar Nova Observação"
          onPress={() => setIsModalVisible(true)}
        />
        <View style={styles.containerCamp}>
          <ScrollView style={styles.scrollContent} ref={scrollViewRef}>
            <View style={styles.viewPadding}>
              {customFields.map((field) => (
                <View key={field.id} style={styles.inputGroup}>
                  <CustomInput
                    label={`${field.title}:`}
                    value={field.value}
                    onChangeText={(text) => updateCustomFieldValue(field.id, text)}
                    placeholder={`Preencha o valor para ${field.title}`}
                  />
                  <CustomButton
                    title="Remover"
                    onPress={() => removeCustomField(field.id)}
                    style={{ backgroundColor: Colors.red, marginTop: 5, paddingVertical: 8 }}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <CreateCustomFieldModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onConfirm={handleAddField}
        />
      </ScrollView>

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
    paddingTop: 16,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    padding: 8,
    marginTop: 16,
  },
  scrollContent: {
    paddingVertical: 25,
    flexGrow: 1,
  },
  viewPadding: {
    paddingHorizontal: 8,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 8,
  },
  containerCamp: {
    minHeight: 100,
    height: 275,
    width: '100%',
    marginTop: 8,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
});

export default FinalObservationStep;
