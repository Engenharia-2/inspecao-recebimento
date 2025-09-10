
import React, { FC, ReactNode } from 'react'; // Importe ReactNode
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
// Certifique-se de que 'styles' é importado corretamente ou use styles
// Exemplo: import { styles } from '../../styles/Colors';

import  {style as styles}  from './style';

interface CustomButtonProps {
  title?: string; // Título agora é opcional, pois pode haver children
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: ReactNode; // Adiciona a propriedade children
};

const CustomButton: FC<CustomButtonProps> = ({ title, onPress, disabled = false, style, textStyle, children }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      // Use styles.button e styles.buttonDisabled se eles contiverem seus estilos base
      style={[styles.button, style, disabled && styles.buttonDisabled]}
      disabled={disabled}
    >
      {/* Renderiza children se presente, caso contrário, renderiza o título */}
      {children ? children : <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default CustomButton;