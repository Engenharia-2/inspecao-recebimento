import { StyleSheet } from 'react-native';
import { Colors } from '../assets/Colors';

export const stylesUI = StyleSheet.create({
  noDevicesText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.primaryOrange,
    fontSize: 16,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
    zIndex: 0,
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
  buttonRemove: {
    backgroundColor: Colors.red, 
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  imgButtonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonImg:{
    width: '49%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  buttonsContainer:{
    flex: 1, // Ocupa a metade inferior da tela
    justifyContent: 'center', // Centraliza os botões verticalmente
    marginBottom: 20, },
  buttonHome:{ 
    height: '31%',
    marginBottom: 8,
  },
  buttonClose:{
    marginHorizontal: 10,
  },
  buttonTextRemove: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  buttonDisabled:{
    backgroundColor: Colors.lightGray,
  },
  buttonPadding:{
    marginBottom: 40,
  },
  headerText:{
    color: Colors.primaryOrange,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  labelText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryOrange,
    marginBottom: 4,
    marginLeft: 10,
  },
  labelWhite:{
    color: Colors.white,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 10,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background, 
    paddingVertical: 24,
    padding: 8,
  },
  screenContainerNoPadding: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 24,
  },
  viewPadding:{
    paddingHorizontal: 8,
  },
  scrollableScreenContainer: {
    backgroundColor: Colors.background, 
    paddingVertical: 25,
  },
  scrollContent: {
    paddingVertical: 25,
    flexGrow: 1,
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
  inputGroup: {
    width: '100%',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo semi-transparente para modais
  },
  colorInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  container: {
    flex: 1,
  }, 

  logoContainer: {
    height: '25%',
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    backgroundColor: Colors.white, // Cor de fundo da seção do logo
    borderRadius: 30,
    elevation: 4,
    marginTop: 10,
  },
  logoImage: {
    width: '90%', // Ajuste o tamanho da imagem do logo
    height: '90%',
  },
  pagerView: {
    flex: 1,
  },
}) 
