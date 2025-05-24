import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, secureTextEntry, errorMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, errorMessage && styles.errorInput]} 
        value={value} 
        onChangeText={onChangeText} 
        secureTextEntry={secureTextEntry}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12 },
});

export default InputField;
