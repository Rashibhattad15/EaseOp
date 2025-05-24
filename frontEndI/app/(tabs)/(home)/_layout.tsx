import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Sauda Entry Page", headerShown: false }} />
      <Stack.Screen name="(saudaEntry)" options={{ title: "Sauda Entry", headerShown: false }} />
    </Stack>
  );
}
