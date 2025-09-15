import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { styles } from './style';

interface CustomDropdownProps {
  label: string;
  value: any;
  items: ItemType<any>[];
  onValueChange: (value: any) => void;
  placeholder?: string;
  zIndex?: number;
  zIndexInverse?: number;
  dropDownDirection?: 'TOP' | 'BOTTOM' | 'AUTO';
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  items,
  onValueChange,
  placeholder = 'Selecione...',
  zIndex = 1000,
  zIndexInverse = 1000,
  dropDownDirection = 'AUTO',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.container, { zIndex }]}>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = typeof callback === 'function' ? callback(value) : callback;
          onValueChange(newValue);
        }}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        placeholder={placeholder}
        listMode="SCROLLVIEW"
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        dropDownDirection={dropDownDirection}
      />
    </View>
  );
};

export default CustomDropdown;
