import React, { useState, useMemo } from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet } from 'react-native';

import CreateCustomFieldModal from '../../components/CreateCustomFieldModal';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { Colors } from '../../assets/Colors';
import { useAppStore } from '../../store';
import { useKeyboardAwareScrollView } from '../../hooks/useKeyboardAwareScrollView';
import CustomTitle from '../../components/CustomTitle';

const DynamicFieldsStep: React.FC = () => {
  // Seleciona a lista inteira para evitar recriação em cada render
  const allCustomFields = useAppStore((state) => state.customFields);

  // Filtra a lista com useMemo para otimização
  const customFields = useMemo(() =>
    (allCustomFields || []).filter(field => field.stage === 'assistance_plan'),
    [allCustomFields]
  );

  const addCustomField = useAppStore((state) => state.addCustomField);
  const updateCustomFieldValue = useAppStore((state) => state.updateCustomFieldValue);
  const removeCustomField = useAppStore((state) => state.removeCustomField);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scrollViewRef = useKeyboardAwareScrollView();

  const handleAddField = (title: string) => {
    // Adiciona o campo com o stage correto
    addCustomField(title, 'assistance_plan');
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomTitle title='Plano de Ação'/>
        <Text style={styles.label}>
          Indique o plano de ação com o título e descreva a intervenção necessária.
        </Text>
        <CustomButton
          title="Adicionar Novo Campo de Texto"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    zIndex: 0,
  },
  label:{
    fontSize: 16,
    textAlign: 'center',
    padding: 8,
  },
  scrollContent: {
    paddingVertical: 25,
    flexGrow: 1,
  },
  viewPadding:{
    paddingHorizontal: 8,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 8,
  },
  containerCamp:{
    minHeight: 100,
    height: 275,
    width: '100%',
    marginBottom: 30,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
});


export default React.memo(DynamicFieldsStep);
