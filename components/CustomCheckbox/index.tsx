import React, { FC } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Checkbox, { CheckboxProps } from 'expo-checkbox';
import { styles } from './style';
import { Colors } from '../../assets/Colors'; 

interface CustomCheckboxProps extends CheckboxProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({ label, value, onValueChange, color = Colors.green, style, containerStyle, labelStyle, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color={color}
        style={[styles.checkbox, style]}
        {...props}
      />
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </View>
  );
};

export default CustomCheckbox;
