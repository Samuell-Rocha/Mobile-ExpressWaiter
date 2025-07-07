import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import socketService from "../../services/SocketService";
import { AuthContext } from "../../context/AuthContext";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const CustomHeaderTitle = () => {
    const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handlePress = () => {
    socketService.emit("chat.message", {
      table: user.table_id,
      name: user.name
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Concluindo</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <MaterialCommunityIcons name="hand-wave-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "2%", // Adiciona padding em relação ao tamanho da tela
    },
    title: {
      color: "#FFF",
      fontSize: 20,
      marginRight: "43%", // Adiciona margem à direita do texto
    },
    button: {
      marginLeft: "2%", // Adiciona margem à esquerda do botão
    },
  });
  
export default CustomHeaderTitle;
