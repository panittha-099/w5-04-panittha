import { 
    View, 
    TextInput, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    FlatList, 
    SafeAreaView, 
    StatusBar, 
    Alert 
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Book = {
    id: string,
    name: string,
    price: string
}

export default function Add() {
    const [bookName, setBookName] = useState("");
    const [bookPrice, setBookPrice] = useState("");
    const [allBook, setAllBook] = useState<Book[]>([]);

    // แก้ไข: โหลดข้อมูลแค่ครั้งเดียวตอนเปิดหน้าแอพ (ใส่ [] ว่างๆ)
    useEffect(() => {
        loadBook();
    }, []);

    async function loadBook() {
        try {
            const data = await AsyncStorage.getItem("book");
            if (data !== null) {
                setAllBook(JSON.parse(data));
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function addBook() {
        if (!bookName.trim() || !bookPrice.trim()) {
            Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกชื่อและราคาหนังสือ");
            return;
        }

        const book: Book = {
            id: Date.now().toString(),
            name: bookName,
            price: bookPrice
        };

        const newBook = [...allBook, book];
        setAllBook(newBook); // อัพเดทหน้าจอทันที
        await AsyncStorage.setItem("book", JSON.stringify(newBook)); // บันทึกลงเครื่อง

        setBookName("");
        setBookPrice("");
    }

    // ฟังก์ชันสำหรับลบหนังสือ (แถมให้)
    async function deleteBook(id: string) {
        const filtered = allBook.filter(item => item.id !== id);
        setAllBook(filtered);
        await AsyncStorage.setItem("book", JSON.stringify(filtered));
    }

    // Component สำหรับแสดงการ์ดหนังสือแต่ละเล่ม
    const renderBookItem = ({ item }: { item: Book }) => (
        <View style={myStyle.card}>
            <View style={myStyle.bookIcon}>
                <Text style={{ fontSize: 20 }}>📚</Text>
            </View>
            <View style={myStyle.bookInfo}>
                <Text style={myStyle.bookTitle}>{item.name}</Text>
                <Text style={myStyle.bookPrice}>{item.price} บาท</Text>
            </View>
            <TouchableOpacity onPress={() => deleteBook(item.id)}>
                <Text style={myStyle.deleteText}>ลบ</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={myStyle.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={myStyle.headerContainer}>
                <Text style={myStyle.headerTitle}>ร้านหนังสือของฉัน 📖</Text>
                <Text style={myStyle.headerSubtitle}>บันทึกรายการหนังสือใหม่</Text>
            </View>

            <View style={myStyle.inputContainer}>
                <Text style={myStyle.label}>ชื่อหนังสือ</Text>
                <TextInput 
                    value={bookName} 
                    onChangeText={setBookName} 
                    style={myStyle.input} 
                    placeholder="เช่น Harry Potter"
                    placeholderTextColor="#aaa"
                />
                
                <Text style={myStyle.label}>ราคาหนังสือ (บาท)</Text>
                <TextInput 
                    value={bookPrice} 
                    onChangeText={setBookPrice} 
                    style={myStyle.input} 
                    keyboardType="numeric"
                    placeholder="เช่น 450"
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity style={myStyle.button} onPress={addBook}>
                    <Text style={myStyle.buttonText}>+ บันทึกข้อมูล</Text>
                </TouchableOpacity>
            </View>

            <View style={myStyle.listContainer}>
                <Text style={myStyle.listHeader}>รายการหนังสือ ({allBook.length})</Text>
                <FlatList 
                    data={allBook}
                    keyExtractor={item => item.id}
                    renderItem={renderBookItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const myStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA", // สีพื้นหลังเทาอ่อนๆ สบายตา
        paddingTop: 20,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#7F8C8D",
        marginTop: 5,
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 20,
        // เพิ่มเงาให้ดูมีมิติ (Shadow)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, // เงาสำหรับ Android
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#34495E",
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#E0E6ED",
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: "#F9FAFB",
        fontSize: 16,
        color: "#2C3E50",
    },
    button: {
        backgroundColor: "#3498DB", // สีฟ้าสดใส
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        marginBottom: 10,
        shadowColor: "#3498DB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    listContainer: {
        flex: 1,
        marginTop: 25,
        paddingHorizontal: 20,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 15,
    },
    // สไตล์ของการ์ดหนังสือ
    card: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
        // เงาเบาๆ
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    bookIcon: {
        width: 45,
        height: 45,
        backgroundColor: "#ECF0F1",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2C3E50",
    },
    bookPrice: {
        fontSize: 14,
        color: "#27AE60", // สีเขียวสำหรับราคา
        marginTop: 4,
        fontWeight: "bold",
    },
    deleteText: {
        color: "#E74C3C", // สีแดงสำหรับปุ่มลบ
        fontWeight: "600",
        padding: 5,
    }
});