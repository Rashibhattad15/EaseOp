import { Stack } from "expo-router";

export default function CustomerConfigurationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Customer Configurations", headerShown: false }} />
      <Stack.Screen name="AddEditCustomer" options={{ title: "AddEditCustomer", headerShown: false }} />
      <Stack.Screen name="SelectCustomer" options={{ title: "SelectCustomer", headerShown: false }} />
    </Stack>
  );
}
