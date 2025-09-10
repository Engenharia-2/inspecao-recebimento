import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: 15,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: 15,
  },
});
