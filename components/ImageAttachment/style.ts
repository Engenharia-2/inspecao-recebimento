import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/Colors';

export const styles = StyleSheet.create({
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
    color: Colors.primaryBlue,
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonTextRemove: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  labelText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: 4,
    marginLeft: 10,
  },
  buttonImg:{
    width: '49%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  imgButtonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  removeImageButton: {
    backgroundColor: Colors.red,
    marginTop: 10,
    borderRadius: 20,
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
    width: 180,
    marginRight: 15,
    justifyContent: 'space-between', // Distribui espaço verticalmente
    flexDirection: 'column',
    elevation: 20, // Sombra para Android
  },
  imageDescriptionText: {
    color: Colors.primaryBlue,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 150,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
  flatListContent:{
    paddingLeft: 20, 
    paddingVertical: 10,
  },
})