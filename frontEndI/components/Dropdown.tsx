import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

interface DropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedValue, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setExpanded(!expanded)}>
        <Text>{selectedValue || "Select Role"}</Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { onSelect(item); setExpanded(false); }}>
              <Text style={styles.option}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold" },
  dropdown: { borderWidth: 1, padding: 10, borderRadius: 5, backgroundColor: "#f8f8f8" },
  option: { padding: 10, borderBottomWidth: 1 },
});

export default Dropdown;
