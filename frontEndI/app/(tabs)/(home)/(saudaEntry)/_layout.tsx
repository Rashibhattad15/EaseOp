import { Stack } from "expo-router";

export default function SaudaEntryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Sauda Entry Page", headerShown: false }} />
      <Stack.Screen name="SaudaCreationScreen" options={{ title: "Create Sauda Entry", headerShown: false }} />
      <Stack.Screen name="SaudaApprovalScreen" options={{ title: "Approve Sauda Entry", headerShown: false }} />
    </Stack>
  );
}
