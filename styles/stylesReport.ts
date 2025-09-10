import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../assets/Colors';

export const stylesReport = StyleSheet.create({
  buttonPreviewItem:{
    alignItems: 'flex-end',
    marginRight: 50, // Espaçamento entre os itens da FlatList
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
  imagePreviewItem: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
    marginRight: 15, // Espaçamento entre os itens da FlatList
    width: 180, // <<<< Largura fixa para cada item da prévia. Ajuste conforme necessário. >>>>
    minHeight: 180, 
    justifyContent: 'space-between', // Distribui espaço verticalmente
    flexDirection: 'column', // Assegura que os itens fiquem em coluna
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
  logoPreviewContainer:{
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
  buttonTextRemove: {
    color: Colors.white,
    fontWeight: '600', 
    fontSize: 18,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  scrollViewContent: {
    paddingHorizontal: 10, // Adiciona padding nas laterais
    alignItems: 'flex-start', // Alinha os itens ao topo (se houver variação de altura)
  },
  recordItem: {
    width: 300, // Cada item ocupa 80% da largura da tela para scroll
    marginRight: 15, // Espaçamento entre os itens
    marginBottom: 10,
    padding: 15, // Padding interno para o item
    borderWidth: 1,
    borderColor: Colors.lightGray, // Borda para separar visualmente
    borderRadius: 8,
    backgroundColor: Colors.white, // Fundo branco para os itens
    shadowColor: '#000', // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temperatureRecordItem: {
    width: '100%',
    marginBottom: 16, 
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: 8,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'column',
  },
  descriptionInput: {
    marginTop: 10,
    fontSize: 14,
    minHeight: 60, // Aumenta a altura mínima para o TextInput multiline
    textAlignVertical: 'top', // Alinha o texto no topo para multiline
    backgroundColor: Colors.background, // Cor de fundo para o input
    borderRadius: 5,
    padding: 10,
  },
  historyItem: {
    fontSize: 14,
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightSeparator,
    color: Colors.textMuted,
  },
  historyContainer: {
    padding: 10,

  },
  historyContainerWrapper: {
    flex: 1,
    maxHeight: 250,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: 20,
    backgroundColor: Colors.white,
    elevation: 4,
    padding: 8,
  },
  imageDescriptionText: {
    color: Colors.primaryOrange,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 150,
  },
  flatListContent:{
    paddingLeft: 20, 
    paddingVertical: 10,
  },
  buttonsContainer:{
    flexDirection: 'row',
  },
  buttonsReport:{
    width: '40%',
  },
  checkboxContainer:{
    padding: 8,
    paddingRight: 18,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
  checkbox:{
    width: 32,
    height: 32,
  },
  descriptionContainer: {
    padding: 2,
    minHeight: 100,
    height: '75%',
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
  containerCamp:{
    minHeight: 100,
    height: 400,
    width: '100%',
    marginBottom: 30,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
  },
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
  containerReport:{
    minHeight: 100,
    height: '75%',
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
    paddingTop: 8,
  },
  buttonIcon: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsIconContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  itemContainer: {
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    elevation: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemInfo: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteReportButton: {
    backgroundColor: Colors.red,
    borderRadius: 30,
    height: 40,
    width: 40,
    alignItems: 'center',
  },
  reportButton: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: 30,
    paddingHorizontal: 10,
    height: 40,
    width: 40,
  },
  closeReportButton: {
    position: 'absolute',
    top: 35,
    right: 10,
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 5,
  },
  pdfContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
    },
  pdf: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      padding: 10,
  },
  
})

