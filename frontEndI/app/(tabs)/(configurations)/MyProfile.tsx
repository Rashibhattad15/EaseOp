import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth } from "../../../firebaseConfig";
import { router } from "expo-router";

export default function MyProfile() {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/"); // Redirect to login after sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Profile</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
