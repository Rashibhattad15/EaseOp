import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Icon for eye toggle

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword, label = "Password" }) => {
  const [secureText, setSecureText] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureText}
        placeholder={label}
        style={styles.textInput}
        placeholderTextColor="#9E9E9E"
      />
      <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.icon}>
        <MaterialCommunityIcons name={secureText ? "eye-off" : "eye"} size={24} color="#3C4858" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#3C4858",
    shadowColor: "#9E9E9E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#3C4858",
  },
  icon: {
    padding: 10,
  },
});

export default PasswordInput;
