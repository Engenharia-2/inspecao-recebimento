import React, { FC, ReactNode } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { style as styles } from './style';

interface CustomButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
};

const CustomButton: FC<CustomButtonProps> = ({ title, onPress, disabled = false, style, textStyle, children }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      // Using concat is a safe way to merge styles, as it handles arrays and single objects gracefully.
      style={[styles.button].concat(style || []).concat(disabled ? styles.buttonDisabled : [])}
      disabled={disabled}
    >
      {children ? children : <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default CustomButton;