import React, { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "../services/api";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import socketService from "../services/SocketService";

type AuthContextData = {
  user: UserProps;
  order: OrderProps;
  isAuthenticated: boolean;
  isAuthenticatedOrder: boolean;
  OpenTable: (credentials: OpenTableProps) => Promise<void>;
  InAttendance: (credentials: SendOrderProps) => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
  finishTable: () => Promise<void>;
};

export type UserProps = {
  id: string;
  name: string;
  table_id: number;
};

type AuthProviderProps = {
  children: ReactNode;
};

export type OrderProps = {
  id: string;
  name: string;
  status: string;
  total: number;
  table_id: number;
};

export type SendOrderProps = {
  id: string;
};

type OpenTableProps = {
  name: string;
  table_id: number;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    table_id: 0,
    name: "",
  });

  const [order, setOrder] = useState<OrderProps>({
    id: "",
    name: "",
    status: "",
    total: 0,
    table_id: 0,
  });
  

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user.id;
  const isAuthenticatedOrder = !!order.id;

  useEffect(() => {
    async function getUser() {
      //pegar os dados salvos do user
      const userInfo = await AsyncStorage.getItem("@expresswaiter");
      let hasUser: UserProps = JSON.parse(userInfo || "{}");

      //verificar se recebemos as informações dele
      if (Object.keys(hasUser).length > 0) {
        setUser({
          id: hasUser.id,
          name: hasUser.name,
          table_id: hasUser.table_id,
        });
      }

      setLoading(false);
    }

    async function getOrder() {
      //pegar os dados salvos do user
      const OrderInfo = await AsyncStorage.getItem("@expresswaiter_order");

      let hasOrder: OrderProps = JSON.parse(OrderInfo || "{}");

      //verificar se recebemos as informações dele
      if (Object.keys(hasOrder).length > 0) {
        setOrder({
          id: hasOrder.id,
          name: hasOrder.name,
          status: hasOrder.status,
          total: hasOrder.total,
          table_id: hasOrder.table_id,
        });
      }

      setLoading(false);
    }

    getUser();
    getOrder();
  }, []);

  async function OpenTable({ table_id, name }: OpenTableProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post("/order", {
        name,
        table_id,
      });

      const { id } = response.data;

      

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@expresswaiter", JSON.stringify(data));

      setUser({
        id,
        name,
        table_id,
      });

      setLoadingAuth(false);

   
    
    } catch (Erro) {
      ToastAndroid.show("Esta Mesa não existe", ToastAndroid.SHORT);
      setLoadingAuth(false);
    }
  }

  async function InAttendance({ id }: SendOrderProps) {
    setLoadingAuth(true);

    try {
      const response = await api.put("/order/send", {
        id,
      });

      const { name, status, total, table_id } = response.data;

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@expresswaiter_order", JSON.stringify(data));

      setOrder({
        id,
        name,
        status,
        total,
        table_id,
      });

      setLoadingAuth(false);
    } catch (Erro) {
      console.log("erro ao acessar", Erro);
      setLoadingAuth(false);
    }
  }

  async function finishTable() {
    AsyncStorage.clear().then(() => {
      setUser({
        id: "",
        name: "",
        table_id: 0,
      });
    });

    
    socketService.emit("delete.order", {
      table: "pedido deletado, finalizado ou cancelado"
     });

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        order,
        isAuthenticated,
        isAuthenticatedOrder,
        OpenTable,
        InAttendance,
        loading,
        loadingAuth,
        finishTable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
