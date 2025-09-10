import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/Colors';

export const style = StyleSheet.create({
 button:{
    backgroundColor: Colors.primaryOrange,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4, // A elevação no Android cria a sombra
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText:{
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonDisabled: {
    backgroundColor: Colors.lightGray,
  },

})