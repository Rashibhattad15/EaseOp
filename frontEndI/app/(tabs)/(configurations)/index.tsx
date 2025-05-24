import { Ionicons } from "@expo/vector-icons";




import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";

export default function index() {

    const configOptions = [
    { title: "My Profile", route: "/MyProfile" },
    { title: "User Configurations", route: "/(tabs)/(configurations)/(userconfiguration)" },
    { title: "Product Configurations", route: "/(tabs)/(configurations)/(productconfiguration)" },
    { title: "Customer Configurations", route: "/(tabs)/(configurations)/(customerconfiguration)" },
  ];  
  
  return (
    <SafeAreaView>
       <Text style={styles.header}>Configurations</Text>
       <FlatList
        data={configOptions}
        keyExtractor={(item) => item.route}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => router.push(item.route as never)}
          >
            <Text style={styles.itemText}>{item.title}</Text>
            <Ionicons name="arrow-forward" size={24} color="black" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    paddingTop: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  itemText: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    width: "90%",
    backgroundColor: "#E8EAF6",
  },
});