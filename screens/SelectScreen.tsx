import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store';
import { Colors } from '../assets/Colors';
import { useReportGenerator } from '../hooks/useReportGenerator'; // Import hook


type RootStackParamList = {
  Home: undefined;
  Select: { sessionId: number };
  Entry: undefined;
  Assistance: undefined;
  Quality: undefined;
};

type SelectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Select'>;

interface SelectScreenProps {
  navigation: SelectScreenNavigationProp;
}

const SelectScreen: React.FC<SelectScreenProps> = ({ navigation }) => {
  const isEntryComplete = useAppStore(state => state.isEntryComplete);
  const isAssistanceComplete = useAppStore(state => state.isAssistanceComplete);
  const isQualityComplete = useAppStore(state => state.isQualityComplete);
  const currentSession = useAppStore(state => state.currentSession);

  const { isGenerating, generateReport } = useReportGenerator(); // Import hook

  useEffect(() => {
    // console.log("SelectScreen: currentSession changed:", currentSession);
    if (!currentSession) {
      // console.log("SelectScreen: No currentSession, navigating to Home.");
      navigation.navigate('Home');
    }
  }, [currentSession, navigation]);

  const isAllComplete = isEntryComplete && isAssistanceComplete && isQualityComplete;

  const handlePress = (screen: keyof Omit<RootStackParamList, 'Select' | 'Home'>) => {
    navigation.navigate(screen);
  };

  const handleGenerateReport = () => {
    generateReport();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainButtonsContainer}>
        <CustomButton
          title="Entrada"
          onPress={() => handlePress('Entry')}
          style={[styles.button, isEntryComplete && styles.buttonComplete]}
          textStyle={isEntryComplete ? styles.buttonCompleteText : {}}
        />
        <CustomButton
          title="Assistência"
          onPress={() => handlePress('Assistance')}
          style={[styles.button, isAssistanceComplete && styles.buttonComplete]}
          textStyle={isAssistanceComplete ? styles.buttonCompleteText : {}}
        />
        <CustomButton
          title="Qualidade"
          onPress={() => handlePress('Quality')}
          style={[styles.button, isQualityComplete && styles.buttonComplete]}
          textStyle={isQualityComplete ? styles.buttonCompleteText : {}}
        />
      </View>
      <View style={styles.footerButtonContainer}>
        <CustomButton
          title={isGenerating ? 'Gerando Relatório...' : 'Finalizar e Gerar Relatório'}
          onPress={handleGenerateReport}
          disabled={isGenerating || !isAllComplete}
          style={isGenerating || !isAllComplete ? styles.buttonDisabled : {}}
        />
        {isGenerating && <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />}
        <CustomButton
          title="Voltar para o início"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  mainButtonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: '25%',
    marginBottom: 20,
  },
  buttonComplete: {
    backgroundColor: Colors.green,
  },
  buttonCompleteText: { // New style for text on green button
    color: Colors.white,
  },
  footerButtonContainer: {
    paddingBottom: 20,
  },
  spinner: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100, // Adjust position
  },
  buttonDisabled:{
    backgroundColor: Colors.lightGray,
  },
});

export default SelectScreen;