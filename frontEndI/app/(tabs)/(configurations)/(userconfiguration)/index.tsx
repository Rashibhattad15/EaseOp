import React from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Use Expo Router for navigation
import { AntDesign } from "@expo/vector-icons"; // Expo Icons for FAB
import UserConfigCard from "../../../../components/userconfig/UserConfigCard";
import { useUserConfig } from "../../../../hooks/useUserConfig";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Appbar } from "react-native-paper";

const DisplayUserConfigurationScreen = () => {
  const { configs, loading } = useUserConfig();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight(); // Get dynamic bottom navigation height

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  }

  const handleEdit = (uid: string) => console.log(`Edit user with UID: ${uid}`);
  const handleDelete = (uid: string) => console.log(`Delete user with UID: ${uid}`);
  const handleAddUser = () => {
    console.log("Navigating to Add User Screen");
    router.push("/AddUser");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="User Configurations" />
      </Appbar.Header>

      <FlatList
        data={configs}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => <UserConfigCard config={item} onEdit={handleEdit} onDelete={handleDelete} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }} // Ensures list doesn't cover button
      />

      {/* Floating Action Button (FAB) positioned dynamically */}
      <View style={{ position: "absolute", bottom: tabBarHeight + 20, right: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#007AFF",
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 2, height: 2 },
            zIndex: 10, // Ensure it's above other elements
          }}
          onPress={handleAddUser}
        >
          <AntDesign name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default DisplayUserConfigurationScreen;
