import React, { FC } from 'react';
import { View, Text, TextInput, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { styles } from './style';
import { Feather } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  validationStatus?: 'approved' | 'disapproved' | undefined;
}

const CustomInput: FC<CustomInputProps> = ({ label, containerStyle, labelStyle, inputStyle, validationStatus, ...props }) => {
  const renderIcon = () => {
    if (validationStatus === 'approved') {
      return <Feather name="check-circle" size={24} color="green" style={styles.icon} />;
    }
    if (validationStatus === 'disapproved') {
      return <Feather name="x-circle" size={24} color="red" style={styles.icon} />;
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle, { flex: 1 }]}
          placeholderTextColor={styles.input.color} // Using a slightly transparent version of the text color for placeholder
          {...props}
        />
        {renderIcon()}
      </View>
    </View>
  );
};

export default CustomInput;
