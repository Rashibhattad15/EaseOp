import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ScrollView } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Card,
  Divider,
  ActivityIndicator,
  IconButton,
  Checkbox,
  Text,
} from "react-native-paper";
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { app } from "../../../../firebaseConfig";
import { UserRole } from "../../.././/../../commons/models/configurations/UserRole";
import { useOffice } from "@/context/OfficeContext";

const UserRolesScreen: React.FC = () => {
  const router = useRouter();
  const db = getDatabase(app);
  const {officeId} = useOffice();

 
  const [newRole, setNewRole] = useState("");
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [availableScreens, setAvailableScreens] = useState<string[]>([]);

  useEffect(() => {
    if(!officeId){
      console.warn("OfficeId not set")
      return;
    }else{
      fetchScreens();
    }
  }, [officeId]);

  

  const fetchScreens = () => {
    const screensRef = ref(db, "screens");
    onValue(screensRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data)
        setAvailableScreens(Object.keys(data));
      }
    });
  };

  const handleToggleScreen = (screen: string) => {
    setSelectedScreens((prev) =>
      prev.includes(screen)
        ? prev.filter((s) => s !== screen)
        : [...prev, screen]
    );
  };

  const addRole = () => {
    const uid = `ROLE-${Date.now()}`
    if (!newRole.trim()) return;
    const newRoleRef = ref(db, `offices/${officeId}/roles/${uid}`);
    set(newRoleRef, {
      uid,
      name: newRole,
      screensAccessible: selectedScreens,
    }).then(() => {
      setNewRole("");
      setSelectedScreens([]);
    });
  };

  

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="User Roles" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          label="New Role Name"
          value={newRole}
          onChangeText={setNewRole}
          style={{ marginBottom: 12 }}
        />

        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Select Screens:
        </Text>
        {availableScreens.map((screen) => (
          <Checkbox.Item
            key={screen}
            label={screen}
            status={selectedScreens.includes(screen) ? "checked" : "unchecked"}
            onPress={() => handleToggleScreen(screen)}
          />
        ))}

        <Button
          mode="contained"
          onPress={addRole}
          disabled={!newRole.trim()}
          style={{ marginVertical: 16 }}
        >
          Add Role
        </Button>

        <Divider style={{ marginVertical: 8 }} />
      </ScrollView>
    </View>
  );
};

export default UserRolesScreen;
