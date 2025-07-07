//Rotas para somente usuarios com pedido aberto

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Order from "../pages/Order";
import { FinishOrder } from "../pages/FinishOrder";
import { WaitORder } from "../pages/WaitOrder";
import { InAttendance } from "../pages/InAttendance";
import CustomHeaderTitle from "../pages/FinishOrder/botton";

export type StackPramsList = {
  Order: {
    table_id: number | string;
    name: string;
  };
  FinishOrder: {
    table_id: number | string;
    order_id: string;
    total: number
  };
  InAttendance:{
    id: string;
    name: string;
    status: string;
    total: number;
    table_id: number;
  }
};

const Stack = createNativeStackNavigator<StackPramsList>();

function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FinishOrder"
        component={FinishOrder}
        options={{
          headerTitle: () => <CustomHeaderTitle />,
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerTintColor: "#FFF",
        }}
      />

      <Stack.Screen
      name="InAttendance"
      component={InAttendance}
      options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AppRoutes;
