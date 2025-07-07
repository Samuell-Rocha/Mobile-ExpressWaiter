import { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/api";
import socketService from "../../services/SocketService";

interface ModalAssess {
  handleCloseModal: () => void;
}

interface RatingBarProps {
  category: string;
  currentRating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}

export function Assessment({ handleCloseModal }: ModalAssess) {
  const { order } = useContext(AuthContext);

  const [ambienteRating, setAmbienteRating] = useState<number>(5);
  const [comidaRating, setComidaRating] = useState<number>(5);
  const [precoRating, setPrecoRating] = useState<number>(5);
  const [tempoRating, setTempoRating] = useState<number>(5);

  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  async function Rating(
    ambienteRating: number,
    comidaRating: number,
    precoRating: number,
    tempoRating: number
  ) {
    try {
      await api.post("/rating", {
        order_id: order.id,
        establishment: ambienteRating,
        food: comidaRating,
        service: precoRating,
        waitingtime: tempoRating,
      });
      handleCloseModal();
    } catch (error) {
      ToastAndroid.show("Erro!", ToastAndroid.SHORT);
    }
  }

  const RatingBar: React.FC<RatingBarProps> = ({
    category,
    currentRating,
    setRating,
  }) => {
    return (
      <View style={styles.ratingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setRating(item)}
            >
              <Image
                style={styles.starImageStyle}
                source={
                  item <= currentRating
                    ? require("../../assests/star_filled.png")
                    : require("../../assests/star_corner.png")
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.TitleStyle}>Classifique a sua experiência</Text>
      <View style={styles.content}>
        <Text style={styles.textStyle}>Ambiente</Text>
        <RatingBar
          category="ambiente"
          currentRating={ambienteRating}
          setRating={setAmbienteRating}
        />
        <Text style={styles.textStyle}>Comida</Text>
        <RatingBar
          category="comida"
          currentRating={comidaRating}
          setRating={setComidaRating}
        />
        <Text style={styles.textStyle}>Preço</Text>
        <RatingBar
          category="preco"
          currentRating={precoRating}
          setRating={setPrecoRating}
        />
        <Text style={styles.textStyle}>Tempo de espera</Text>
        <RatingBar
          category="tempo"
          currentRating={tempoRating}
          setRating={setTempoRating}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonStyle}
        onPress={() =>
          Rating(ambienteRating, comidaRating, precoRating, tempoRating)
        }
      >
        <Text style={styles.buttonTextStyle}>Enviar avaliação</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    padding: 10,
    textAlign: "center",
    height: "auto",
    width: "auto",
    justifyContent: "space-around",
  },
  content: {},
  TitleStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    color: "#FFF",
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
    padding: 15,
    backgroundColor: "#8ad24e",
    marginLeft: "3%",
    marginRight: "3%",
    borderRadius: 4
  },
  buttonTextStyle: {
    fontSize: 20,
    color: "#1d1d2e",
    textAlign: "center",
    fontWeight: "bold"
  },
  ratingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  starImageStyle: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  textStyle: {
    textAlign: "center",
    fontSize: 25,
    color: "#FFF",
    marginTop: 30,
  },
});
