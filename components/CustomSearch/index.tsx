import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from './style';

interface CustomSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  value,
  onChangeText,
  placeholder = 'Pesquisar...',
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
};

export default CustomSearch;
