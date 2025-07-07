import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import {Feather} from '@expo/vector-icons'

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";

type RouteDetailParams ={
    WaitOrder:{
        table_id : string | number;
        order_id: string
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'WaitOrder'>

export function WaitORder(){

    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    async function handleFinishOrder(){
        try {
            await api.put('order/send', {
                order_id: route.params?.order_id
            })
            
        } catch (error) {
            console.log("Erro ao finalizar")
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.alert}>Você deseja concluir esse pedido?</Text>
            <Text style={styles.title}>Mesa 30</Text>

            <TouchableOpacity style={styles.button} onPress={handleFinishOrder}>
                <Text style={styles.textButton}>Enviar pedido</Text>
                <Feather name="shopping-cart" size={20} color="#1d1d2e" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alert:{
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 12
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom:12,
    },
    button:{
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    textButton:{
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1d1d2e'
    }
})