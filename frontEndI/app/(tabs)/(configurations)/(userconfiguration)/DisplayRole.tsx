import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, ScrollView, TouchableOpacity } from "react-native";
import {
  Appbar,
  ActivityIndicator,
  IconButton,
  Card,
  Text,
} from "react-native-paper";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { app } from "../../../../firebaseConfig";
import { UserRole } from "../../../../../commons/models/configurations/UserRole";
import { useOffice } from "@/context/OfficeContext";

export default function DisplayRole() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const db = getDatabase(app);
  const { officeId } = useOffice();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);

  const { username, email, password, selectedRole } = params;

  useEffect(() => {
    if (!officeId) {
      console.warn("OfficeId not set");
      return;
    }
    fetchRoles();
  }, [officeId]);

  const fetchRoles = () => {
    setLoading(true);
    const rolesRef = ref(db, `offices/${officeId}/roles`);
    onValue(rolesRef, (snapshot) => {
      const data: Record<string, UserRole> | null = snapshot.val();
      if (data) {
        setRoles(Object.entries(data).map(([id, role]) => ({ id, ...role })));
      } else {
        setRoles([]);
      }
      setLoading(false);
    });
  };

  const deleteRole = (roleId: string) => {
    const roleRef = ref(db, `offices/${officeId}/roles/${roleId}`);
    remove(roleRef);
  };

  const selectRole = (role: UserRole) => {
    router.replace({
      pathname: "/AddUser",
      params: {
        username,
        email,
        password,
        selectedRole: JSON.stringify(role),
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Select Role" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator />
      ) : (
        roles.map((role, index) => (
          <TouchableOpacity key={role.uid || index} onPress={() => selectRole(role)}>
            <Card style={{ marginBottom: 12 }}>
              <Card.Title title={role.name} />
              <Card.Content>
                <Text>Screens Accessible:</Text>
                {role.screensAccessible?.map((screen) => (
                  <Text key={screen} style={{ marginLeft: 8 }}>• {screen}</Text>
                ))}
              </Card.Content>
              <Card.Actions>
                <IconButton icon="delete" onPress={() => deleteRole(role.uid!)} />
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
