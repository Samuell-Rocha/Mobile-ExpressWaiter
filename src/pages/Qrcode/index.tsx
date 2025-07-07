import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState, SetStateAction } from "react";

import { BarCodeScanner } from "expo-barcode-scanner";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

import { io } from "socket.io-client";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Button,
  ToastAndroid,
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";

import { AuthContext } from "../../context/AuthContext";
import { Camera, CameraType } from "expo-camera";
import { api } from "../../services/api";

import socketService from "../../services/SocketService";

export type TableProps = {
  id: number;
  qrcode: string;
  nameqrcode: string;
};

export default function Qrcode() {
  const { OpenTable, loadingAuth } = useContext(AuthContext);
  const [names, setName] = useState("");
  const [table, setTable] = useState("");

  const [hasPermission, setHasPermission] = useState<SetStateAction<boolean>>();
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");

  const askforCamerapermission = () => {
    async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
  };

  // useEffect(() => {

  //   socketService.on("connect", () => {
  //     console.log("Conectado ao servidor Socket.IO");
  //   });

  
  //   socketService.on("chat.message", (data) => {
  //     console.log("Mensagem recebida:", data);
     
  //   });
   
  //   return () => {
  //     socketService.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    setText(data);

    if (names === "") {
      ToastAndroid.show("Digite o seu nome!", ToastAndroid.SHORT);
      return;
    }

    const string = `${data}`;

    try {
      const response = await api.get("/table/list", {
        params: {
          nameqrcode: string,
        },
      });


      if (response.data.length > 0) {
        response.data.map(async function (num: { id: Number }) {
          let table_id = Number(num.id);

          let name: string = names;
      

          try {
            await OpenTable({ name, table_id });
          } catch (error) {
            ToastAndroid.show("erro", ToastAndroid.SHORT)
          }
        });
      } else {
        ToastAndroid.show("QRCode incorreto!", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Erro", ToastAndroid.SHORT);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>requisição camera</Text>
        <Button
          title={"Permitr acesso a camera"}
          onPress={() => askforCamerapermission()}
        />
      </View>
    );
  }

  async function handleOpenOrder() {
    if (table === "" || names === "") {
      ToastAndroid.show("Preencha todos os campos", ToastAndroid.SHORT);
      return;
    }

    const table_id = Number(table);
    const name = names;

    try {
      await OpenTable({ name, table_id });

 
      socketService.emit("open.table", {
        table: "pedido aberto"
       });
 
    
    } catch (error) {
      ToastAndroid.show("Esta Mesa não existe", ToastAndroid.SHORT);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assests/ExpressWaiter.png")}
      />

      <Text style={styles.title}>Novo Pedido</Text>

      <View style={styles.barcodebox}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          style={{ width: 300, height: 300 }}
        />
      </View>

      {scanned && (
        <Button
          title={"Toque para digitalizar novamente"}
          onPress={() => setScanned(false)}
          color="tomato"
        />
      )}

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#F0F0F0"
        style={styles.input}
        value={names}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Numero da Mesa"
        placeholderTextColor="#F0F0F0"
        keyboardType="numeric"
        style={styles.input}
        value={table}
        onChangeText={setTable}
      />

      <TouchableOpacity style={styles.button} onPress={handleOpenOrder}>
        {loadingAuth ? (
          <ActivityIndicator size={25} color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Abrir Mesa</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#1d1d2e",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 24,
  },
  input: {
    width: "90%",
    height: 65,
    backgroundColor: "#101026",
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#FFF",
    marginBottom: 12,
    marginTop: 10,
  },
  button: {
    width: "90%",
    height: 50,
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#101026",
    fontWeight: "bold",
  },
  logo: {},
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "#1d1d2e",
    marginBottom: 20,
  },
  cameraContainer: {
    marginHorizontal: 0,
    marginLeft: 0,
    marginStart: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingStart: 0,
    height: "115%",
    padding: 0,
  },
  bottomScan: {
    marginBottom: 10,
  },
  Button: {
    marginBottom: 10,
  },
});
