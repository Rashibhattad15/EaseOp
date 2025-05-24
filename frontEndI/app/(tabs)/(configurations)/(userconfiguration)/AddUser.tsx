import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Appbar,
  TextInput,
  Button,
  Card,
  Divider,
  Text,
} from "react-native-paper";
import PasswordInput from "@/components/PasswordInput";
import { useOffice } from "@/context/OfficeContext";
import { UserRole } from "../../../../../commons/models/configurations/UserRole";
import axios from "axios";

const AddUser: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const params = useLocalSearchParams();

  const {officeId} = useOffice()

  // Update role when returning from DisplayRole
  useEffect(() => {
    if (params.selectedRole) {
      try {
        console.log("Restoring selected oasdjf...");
        const parsedRole: UserRole = JSON.parse(params.selectedRole as string);
        setRole(parsedRole);
      } catch (error) {
        console.error("Error parsing selectedRole:", error);
      }
    }
  
    // Restore username, email, and password if they exist in params
    if (params.username) setUsername(params.username as string);
    if (params.email) setEmail(params.email as string);
    if (params.password) setPassword(params.password as string);
  }, [params.selectedRole]);
  


  const handleSubmit = async () => {

    if (!username || !email || !password || !role) {
      console.error("All fields are required!");
      return;
    }
  
    try {
      // Detailed logging of request payload
      console.log("Registration Payload:", {
        userName: username,
        email: email,
        password: password,
        roleId: role.uid,
        officeId: officeId
      });
  
      const API_URL = "http://192.168.0.106:5000";
      console.log("Sending request to:", `${API_URL}/api/auth/register`);

    const response = await axios.post(`${API_URL}/api/auth/register`, {
      userName: username,
      email: email,
      password: password,
      roleId: role.uid,
      officeId: officeId
    });
  
      // Log full response details
      console.log("Response Status:", response.status);

      router.back();
    } catch (error: any) {
      // Comprehensive error logging
      console.error("Error registering user:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
  
      // Optional: Show user-friendly error message
      Alert.alert(
        "Registration Error", 
        error.message || "Failed to register user. Please try again."
      );
    }
  };
  

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
      {/* App Bar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Add User" />
      </Appbar.Header>

      {/* Form Card */}
      <Card style={{ padding: 16 }}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

        {/* Role Selection Button */}
        <Button
        mode="outlined"
        onPress={() =>
          router.push({
            pathname: "/DisplayRole",
            params: {
              username,
          email,
          password,
          selectedRole: role ? JSON.stringify(role) : null,
            },
          })
        }
      >
        {role ? `Role: ${role.name}` : "Select Role"}
        </Button>

        {/* Hyperlink to Add Role */}
        <TouchableOpacity onPress={() => router.push("/AddRole")}>
          <Text
            style={{
              color: "blue",
              marginTop: 8,
              textDecorationLine: "underline",
            }}
          >
            View Roles
          </Text>
        </TouchableOpacity>

        <Divider style={{ marginVertical: 12 }} />

        <PasswordInput password={password} setPassword={setPassword} />

        <Button mode="contained" onPress={handleSubmit}>
          Save
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={{ marginTop: 8 }}
        >
          Cancel
        </Button>
      </Card>
    </View>
  );
};

export default AddUser;
