import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Feather} from '@expo/vector-icons';
import { api } from "../../services/api";

interface ModalHelpProps {
  
  handleCloseModal: () => void;
  
}

const B = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => <Text style={{fontWeight: 'bold', fontSize: 20}}>{props.children}</Text>

export function ModalHelp({handleCloseModal}: ModalHelpProps) {

  return (
<TouchableOpacity style={styles.container}onPress={handleCloseModal}>
    <View style={styles.content} >
      
      <Text style={styles.title}>Instruções</Text>
      <Text style={styles.item}><B>1</B> - Para escolher algo do cardapio clique na primeira opção e escolha uma categoria</Text>
      <Text style={styles.item}><B>2</B> - Logo abaixo aparece os itens da categoria selecionada, clique para escolher algum </Text>
      <Text style={styles.item}><B>3</B> - Digite a quantidade e clique no botão +</Text>
      <Text style={styles.item}><B>4</B> - Após, clique em avançar e enviar pedido</Text>
      <Text style={styles.item}><B>5</B> - Aguarde, caso queira pedir mais clique no botão solicitar novo pedido </Text>
      <Text style={styles.item}><B>6</B> - Caso precise chamar o garçom, aperte no ícone de mão acenando no canto superior direito </Text>
      
    </View>
    </TouchableOpacity>

    

   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 'auto',
    width: 'auto',
    marginBottom: 40,
  },
  content:{
    backgroundColor: '#1d1d2e',
    borderWidth: 1,
    borderColor: '#8a8a8a',
    borderRadius: 4,
    marginTop: '28%',
    padding: 15
},
item:{
  color: "#FFF",
  marginBottom: 15,
  fontSize: 15,
},
  title:{
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 14,
    marginBottom: 10,
    textAlign: 'center',
  }
 
});
