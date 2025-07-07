import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from "react-native";

import { Feather } from "@expo/vector-icons";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";


import { AuthContext } from "../../context/AuthContext";
import socketService from "../../services/SocketService";


type RouteDetailParams = {
  InAttendance: {
    id: string;
    name: string;
    status: string;
    total: number;
    table_id: number;
  };
};

export type TableProps = {
  id: string;
  table_id: string;
  total: number | string;
  name: string
};

type FinishOrderRouteProp = RouteProp<RouteDetailParams, "InAttendance">;

export function FinishOrder() {
  const { user } = useContext(AuthContext);

  const { InAttendance, loadingAuth } = useContext(AuthContext);

  const route = useRoute<FinishOrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

  const [Order, setOrder] = useState<TableProps>();

  async function handleFinishOrder() {

    const id = String(Order?.id)

    try {
    await InAttendance({id})

      navigation.navigate("InAttendance", {
        id: route.params?.id,
        name: route.params?.name,
        status: route.params?.status,
        total: route.params?.total,
        table_id: route.params?.table_id,
      });

      
      socketService.emit("send.order", {
        table: "pedido enviado"
       });
     
    } catch (error) {
      ToastAndroid.show("Erro!", ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    async function loadingtotal() {
      const response = await api.put("/order", {
        order_id: user?.id as string,
      });
      setOrder(response.data);
    }
    loadingtotal();
  }, []);
  

  return (
    <>
    
      <View style={styles.total}>
        
        
        <Text style={styles.title}>Total do pedido</Text>
        <Text style={styles.value}>
          R$ {Number(Order?.total).toFixed(2)}
        </Text>
      </View>

      {loadingAuth ? (
             <View
             style={{
               flex: 1,
               backgroundColor: "#1D1D2E",
               justifyContent: "center",
               alignItems: "center",
             }}
           >
             <ActivityIndicator size={60} color="#FFF" />
           </View>
          ) : (
      <Image style={styles.logo} source={require("../../assests/avalie.png")} />)}

      <View style={styles.container}>
        <Text style={styles.alert}>{Order?.name}, você deseja enviar esse pedido?</Text>
        <Text style={styles.title}>Mesa {Order?.table_id} </Text>

        <TouchableOpacity style={styles.button} onPress={handleFinishOrder}>
          {loadingAuth ? (
            <ActivityIndicator size={25} color="#FFF" />
          ) : (
            <Text style={styles.textButton}>
              Enviar pedido{" "}
              <Feather name="shopping-cart" size={20} color="#1d1d2e" />
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  total: {
    backgroundColor: "#1d1d2e",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingVertical: "5%",
    paddingHorizontal: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  alert: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  value: {
    fontSize: 25,
    color: "#088670",
    fontWeight: "bold",
    marginBottom: 12,
    backgroundColor: "#f2c812",
    width: "100%",
    paddingBottom: 10,
    paddingTop: 10,

    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3fffa3",
    flexDirection: "row",
    width: "65%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 12
  },
  logo: {
    width: 'auto',
    height: 395,
    backgroundColor: "#1D1D2E",
  },
  textButton: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "#1d1d2e",
  },
});
