import { Stack } from "expo-router";

export default function UserConfigurationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "User Configurations", headerShown: false }} />
      <Stack.Screen name="AddUser" options={{ title: "Add User", headerShown: false }} />
      <Stack.Screen name="AddRole" options={{ title: "Add Role", headerShown: false }} />
      <Stack.Screen name="DisplayRole" options={{ title: "Roles", headerShown: false }} />
    </Stack>
  );
}
