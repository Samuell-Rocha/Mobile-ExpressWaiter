import React from "react";
import { View, Text, StyleSheet, Dimensions , TouchableOpacity, ScrollView} from "react-native";

import { CategoryProps } from "../../pages/Order";
import { ProductProps } from "../../pages/Order";

interface ModalPickerProps {
    options: CategoryProps[] | ProductProps[];
    handleCloseModal: () => void;
    selectedItem: (item: CategoryProps | ProductProps) => void;
}



const {width: WIDTH, height: HEIGHT} = Dimensions.get('window')

export function ModalPicker({options, handleCloseModal, selectedItem}: ModalPickerProps) {
 
 function onPressItem(item: CategoryProps | ProductProps){
    selectedItem(item)

    handleCloseModal();
 }
 
 const option = options.map((item, index) =>(
    <TouchableOpacity key={index} style={styles.option} onPress={ () => onPressItem(item)}>
        <Text style={styles.item}>
            {item?.name}
        </Text>
    </TouchableOpacity>
 
 
    ))


    return (
    <TouchableOpacity style={styles.container} onPress={handleCloseModal} >
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {option}
        </ScrollView>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 'auto',
        width: 'auto',
        marginBottom: 40
        
      
    },
    content:{
        width: WIDTH - 20,
        height: 'auto',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 4,
        maxHeight: 'auto',
        marginTop: '45%',
    },
    option:{
        alignItems: 'flex-start',
        borderTopColor: '#8a8a8a',
        borderWidth: 0.8
    },
    item:{
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
})