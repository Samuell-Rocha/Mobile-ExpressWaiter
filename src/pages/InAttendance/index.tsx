import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from "../../context/AuthContext";
import socketService from "../../services/SocketService";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Assessment } from "../../components/ModalAssess";

export function InAttendance() {
  const { order, finishTable, loadingAuth } = useContext(AuthContext);
  const [modalRating, setModalRating] = useState(false);
  const [orders, setOrder] = useState(order);

  const [isAVisible, setAVisible] = useState(true);
  const [isBVisible, setBVisible] = useState(false);

  async function handleFinish() {
    try {
      await api.put("/order/finish", {
        order_id: order.id,
      });

      finishTable();
    } catch (error) {
      ToastAndroid.show("Erro!", ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    const chatMessageHandler = (table: any) => {
      setOrder(table);
    };

    socketService.on("status.ready", chatMessageHandler);

    return () => {
      socketService.off("status.ready", chatMessageHandler);
    };
  }, []);

  useEffect(() => {
    const chatMessageHandlers = (table: any) => {
      setOrder(table);
      finishTable();
    };

    socketService.on("status.finish", chatMessageHandlers);

    return () => {
      socketService.off("status.finish", chatMessageHandlers);
    };
  }, []);

  useEffect(() => {
    const chatMessageHandler = (table: any) => {
      finishTable();
    };

    socketService.on("cancel.order", chatMessageHandler);

    return () => {
      socketService.off("cancel.order", chatMessageHandler);
    };
  }, []);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Em Atendimento</Text>
        <View style={styles.callWaiterContainer}>
          <TouchableOpacity
            style={styles.callWaiter}
            onPress={() => {
              socketService.emit("chat.message", {
                table: order.table_id,
                name: order.name,
              });
            }}
          >
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      {orders.status === "Em Atendimento" && (
        <Text style={styles.message}>
          Seu pedido está sendo feito. Aguarde...
        </Text>
      )}

      {orders.status === "Pedido Pronto" && (
        <Text style={styles.message}>
          Se precisar chamar, aperte no ícone de mão acenando no canto superior
          direito que virá um garçom
        </Text>
      )}

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
        <Image
          style={styles.logo}
          source={require("../../assests/hamburguer.gif")}
        />
      )}
      <View style={styles.container}>
        <>
          {isAVisible && (
            <Text style={styles.alert}>
              Para melhorar nossa experiência, ao final do atendimento por
              gentileza avalie-nos
            </Text>
          )}

          {isBVisible && (
            <Text style={styles.alert}>
              {order.name}, Obrigado pela preferência, Volte sempre
            </Text>
          )}
        </>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { width: isAVisible ? "auto" : "100%" }]}
          >
            <Text style={styles.textButton}>Pedir mais</Text>
          </TouchableOpacity>

          {isAVisible && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.more]}
                onPress={() => setModalRating(true)}
              >
                <Text style={styles.textButton}>Avaliar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Modal transparent={true} visible={modalRating} animationType="fade">
          <Assessment
            handleCloseModal={() => (
              setModalRating(false), setAVisible(false), setBVisible(true)
            )}
          />
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  total: {
    backgroundColor: "#1d1d2e",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    padding: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
  alert: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    padding: 5,
  },
  value: {
    fontSize: 25,
    color: "#088670",
    fontWeight: "bold",
    backgroundColor: "#f2c812",
    width: "100%",
    paddingBottom: 10,
    paddingTop: 10,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#3fffa3",
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    textAlign: "center",
    paddingHorizontal: 20, // Ajuste conforme necessário
  },
  logo: {
    width: "auto",
    height: "50%",
    backgroundColor: "#1d1d2e",
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1d1d2e",
    textAlign: "center",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  more: {
    marginLeft: 30,
  },
  title: {
    color: "#FFF",
    fontSize: 30,
    marginLeft: 20,
    paddingBottom: 30,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#1d1d2e",
    paddingTop: 20,
  },
  callWaiter: {
    marginLeft: 10,
  },
  callWaiterContainer: {
    marginLeft: 10,
    paddingBottom: 30,
  },
  message: {
    fontSize: 25,
    color: "#088670",
    fontWeight: "bold",
    backgroundColor: "#f2c812",
    width: "100%",
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
  },
});
