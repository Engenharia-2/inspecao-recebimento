import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/Colors';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '48%',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  headerText:{
    color: Colors.primaryOrange,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 4, // Sombra para Android
    marginBottom: 8,
  },
  button:{
    backgroundColor: Colors.white,
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
    color: Colors.primaryOrange,
    fontWeight: 'bold',
    fontSize: 18,
  },
});