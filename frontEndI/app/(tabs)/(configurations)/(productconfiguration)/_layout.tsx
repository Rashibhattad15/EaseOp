import { Stack } from "expo-router";

export default function ProductConfigurationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Product Configuration", headerShown: false }} />
      <Stack.Screen name="AddItemDialog" options={{ title: "Add Item", headerShown: false }} />
      <Stack.Screen name="ItemListScreen" options={{ title: "Item List", headerShown: false }} />
      <Stack.Screen name="UnitsListScreen" options={{ title: "Unit List", headerShown: false }} />
      <Stack.Screen name="CategoriesListScreen" options={{ title: "Categories List", headerShown: false }} />
      <Stack.Screen name="AddUnitDialog" options={{ title: "Add Unit", headerShown: false }} />
      <Stack.Screen name="AddCategoryDialog" options={{ title: "Add Category", headerShown: false }} />
      <Stack.Screen name="SelectCategory" options={{ title: "Select Category", headerShown: false }} />
    </Stack>
  );
}
