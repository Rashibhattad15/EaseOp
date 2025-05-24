import { Stack } from "expo-router";

export default function ConfigurationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Configurations", headerShown: false }} />
      <Stack.Screen name="MyProfile" options={{ title: "My Profile", headerShown: false }} />
      <Stack.Screen name="(userconfiguration)" options={{ title: "User Configuration", headerShown: false }} />
      <Stack.Screen name="(productconfiguration)" options={{ title: "Product Configuration", headerShown: false }} />
      <Stack.Screen name="(customerconfiguration)" options={{ title: "Customer Configuration", headerShown: false }} />
    </Stack>
  );
}
