import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Select: undefined;
  Entry: undefined;
  Assistance: undefined;
  Quality: undefined;
};

type SelectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Select'>;

interface SelectScreenProps {
  navigation: SelectScreenNavigationProp;
}

const SelectScreen: React.FC<SelectScreenProps> = ({ navigation }) => {
  const handlePress = (screen: keyof Omit<RootStackParamList, 'Select'>) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        title="Entrada"
        onPress={() => handlePress('Entry')}
        style={styles.button}
      />
      <CustomButton
        title="Assistência"
        onPress={() => handlePress('Assistance')}
        style={styles.button}
      />
      <CustomButton
        title="Qualidade"
        onPress={() => handlePress('Quality')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  button:{
    height: '25%', }
});

export default SelectScreen;