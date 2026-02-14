import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity, } from "react-native";
import { useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

type Book ={
    id : string,
    name : string,
    price : string
}

export default function Home(){
    const [allBook,setAllBook] =useState<Book[]>([])

    useEffect( () => {
        loadBook()
    }, [allBook])

    async function loadBook(){
        const data = await AsyncStorage.getItem("book")
        if(data !== null){
            setAllBook(JSON.parse(data))
        }    
    }

    async function removeBook(id:String){
        const newBook =allBook.filter((_, i) => _.id !=id)
        await AsyncStorage.setItem("book",JSON.stringify(newBook))
    }
        
    


    return(
        <View>
            
        <FlatList
            data={allBook}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <View>
                    <Text>รหัส : {item.id}</Text>
                    <Text>เรื่อง : {item.name}</Text>
                    <Text>ราคา : {item.price}</Text>
                    <TouchableOpacity onPress={() => removeBook(item.id)}>
                        <Text style={{color:"red"}}>ลบ</Text>
                    </TouchableOpacity>
                </View>
            )}
        />

        </View>
    )
}