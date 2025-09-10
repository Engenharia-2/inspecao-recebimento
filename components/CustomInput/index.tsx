import React, { FC } from 'react';
import { View, Text, TextInput, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { styles } from './style';

interface CustomInputProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const CustomInput: FC<CustomInputProps> = ({ label, containerStyle, labelStyle, inputStyle, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={styles.input.color} // Using a slightly transparent version of the text color for placeholder
        {...props}
      />
    </View>
  );
};

export default CustomInput;
