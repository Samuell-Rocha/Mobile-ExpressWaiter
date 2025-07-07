//Rotas para somente usuarios com pedido não aberto

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Qrcode from "../pages/Qrcode";


const Stack = createNativeStackNavigator();

function AuthRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Qrcode" component={Qrcode} options={{headerShown : false}}/>
        </Stack.Navigator>
    )
}

export default AuthRoutes;